import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Layers, Menu } from 'lucide-react';
import { AdminSubView } from '../../types';
import { AdminManagers } from './AdminManagers';
import { AdminReferralManagement } from './AdminReferralManagement';
import { NotificationBell } from '../common/NotificationBell';

interface TabItem {
  id: AdminSubView;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
}

interface AdminManagersViewProps {
  onToggleSidebar?: () => void;
}

export const AdminManagersView: React.FC<AdminManagersViewProps> = ({ onToggleSidebar }) => {
  const { adminSubView, setAdminSubView, allManagers } = useApp();
  const [selectedProfileManagerId, setSelectedProfileManagerId] = useState<string | null>(null);
  const [returnToSubView, setReturnToSubView] = useState<AdminSubView | null>(null);

  const activeTab: AdminSubView = adminSubView === 'referrals' ? 'referrals' : 'managers';

  useEffect(() => {
    if (activeTab !== 'managers' && !selectedProfileManagerId) {
      setSelectedProfileManagerId(null);
    }
  }, [activeTab, selectedProfileManagerId]);

  const handleOpenProfile = (id: string, fromTab: AdminSubView = activeTab) => {
    setReturnToSubView(fromTab);
    setSelectedProfileManagerId(id);
    if (adminSubView !== 'managers') {
      setAdminSubView('managers');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseProfile = () => {
    setSelectedProfileManagerId(null);
    if (returnToSubView) {
      setAdminSubView(returnToSubView);
      setReturnToSubView(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const isViewingProfile = activeTab === 'managers' && selectedProfileManagerId !== null;

  return (
    <div className="space-y-6">
      {/* Flattened Header Row (hidden when viewing a manager's profile) */}
      {!isViewingProfile && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {onToggleSidebar && (
              <button 
                onClick={onToggleSidebar} 
                className="lg:hidden p-2 text-[#78847D] hover:text-[#123C32] bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl hover:bg-[#F7F5EF] transition-colors shadow-xs"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
              {activeTab === 'referrals' ? (
                <>
                  <Layers className="w-6 h-6 text-[#1B6B50]" /> Referral Management & Hierarchy
                </>
              ) : (
                <>
                  <Users className="hidden md:inline-flex w-6 h-6 text-[#1B6B50]" /> Manager Management
                </>
              )}
            </h1>
          </div>

          {/* Right: Initial System Manager Code Pill & Notification Bell */}
          <div className="hidden md:flex items-center gap-2.5 self-end sm:self-auto">
            <div className="text-xs text-[#78847D] bg-[#F7F5EF] px-3.5 py-1.5 rounded-xl border border-[#E2E9E3]">
              Initial System Manager Code: <span className="font-mono font-bold text-[#123C32]">1001</span>
            </div>

            <NotificationBell />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {/* Sub-Navigation Tabs (hidden when viewing a manager's full-page detail view) */}
        {!isViewingProfile && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedProfileManagerId(null);
                    setReturnToSubView(null);
                    setAdminSubView(tab.id);
                  }}
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
        )}

        {/* Tab Panels */}
        {activeTab === 'managers' && (
          <AdminManagers
            selectedProfileManagerId={selectedProfileManagerId}
            onSelectProfileManagerId={(id) => {
              if (id) {
                handleOpenProfile(id, 'managers');
              } else {
                handleCloseProfile();
              }
            }}
            onCloseProfile={handleCloseProfile}
          />
        )}
        {activeTab === 'referrals' && (
          <AdminReferralManagement 
            onSelectProfileManagerId={(id) => handleOpenProfile(id, 'referrals')} 
          />
        )}
      </div>
    </div>
  );
};
