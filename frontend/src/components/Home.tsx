import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import RewardModal from "./RewardModal";
import { BackgroundBeams } from "./ui/background-beams";

interface TokenContract {
  balanceOf: (owner: string) => Promise<ethers.BigNumberish>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
}

interface UserContract {
  getTokenBalance: (tokenAddress: string) => Promise<ethers.BigNumberish>;
}

const tokenAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const contractAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; 
const contractABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

const userContractABI = [
  "function getTokenBalance(address tokenAddress) view returns (uint256)",
];

const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Admin address

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loader state
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Check if admin

  const connectWallet = async (): Promise<void> => {
    if (window.ethereum) {
      setIsLoading(true); // Show loader
      try {
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);
        await fetchBalance(connectedAccount);

        // Check if connected account is admin
        if (connectedAccount.toLowerCase() === adminAddress.toLowerCase()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };
  const fetchBalance = async (connectedAccount: string): Promise<void> => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const userContract = new ethers.Contract(
        contractAddress,
        userContractABI,
        provider
      ) as unknown as UserContract;
  
      try {
        const balance = await userContract.getTokenBalance(tokenAddress);
        console.log("Fetched Balance:", balance.toString());
  
        const tokenContract = new ethers.Contract(
          tokenAddress,
          contractABI,
          provider
        ) as unknown as TokenContract;
  
        const tokenSymbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
  
        setBalance(ethers.formatUnits(balance, decimals));
        setTokenSymbol(tokenSymbol);
      } catch (error: any) {
        console.error("Error fetching balance:", error);
        alert("Could not fetch balance. Please try again.");
      }
    } else {
      alert("Ethereum provider is not available.");
    }
  };

  
  const handleRewardSelect = (rewardType: string) => {
    console.log(`Selected Reward Type: ${rewardType}`);
    navigate(`/reward/${rewardType}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="h-screen w-full bg-neutral-900 relative flex flex-col items-center justify-center antialiased">
        <BackgroundBeams className="absolute inset-0 z-0" />
        <div
          className="max-w-2xl mx-auto p-10 relative z-10 border border-gray-200 bg-opacity-30 backdrop-blur-lg rounded-lg"
          style={{ borderColor: "rgba(255, 255, 255, 0.5)" }}
        >
          <h1 className="text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 mb-10 to-neutral-600 text-center font-sans font-bold">
            Academic Reward System
          </h1>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10 mb-10">
            Welcome to our platform, where we facilitate academic rewards based
            on your achievements.
          </p>
          <div className="relative z-10">
            {!account ? (
              <button
                onClick={connectWallet}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
              >
                Connect MetaMask
              </button>
            ) : isLoading ? (
              <div className="flex items-center justify-center mt-4">
                <svg
                  className="animate-pulse h-8 w-8 text-gray-400 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8zm4 0c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z"
                  />
                </svg>
                <p className="text-lg text-gray-400">Connecting...</p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-lg text-gray-400">Connected Account:</p>
                <p className="text-lg font-semibold text-white">{account}</p>
                <div className="mt-4">
                  <p className="text-lg text-gray-400">Balance:</p>
                  <p className="text-lg font-semibold text-white">
                    {balance} {tokenSymbol}
                  </p>
                </div>
                {/* Role-specific Button */}
                <div className="mt-6">
                  {isAdmin ? (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-500 transition"
                    >
                      Add Reward
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/student/history")}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
                    >
                      View History
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <RewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleRewardSelect}
      />
    </div>
  );
};

export default Home;
