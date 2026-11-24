import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, FileSpreadsheet } from 'lucide-react';
import { AdminSubView } from '../../types';
import { AdminPayouts } from './AdminPayouts';
import { AdminReports } from './AdminReports';

interface TabItem {
  id: AdminSubView;
  label: string;
  icon: React.FC<{ className?: string }>;
}

export const AdminPayoutsAndReports: React.FC = () => {
  const { adminSubView, setAdminSubView } = useApp();

  const activeTab: AdminSubView = adminSubView === 'reports' ? 'reports' : 'payouts';

  const tabs: TabItem[] = [
    {
      id: 'payouts',
      label: 'Payout Management',
      icon: FileCheck2
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileSpreadsheet
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
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'payouts' && <AdminPayouts />}
      {activeTab === 'reports' && <AdminReports />}
    </div>
  );
};
