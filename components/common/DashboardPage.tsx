"use client"
import React from 'react';
import CoinDashboard from './CoinDasboard';


const DashboardPage: React.FC = () => {
  const totalCoins = 5000;
  const coinsUsed = 1200;
  const coinsTransferred = 800;
  const referralUrl = "https://example.com/referral/your-id";
  const referralEarnings = 300;
  const stakeCoins = 2000;
  const friends = ["Alice", "Bob", "Charlie"];
  const challengesCompleted = 5;
  const leaderboardPosition = 10;

  const handleShareCoin = () => alert('Sharing coins...');
  const handleWithdrawCoin = () => alert('Withdrawing coins...');
  const handleCopyReferralUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    alert('Referral URL copied!');
  };
  const handleStakeCoins = () => alert('Staking coins...');
  const handleTransferToFriend = (friend: string) => alert(`Transferring coins to ${friend}...`);
  const handleAddP2P = () => alert('Adding P2P...');

  return (
    <div>
      <CoinDashboard
        totalCoins={totalCoins}
        coinsUsed={coinsUsed}
        coinsTransferred={coinsTransferred}
        referralUrl={referralUrl}
        referralEarnings={referralEarnings}
        stakeCoins={stakeCoins}
        friends={friends}
        onShareCoin={handleShareCoin}
        onWithdrawCoin={handleWithdrawCoin}
        onCopyReferralUrl={handleCopyReferralUrl}
        onStakeCoins={handleStakeCoins}
        onTransferToFriend={handleTransferToFriend}
        onAddP2P={handleAddP2P}
        challengesCompleted={challengesCompleted}
        leaderboardPosition={leaderboardPosition}
      />
    </div>
  );
};

export default DashboardPage;
