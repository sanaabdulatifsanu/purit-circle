import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Sparkles, Wallet, Gift } from 'lucide-react';
import { AdminSubView } from '../../types';
import { AdminRewardConfig } from './AdminRewardConfig';
import { AdminReferralRewards } from './AdminReferralRewards';
import { AdminWalletManagement } from './AdminWalletManagement';
import { AdminRewardClaims } from './AdminRewardClaims';

interface TabItem {
  id: AdminSubView;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export const AdminRewardsAndClaims: React.FC = () => {
  const { adminSubView, setAdminSubView, rewardClaims } = useApp();

  // Determine active tab based on current adminSubView
  const getActiveTab = (): AdminSubView => {
    if (adminSubView === 'referral-rewards') return 'referral-rewards';
    if (adminSubView === 'wallet') return 'wallet';
    if (adminSubView === 'claims') return 'claims';
    return 'reward-config';
  };

  const activeTab = getActiveTab();
  const pendingClaimsCount = rewardClaims.filter(c => c.status === 'pending').length;

  const tabs: TabItem[] = [
    {
      id: 'reward-config',
      label: 'Reward Configuration',
      icon: Sliders
    },
    {
      id: 'referral-rewards',
      label: '₹2,000 Referral Rewards',
      icon: Sparkles
    },
    {
      id: 'wallet',
      label: 'Rewards Wallet',
      icon: Wallet
    },
    {
      id: 'claims',
      label: 'Reward Claims',
      icon: Gift,
      badge: pendingClaimsCount > 0 ? pendingClaimsCount : undefined,
      badgeColor: 'bg-[#D9534F] text-white'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminSubView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#123C32] text-white shadow-sm'
                  : 'bg-white border border-[#E2E9E3] text-[#78847D] hover:text-[#123C32] hover:border-[#123C32]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#D5AE62]' : 'text-[#78847D]'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    tab.badgeColor || (isActive ? 'bg-[#D5AE62] text-[#123C32]' : 'bg-[#123C32]/10 text-[#123C32]')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'reward-config' && <AdminRewardConfig />}
      {activeTab === 'referral-rewards' && <AdminReferralRewards />}
      {activeTab === 'wallet' && <AdminWalletManagement />}
      {activeTab === 'claims' && <AdminRewardClaims />}
    </div>
  );
};
