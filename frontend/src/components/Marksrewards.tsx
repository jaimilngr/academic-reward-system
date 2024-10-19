import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { GradientBackground } from './ui/GradientBackground';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

// Interface for student data
interface StudentData {
  Student: string;
  Address: string;
  Marks: number; // Adjust this type if necessary
}

// Main Component
const MarksReward: React.FC = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [tokens, setTokens] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [isAllocated, setIsAllocated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || "";
  const rewardSystemAddress = import.meta.env.VITE_INDIVIDUALREWARD_ADDRESS || ""; // Use the correct address for MarksReward

  const tokenABI = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function balanceOf(address owner) public view returns (uint256)"
  ];

  const rewardSystemABI = [
    "function distributeRewardsInBatch(address[] recipients, uint256[] amounts) external", // Update to match the contract
    "function contractBalance() external view returns (uint256)"
  ];

  // Handle file upload
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (file) {
    // Clear existing data, tokens, error, and message before processing a new file
    setData([]);
    setTokens([]);
    setError('');
    setMessage(null);
    setIsAllocated(false);

    if (!file.name.endsWith('.xlsx')) {
      setError('Invalid file type. Please upload an Excel (.xlsx) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as ArrayBuffer;
      if (result) {
        processFile(result); // Pass the result to your process function
      } else {
        setError('Error reading file. Please try again.');
      }
    };
    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
  }
};

// Process the file and update the state to show new data
const processFile = (binaryStr: ArrayBuffer | null) => {
  const workbook = read(binaryStr, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const sheetData = utils.sheet_to_json<StudentData>(firstSheet);

  const requiredColumns = ['Student', 'Address', 'Marks'];
  const headers = Object.keys(sheetData[0] as StudentData);
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));

  if (missingColumns.length > 0) {
    setError('Error occurred. Missing required columns.');
    setData([]);
    return;
  }

  // Validate rows for missing Address or Marks
  const invalidRows = sheetData.filter(student => {
    return !student.Address || student.Marks == null || isNaN(student.Marks);
  });

  if (invalidRows.length > 0) {
    setError('Some rows have missing or invalid Address or Marks.');
    setData([]); // Prevent further processing if invalid
    return;
  }

  // If validation passes, update state with new data
  setData(sheetData);
  calculateTokens(sheetData); // Recalculate tokens for new data
  setError('');
};
  // Calculate token allocations based on marks
  const calculateTokens = (marksData: StudentData[]) => {
    const tokenValues = marksData.map(row => {
      const marks = row.Marks;
      if (typeof marks !== 'number' || isNaN(marks)) return 0;
      if (marks >= 36) return 10;
      if (marks >= 30) return 7;
      if (marks >= 20) return 5;
      return 2;
    });
    setTokens(tokenValues);
  };

  // Handle token distribution
  const handleDistributeReward = async () => {
    const recipientAddresses = data.map(student => student.Address);
    const amountsToDistribute = tokens;

    if (recipientAddresses.length === 0 || amountsToDistribute.length === 0) {
      setMessage('No recipients or token amounts to distribute.');
      return;
    }

    for (const addr of recipientAddresses) {
      if (!ethers.isAddress(addr)) {
        setMessage(`Invalid recipient address: ${addr}`);
        return;
      }
    }

    if (typeof window.ethereum === 'undefined') {
      setMessage('Please install MetaMask to use this feature.');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const senderAddress = await signer.getAddress();
      const balance = await tokenContract.balanceOf(senderAddress);

      // Calculate total tokens to distribute
      const totalTokensToDistribute = amountsToDistribute.reduce((a, b) => a + b, 0);
      if (Number(balance) < totalTokensToDistribute) {
        setMessage('Insufficient balance to distribute the specified amount.');
        return;
      }

      const rewardSystemContract = new ethers.Contract(rewardSystemAddress, rewardSystemABI, signer);
      const contractBalance = await rewardSystemContract.contractBalance();
      console.log(`Contract Balance: ${ethers.formatUnits(contractBalance, 18)} tokens`);

      // Transfer tokens to the reward system contract
      const tx = await tokenContract.transfer(rewardSystemAddress, ethers.parseUnits(totalTokensToDistribute.toString(), 18));
      await tx.wait();
      console.log(`Transferred ${totalTokensToDistribute} tokens to the reward system contract.`);

      // Now distribute the tokens to the recipients in batch
      const distributeTx = await rewardSystemContract.distributeRewardsInBatch(recipientAddresses, amountsToDistribute.map(amount => ethers.parseUnits(amount.toString(), 18)));
      await distributeTx.wait();

      setMessage(`Successfully distributed tokens to ${recipientAddresses.length} recipients`);

      // Reset inputs
      setIsAllocated(true);
    } catch (error: any) {
      console.error("Distribution failed:", error);
      setMessage(`An error occurred. Please try again.`);
    } finally {
      setIsLoading(false);
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
        <div className="min-h-screen flex justify-center items-center">
          <div className="p-6 bg-black bg-opacity-70 rounded-lg shadow-lg backdrop-blur-lg border border-gray-700 w-full max-w-3xl z-10">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-300 mb-4 text-center">
              Marks Reward
            </h2>
            <p className="text-gray-400 mb-4 text-center">Upload the marks spreadsheet to allocate tokens based on student performance.</p>

            {/* Styled File Upload */}
            <div className="mb-6">
              <label className="block">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="hidden" // Hide the default file input
                />
                <div className="flex items-center justify-center w-full h-12 bg-gray-700 rounded-lg border border-gray-500 cursor-pointer hover:bg-gray-600 transition duration-200">
                  {/* SVG Icon for File Upload */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16v2a4 4 0 004 4h10a4 4 0 004-4v-2M12 12v-9m0 0L8 7m4-4l4 4" />
                  </svg>
                  <span className="ml-2">Upload Marks File</span>
                </div>
              </label>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </div>

            {/* Display Data in Table */}
            {data.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
                  <thead>
                    <tr className="bg-gray-700 text-gray-300">
                      <th className="px-4 py-2">Student</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Marks</th>
                      <th className="px-4 py-2">Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    {data.map((student, index) => (
                      <tr key={index} className="border-b border-gray-600 hover:bg-gray-700">
                        <td className="px-4 py-2">{student.Student}</td>
                        <td className="px-4 py-2">{student.Address}</td>
                        <td className="px-4 py-2">{student.Marks}</td>
                        <td className="px-4 py-2">{tokens[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Distribute Rewards Button */}
            <div className="mt-6">
              <button
                onClick={handleDistributeReward}
                disabled={data.length === 0}
                className={`w-full h-12 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition duration-200 ease-in-out ${data.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Distributing...' : 'Distribute Rewards'}
              </button>
            </div>

            {/* Display message */}
            {message && <p className="mt-4 text-center text-gray-300">{message}</p>}
          </div>
        </div>
      </GradientBackground>
    </div>
  );
};

export default MarksReward;
