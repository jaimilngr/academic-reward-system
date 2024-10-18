import React, { useState } from 'react'; 
import { read, utils } from 'xlsx';
import { GradientBackground } from './ui/GradientBackground';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && !file.name.endsWith('.xlsx')) {
      setError('Please upload a valid .xlsx file.');
      setData([]);
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = read(binaryStr, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = utils.sheet_to_json<StudentData>(firstSheet); 
        const requiredColumns = ['Student', 'Address', 'Marks'];
        const headers = Object.keys(sheetData[0] as StudentData); 
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          setError(`The file must contain the following columns: ${missingColumns.join(', ')}`);
          setData([]);
          return;
        }

        setData(sheetData);
        calculateTokens(sheetData);
        setError('');
      };
      reader.readAsBinaryString(file);
    }
  };

  const calculateTokens = (marksData: any[]) => {
    const tokenValues = marksData.map((row: any) => {
      const marks = row['Marks'];
      if (marks === undefined || marks === null || isNaN(marks)) return 0;
      if (marks >= 36) return 10;
      if (marks >= 30) return 7;
      if (marks >= 20) return 5;
      return 2;
    });
    setTokens(tokenValues);
  };

  const allocateTokens = () => {
    if (data.length === 0 || tokens.length === 0) {
      setError('No data available to allocate tokens.');
      return;
    }

    data.forEach((row, index) => {
      const address = row['Address'];
      const tokenAmount = tokens[index];
      console.log(`Allocating ${tokenAmount} tokens to address: ${address}`);
    });

    setIsAllocated(true);
    setError('');
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                  <span className="text-white ml-2">Choose a file</span>
                </div>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            {/* Display Uploaded Data */}
            {data.length > 0 && (
              <div className="overflow-auto h-64 mb-6">
                <table className="table-auto w-full text-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Student</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Marks</th>
                      <th className="px-4 py-2">Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row: any, index: number) => (
                      <tr key={index} className="text-center">
                        <td className="border px-4 py-2">{row['Student']}</td>
                        <td className="border px-4 py-2">{row['Address']}</td>
                        <td className="border px-4 py-2">{row['Marks'] !== undefined ? row['Marks'] : 'N/A'}</td>
                        <td className="border px-4 py-2">{tokens[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Allocate Tokens Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={allocateTokens}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-500 transition">
                Allocate Tokens
              </button>
            </div>

            {/* Allocation Status */}
            {isAllocated && (
              <p className="text-green-500 text-center">Tokens have been successfully allocated!</p>
            )}
          </div>
        </div>
      </GradientBackground>
    </div>
  );
};

export default MarksReward;
