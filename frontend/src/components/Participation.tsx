import React from 'react';
import { GradientBackground } from './ui/GradientBackground';
import { useNavigate } from 'react-router-dom';

const ParticipationReward: React.FC = () => {
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
            Participation Reward
          </h2>
          <p className="text-gray-400 mb-4 text-center">
            Join us in our event to earn exciting rewards! Participation rewards will be given based on your engagement level.
          </p>

          {/* Eligibility Criteria */}
          <h3 className="text-xl font-semibold text-white mt-4">Eligibility Criteria</h3>
          <ul className="text-gray-400 mb-4">
            <li>Must be a registered user</li>
            <li>Participate in at least one event</li>
            <li>Complete a feedback form post-event</li>
          </ul>

          {/* Reward Details */}
          <h3 className="text-xl font-semibold text-white mt-4">Reward Details</h3>
          <p className="text-gray-400 mb-4">
            Earn up to 20 tokens based on your participation level. Tokens can be redeemed for various prizes.
          </p>

          {/* Distribution Information */}
          <h3 className="text-xl font-semibold text-white mt-4">Distribution Information</h3>
          <p className="text-gray-400 mb-4">
            Rewards will be distributed within 2 weeks after the event concludes.
          </p>

          {/* FAQs */}
          <h3 className="text-xl font-semibold text-white mt-4">Frequently Asked Questions</h3>
          <p className="text-gray-400 mb-4">
            Have questions? Reach out to our support team for assistance.
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

export default ParticipationReward;
