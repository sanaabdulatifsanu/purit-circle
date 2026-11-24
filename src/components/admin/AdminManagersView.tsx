import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Layers } from 'lucide-react';
import { AdminSubView } from '../../types';
import { AdminManagers } from './AdminManagers';
import { AdminReferralManagement } from './AdminReferralManagement';

interface TabItem {
  id: AdminSubView;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
}

export const AdminManagersView: React.FC = () => {
  const { adminSubView, setAdminSubView, allManagers } = useApp();

  const activeTab: AdminSubView = adminSubView === 'referrals' ? 'referrals' : 'managers';

  const tabs: TabItem[] = [
    {
      id: 'managers',
      label: 'Managers',
      icon: Users,
      badge: allManagers.length
    },
    {
      id: 'referrals',
      label: 'Referral Management',
      icon: Layers
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
                    isActive ? 'bg-[#D5AE62] text-[#123C32]' : 'bg-[#123C32]/10 text-[#123C32]'
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
      {activeTab === 'managers' && <AdminManagers />}
      {activeTab === 'referrals' && <AdminReferralManagement />}
    </div>
  );
};
