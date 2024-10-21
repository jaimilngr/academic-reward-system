import React, { useState } from 'react'; 
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from './ui/GradientBackground';

// Main Component
const IndividualReward: React.FC = () => {
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || "";
  const rewardSystemAddress = import.meta.env.VITE_INDIVIDUALREWARD_ADDRESS || "";
  
  const tokenABI = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function balanceOf(address owner) public view returns (uint256)"
  ];

  const rewardSystemABI = [
    "function distributeReward(address recipient, uint256 amount) external",
    "function contractBalance() external view returns (uint256)"
  ];

  const handleDistributeReward = async () => {
    if (!recipientAddress || !tokenAmount) {
      setMessage('Please enter both the address and the amount.');
      return;
    }

    if (!ethers.isAddress(recipientAddress)) {
      setMessage('Invalid recipient address.');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const senderAddress = await signer.getAddress();

    // Check if the recipient address is the same as the sender's address
    if (recipientAddress.toLowerCase() === senderAddress.toLowerCase()) {
      setMessage("You can't transfer tokens to yourself.");
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      setMessage('Please install MetaMask to use this feature.');
      return;
    }

    const parsedTokenAmount = Number(tokenAmount);
    if (isNaN(parsedTokenAmount) || parsedTokenAmount <= 0) {
      setMessage('Please enter a valid token amount.');
      return;
    }

    setLoading(true);

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const balance = await tokenContract.balanceOf(senderAddress);
      console.log(`Balance: ${ethers.formatUnits(balance, 18)}`); // Debugging line

      // Check if the balance is 0
      if (Number(balance) === 0) {
        setMessage('You do not have enough balance to make this transfer.');
        return;
      }

      // Check if the balance is less than the amount to transfer
      if (Number(balance) < parsedTokenAmount) {
        setMessage('Insufficient balance to distribute the specified amount.');
        return;
      }

      const rewardSystemContract = new ethers.Contract(rewardSystemAddress, rewardSystemABI, signer);
      const contractBalance = await rewardSystemContract.contractBalance();
      console.log(`Contract Balance: ${ethers.formatUnits(contractBalance, 18)} tokens`);

      // Transfer tokens to the reward system contract
      const tx = await tokenContract.transfer(rewardSystemAddress, ethers.parseUnits(tokenAmount, 18));
      await tx.wait();
      console.log(`Transferred ${tokenAmount} tokens to the reward system contract.`);

      // Now distribute the tokens to the recipient
      const distributeTx = await rewardSystemContract.distributeReward(recipientAddress, ethers.parseUnits(tokenAmount, 18));
      await distributeTx.wait();

      setMessage(`Successfully distributed ${tokenAmount} tokens to ${recipientAddress}`);
      
      // Reset inputs
      setRecipientAddress('');
      setTokenAmount('');
    } catch (error: any) {
      console.error("Distribution failed:", error);

      // Check for specific error messages
      if (error.code === 'CALL_EXCEPTION') {
        setMessage('You do not have enough tokens or gas for this transaction.');
      } else {
        setMessage(`An error occurred: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500 transition duration-200 ease-in-out"
        >
          Back
        </button>
      </div>
      <GradientBackground>
        <div className="max-w-md w-full p-6 bg-black bg-opacity-70 rounded-lg shadow-lg backdrop-blur-lg border border-gray-700 z-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400">Individual Reward</h2>
          <div className="mt-4 space-y-4 w-full">
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white mb-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number" // Use number type for token amount
              placeholder="Token Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white mb-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleDistributeReward}
              className={`w-full p-2 ${loading ? 'bg-gray-400' : 'bg-green-600'} text-white rounded shadow hover:bg-green-500 transition duration-200 ease-in-out`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Distribute Reward'}
            </button>
          </div>
          {message && <p className="mt-2 text-white">{message}</p>}
        </div>
      </GradientBackground>
    </div>
  );
};

export default IndividualReward;
