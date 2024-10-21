import React, { useState } from 'react'; 
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from './ui/GradientBackground';

const CreateAssignment: React.FC = () => {
  const [assignmentId, setAssignmentId] = useState<number | string>('');
  const [title, setTitle] = useState<string>('');
  const [rewardAmount, setRewardAmount] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>(''); // Amount to transfer to contract
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const rewardSystemAddress = import.meta.env.VITE_ASSIGNMENTREWARD_ADDRESS || "";
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || "";

  const rewardSystemABI = [
    "function createAssignment(uint256 assignmentId, string memory title, uint256 rewardAmount) external",
    "function contractBalance() external view returns (uint256)",
    "function transfer(address recipient, uint256 amount) external returns (bool)" // Add transfer function
  ];

  const handleTransferToContract = async () => {
    if (!transferAmount) {
      setMessage('Please enter the transfer amount.');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenContract = new ethers.Contract(tokenAddress, [
        "function transfer(address recipient, uint256 amount) external returns (bool)"
      ], signer);

      const parsedTransferAmount = ethers.parseUnits(transferAmount, 18);

      const tx = await tokenContract.transfer(rewardSystemAddress, parsedTransferAmount);
      await tx.wait();

      setMessage(`Successfully transferred ${transferAmount} tokens to the contract.`);
      setTransferAmount('');
    } catch (error: any) {
      console.error("Token transfer failed:", error);
      setMessage(`An error occurred: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!assignmentId || !title || !rewardAmount) {
      setMessage('Please enter all fields.');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const rewardSystemContract = new ethers.Contract(rewardSystemAddress, rewardSystemABI, signer);
      const tokenContract = new ethers.Contract(tokenAddress, [
        "function approve(address spender, uint256 amount) external returns (bool)"
      ], signer);

      const parsedRewardAmount = ethers.parseUnits(rewardAmount, 18);

      // Approve the reward system contract to spend the reward amount
      const approveTx = await tokenContract.approve(rewardSystemAddress, parsedRewardAmount);
      await approveTx.wait(); // Wait for the approval transaction to confirm

      // Create the assignment
      const tx = await rewardSystemContract.createAssignment(assignmentId, title, parsedRewardAmount);
      await tx.wait();

      setMessage(`Successfully created assignment ${assignmentId}: ${title} with reward ${rewardAmount} tokens.`);
      setAssignmentId('');
      setTitle('');
      setRewardAmount('');
    } catch (error: any) {
      console.error("Creating assignment failed:", error);
      if (error.message.includes("Assignment already exists")) {
        setMessage('Assignment already exists.');
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
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400">Create Assignment</h2>
          <div className="mt-4 space-y-4 w-full">
            <input
              type="number"
              placeholder="Assignment ID"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white mb-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white mb-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Reward Amount"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white mb-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Transfer Amount to Contract"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white mb-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTransferToContract}
              className={`w-full p-2 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded shadow hover:bg-blue-500 transition duration-200 ease-in-out`}
              disabled={loading}
            >
              {loading ? 'Transferring...' : 'Transfer Tokens to Contract'}
            </button>
            <button
              onClick={handleCreateAssignment}
              className={`w-full p-2 ${loading ? 'bg-gray-400' : 'bg-green-600'} text-white rounded shadow hover:bg-green-500 transition duration-200 ease-in-out`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
          {message && <p className="mt-2 text-white">{message}</p>}
        </div>
      </GradientBackground>
    </div>
  );
};

export default CreateAssignment;
