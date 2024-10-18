import React from 'react';
import { GradientBackground } from './ui/GradientBackground';
import { useNavigate } from 'react-router-dom';

const ExclusiveAccess: React.FC = () => {
  const navigate = useNavigate();

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
          <div className="p-6 bg-black bg-opacity-70 rounded-lg shadow-lg backdrop-blur-lg border border-gray-700 w-full max-w-md z-10">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 mb-4 text-center">
              Exclusive Access
            </h2>
            <p className="text-gray-400 mb-4 text-center">
              Unlock exclusive opportunities and rewards tailored for our top participants. Earn tokens for various activities and gain access to special events!
            </p>

            {/* Eligibility Criteria */}
            <h3 className="text-xl font-semibold text-white mt-4">Eligibility Criteria</h3>
            <ul className="text-gray-400 mb-4">
              <li>Must have earned at least 10 tokens</li>
              <li>Participate in at least two events</li>
              <li>Maintain a good standing in the community</li>
            </ul>

            {/* Reward Details */}
            <h3 className="text-xl font-semibold text-white mt-4">Reward Details</h3>
            <p className="text-gray-400 mb-4">
              Access to exclusive workshops and seminars, plus a chance to win premium prizes!
            </p>

            {/* Distribution Information */}
            <h3 className="text-xl font-semibold text-white mt-4">Distribution Information</h3>
            <p className="text-gray-400 mb-4">
              Rewards will be announced after each event, with exclusive access granted within 1 week.
            </p>

            {/* FAQs */}
            <h3 className="text-xl font-semibold text-white mt-4">Frequently Asked Questions</h3>
            <p className="text-gray-400 mb-4">
              Have questions? Contact our support team for assistance.
            </p>

            {/* Call-to-Action Button */}
            <div className="flex justify-center mb-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </GradientBackground>
    </div>
  );
};

export default ExclusiveAccess;
