import React from 'react';
import { motion } from 'framer-motion';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (rewardType: string) => void;
  isAdmin: boolean; // Added prop to differentiate modal content
}

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, onSelect, isAdmin }) => {
  if (!isOpen) return null;

  const handleSelect = (rewardType: string) => {
    onSelect(rewardType);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <motion.div
        className="bg-neutral-900 rounded-lg shadow-lg p-6 border border-gray-300 bg-opacity-30 backdrop-blur-lg w-96"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          {isAdmin ? 'Select Reward Type' : 'Select Actions'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {isAdmin ? (
            <>
              <button
                onClick={() => handleSelect('transfer')}
                className="p-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-500 transition duration-200 ease-in-out"
              >
                Transfer Token
              </button>
              <button
                onClick={() => handleSelect('marks')}
                className="p-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition duration-200 ease-in-out"
              >
                Marks
              </button>
              <button
                onClick={() => handleSelect('participation')}
                className="p-4 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-500 transition duration-200 ease-in-out"
              >
                Participation
              </button>
              <button
                onClick={() => handleSelect('create')}
                className="p-4 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-500 transition duration-200 ease-in-out"
              >
                Create Assignment
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSelect('transfer')}
                className="p-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-500 transition duration-200 ease-in-out"
              >
                 Transfer Token
              </button>
              <button
                onClick={() => handleSelect('assignments')}
                className="p-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition duration-200 ease-in-out"
              >
                Assignments
              </button>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500 transition duration-200 ease-in-out"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default RewardModal;
