// EnhancedCoinDashboard.tsx

import React from 'react';

interface CoinDashboardProps {
  totalCoins: number;
  coinsUsed: number;
  coinsTransferred: number;
  referralUrl: string;
  referralEarnings: number;
  stakeCoins: number;
  friends: string[];
  onShareCoin: () => void;
  onWithdrawCoin: () => void;
  onCopyReferralUrl: () => void;
  onAddP2P: () => void;
  onStakeCoins: () => void;
  onTransferToFriend: (friend: string) => void;
  challengesCompleted: number;
  leaderboardPosition: number;
}

const CoinDashboard: React.FC<CoinDashboardProps> = ({
  totalCoins,
  coinsUsed,
  coinsTransferred,
  referralUrl,
  referralEarnings,
  stakeCoins,
  friends,
  onShareCoin,
  onWithdrawCoin,
  onCopyReferralUrl,
  onAddP2P,
  onStakeCoins,
  onTransferToFriend,
  challengesCompleted,
  leaderboardPosition,
}) => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Enhanced Coin Dashboard</h2>

        {/* Challenges & Leaderboard */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-yellow-400 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold">Challenges Completed</h3>
            <p className="text-2xl">{challengesCompleted}</p>
          </div>

          <div className="bg-indigo-500 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold">Leaderboard Position</h3>
            <p className="text-2xl">{leaderboardPosition}</p>
          </div>
        </div>


        {/* Coin Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold">Total Coins</h3>
            <p className="text-3xl">{totalCoins}</p>
          </div>

          <div className="bg-green-500 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold">Coins Used</h3>
            <p className="text-3xl">{coinsUsed}</p>
          </div>

          <div className="bg-orange-500 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold">Coins Transferred</h3>
            <p className="text-3xl">{coinsTransferred}</p>
          </div>


        </div>

        {/* Friends & P2P Transfers */}
        <div className="mt-8">
          <h3 className="text-lg font-bold">Transfer Coins to Friends</h3>
          <ul className="list-disc pl-5">
            {friends.map((friend) => (
              <li key={friend} className="mt-2">
                {friend}{' '}
                <button
                  onClick={() => onTransferToFriend(friend)}
                  className="ml-2 text-sm bg-blue-500 text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-600"
                >
                  Transfer
                </button>
              </li>
            ))}
          </ul>
        </div>


        {/* Referral Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
          <h3 className="text-2xl font-bold text-purple-700 flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1a3 3 0 116 0v1z" />
              </svg>
            </span>
            Referral Program
          </h3>

          <div className="mt-4 bg-purple-50 p-4 rounded-lg">
            <p className="text-lg text-gray-700 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-yellow-500 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
              </svg>
              Referral Earnings: <span className="ml-2 text-purple-700 font-semibold">{referralEarnings} coins</span>
            </p>

            <p className="mt-2 text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-blue-500 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 9a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-3.25 7h.5a7.5 7.5 0 017.5 7.5v.5h-15v-.5a7.5 7.5 0 017.5-7.5z" />
              </svg>
              Referral URL: <span className="ml-2 text-blue-600 font-medium underline">{referralUrl}</span>
            </p>

            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-lg transition-colors">
              Copy Referral URL
            </button>
          </div>
        </div>



        {/* P2P Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-bold">P2P Actions</h3>
          <button
            onClick={onAddP2P}
            className="bg-teal-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none"
          >
            Add P2P
          </button>
        </div>
      </div>

    </div>
  );
};

export default CoinDashboard;
