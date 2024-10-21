import React, { useState, useEffect } from 'react';  
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from './ui/GradientBackground';

interface Assignment {
  id: number;  
  title: string;
  rewardAmount: string; 
}

const Assignment: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingAssignments, setLoadingAssignments] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadedAssignments, setUploadedAssignments] = useState<number[]>([]);
  const navigate = useNavigate();
  
  const rewardSystemAddress = import.meta.env.VITE_ASSIGNMENTREWARD_ADDRESS || "";

  const rewardSystemABI = [
    "function getAssignment(uint256 assignmentId) external view returns (string title, uint256 rewardAmount)",
    "function hasClaimed(uint256 assignmentId, address student) external view returns (bool)",
    "function contractBalance() external view returns (uint256)",
    "function getUncompletedAssignments() external view returns (tuple(string title, uint256 rewardAmount)[])",
    "function claimReward(uint256 assignmentId) external", 
    "function completeAssignment(uint256 assignmentId) external",
  ];

  const fetchAssignments = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const rewardSystemContract = new ethers.Contract(rewardSystemAddress, rewardSystemABI, signer);

      const fetchedAssignments = await rewardSystemContract.getUncompletedAssignments();
      console.log("Fetched Assignments:", fetchedAssignments); // Logging fetched assignments

      const assignmentsWithIds: Assignment[] = fetchedAssignments.map((assignment: any, index: number) => ({
        id: index + 1,
        title: assignment.title,
        rewardAmount: assignment.rewardAmount.toString()
      }));

      setAssignments(assignmentsWithIds);

      if (assignmentsWithIds.length === 0) {
        setMessage("No assignments available."); // Set message if no assignments
      } else {
        setMessage(null); // Clear message if there are assignments
      }
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
      setMessage(`An error occurred: ${error.message || 'Please try again.'}`); // Set error message
    }
  };

  // Handle MetaMask account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        fetchAssignments(); // Fetch assignments when the account changes
      } else {
        setMessage("Please connect to MetaMask."); // Handle case when no account is connected
      }
    };

    const handleChainChanged = () => {
      fetchAssignments(); // Re-fetch assignments if the network changes
    };

    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged);

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    } else {
      console.error('MetaMask is not installed');
    }
  }, []);

  useEffect(() => {
    fetchAssignments(); // Initial fetch when component mounts
  }, []);

  const handleUploadAssignment = async (assignmentId: number) => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const rewardSystemContract = new ethers.Contract(rewardSystemAddress, rewardSystemABI, signer);

      await completeAssignment(assignmentId); // Wait for completion before uploading
    } catch (error: any) {
      console.error("Uploading assignment failed:", error);
      setMessage(`An error occurred: ${error.message || 'Please try again.'}`);
    }
  };

  const completeAssignment = async (assignmentId: number) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const rewardSystemContract = new ethers.Contract(rewardSystemAddress, rewardSystemABI, signer);

      const tx = await rewardSystemContract.completeAssignment(assignmentId);
      await tx.wait(); // Wait for the transaction to be confirmed

      // Successfully completed, update uploaded assignments here
      setUploadedAssignments((prev) => [...prev, assignmentId]);
      setMessage(`Assignment ${assignmentId} marked as complete.`);
    } catch (error: any) {
      console.error("Marking assignment as complete failed:", error);
      setMessage(`An error occurred: ${error.message || 'Please try again.'}`);
    }
  };

  const handleClaimReward = async (assignmentId: number) => {
    setLoadingAssignments((prev) => [...prev, assignmentId]);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const rewardSystemContract = new ethers.Contract(rewardSystemAddress, rewardSystemABI, signer);
      const studentAddress = await signer.getAddress();

      const hasClaimed = await rewardSystemContract.hasClaimed(assignmentId, studentAddress);
      if (hasClaimed) {
        setMessage('You have already claimed this reward.');
        return;
      }

      const tx = await rewardSystemContract.claimReward(assignmentId);
      await tx.wait();

      setMessage(`Successfully claimed reward for assignment ${assignmentId}.`);
      fetchAssignments();

    } catch (error: any) {
      console.error("Claiming reward failed:", error);
      setMessage(`An error occurred: ${error.message || 'Please try again.'}`);
    } finally {
      setLoadingAssignments((prev) => prev.filter(id => id !== assignmentId));
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
        <div className="max-w-lg w-full p-6 bg-black bg-opacity-70 rounded-lg shadow-lg backdrop-blur-lg border border-gray-700 z-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400">Assignments</h2>
          
          {/* Displaying the message */}
          {message && <div className="text-red-500 mt-5">{message}</div>}

          <div className="mt-4 space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-4 bg-gray-800 rounded-md shadow-lg flex flex-col">
                <div className="flex justify-between items-center">
                  <div className='flex-1 mr-10'>
                    <h3 className="text-xl text-white">{assignment.title}</h3>
                    <p className="text-gray-400">Reward: {ethers.formatUnits(assignment.rewardAmount, 18)} tokens</p>
                  </div>
                  {uploadedAssignments.includes(assignment.id) ? (
                    <button
                      onClick={() => handleClaimReward(assignment.id)}
                      className={`ml-4 p-2 bg-green-600 text-white rounded shadow hover:bg-green-500 transition duration-200 ease-in-out ${loadingAssignments.includes(assignment.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loadingAssignments.includes(assignment.id)}
                    >
                      {loadingAssignments.includes(assignment.id) ? 'Claiming...' : 'Claim Reward'}
                    </button>
                  ) : (
                    <>
                      <div className="flex flex-col mt-2">
                        <div className="mb-6">
                          <label className="block cursor-pointer">
                            <div className="flex items-center justify-center w-full h-12 bg-blue-200 rounded-lg border border-gray-500 hover:bg-gray-600 transition duration-200 p-2">
                              {/* SVG Icon for File Upload */}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16v2a4 4 0 004 4h10a4 4 0 004-4v-2M12 12v-9m0 0L8 7m4-4l4 4" />
                              </svg>
                              <span className="ml-2">Upload Assignment</span>
                            </div>
                            <input
                              type="file"
                              accept=".pdf, .doc, .docx"
                              onChange={(e) => {
                                if (e.target.files) {
                                  setSelectedFile(e.target.files[0]);
                                  setSelectedFileName(e.target.files[0].name);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          {selectedFileName && (
                            <div className="mt-1 text-gray-400">Selected file: {selectedFileName}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleUploadAssignment(assignment.id)}
                          className="w-full py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500 transition duration-200 ease-in-out"
                        >
                          Upload
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GradientBackground>
    </div>
  );
};

export default Assignment;
