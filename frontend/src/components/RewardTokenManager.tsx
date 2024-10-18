import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ethers } from 'ethers';

const RewardTokenManager: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [rewardType, setRewardType] = useState<string>('Individual Rewards');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    }
  };

  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setParsedData(jsonData);
      calculateTotalTokens(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const calculateTotalTokens = (data: any[]) => {
    let total = 0;
    data.forEach((student) => {
      // Here, implement your token calculation logic based on the student grades
      const tokens = student.MidSemScore >= 36 ? 100 : 0; // Example token logic
      total += tokens;
    });
    setTotalTokens(total);
  };

  const transferTokens = async () => {
    // Implement your token transfer logic here using ethers.js
    console.log(`Transferring a total of ${totalTokens} tokens to the specified addresses...`);
    // Add logic to interact with your smart contract and transfer tokens
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Reward Token Manager</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Create Token</h2>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
          Create Token
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Select Reward Type</h2>
        <select value={rewardType} onChange={(e) => setRewardType(e.target.value)} className="border p-2 rounded mb-2">
          <option value="Individual Rewards">Individual Rewards</option>
          <option value="Marks Rewards">Marks Rewards</option>
          <option value="Participation Rewards">Participation Rewards</option>
          <option value="Performance Rewards">Performance Rewards</option>
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Upload Excel File</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-2" />
      </div>

      {parsedData.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Parsed Data</h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Wallet Address</th>
                <th className="border px-4 py-2">Mid-Sem Score</th>
                <th className="border px-4 py-2">End-Sem Score</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.map((student, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{student.StudentName}</td>
                  <td className="border px-4 py-2">{student.WalletAddress}</td>
                  <td className="border px-4 py-2">{student.MidSemScore}</td>
                  <td className="border px-4 py-2">{student.EndSemScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4">Total Tokens to be Distributed: {totalTokens}</p>
          <button
            onClick={transferTokens}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            Transfer Tokens
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardTokenManager;
