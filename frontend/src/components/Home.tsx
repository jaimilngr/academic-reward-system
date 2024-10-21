import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import RewardModal from "./RewardModal";
import { BackgroundBeams } from "./ui/background-beams";

interface TokenContract {
  balanceOf(owner: string): Promise<ethers.BigNumberish>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
}

export interface UserContract {
  getUserAddress(): Promise<string>;
  getTokenBalance(tokenAddress: string, userAddress: string): Promise<ethers.BigNumberish>;
}
const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || "";
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || ""; 
const contractABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

const userContractABI = [
  "function getUserAddress() view returns (address)",
  "function getTokenBalance(address tokenAddress, address userAddress) view returns (uint256)", 
];

const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS || ""; 

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);
        await fetchBalance(connectedAccount);
        setIsAdmin(connectedAccount.toLowerCase() === adminAddress.toLowerCase());
      } else {
        // If no accounts are connected
        setAccount(null);
        setBalance(null);
        setTokenSymbol(null);
      }
    };

    const handleChainChanged = async () => {
      // Handle chain change if needed (e.g., reset the account)
      setAccount(null);
      setBalance(null);
      setTokenSymbol(null);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        }
      }
    };

    // Listen for account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    // Listen for network changes
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      // Clean up the listeners when the component unmounts
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

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
        setIsAdmin(connectedAccount.toLowerCase() === adminAddress.toLowerCase());
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect to MetaMask. Please try again.");
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
        const balance = await userContract.getTokenBalance(tokenAddress, connectedAccount);
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
          <h1 className="text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 mb-10 to-neutral-300 text-center font-sans font-bold">
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-500 transition"
                >
                  {isAdmin ? "Select Reward Type" : "View Actions"}
                </button>
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
        isAdmin={isAdmin} 
      />
    </div>
  );
};

export default Home;
