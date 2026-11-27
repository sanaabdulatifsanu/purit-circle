import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { ManagerSubView, AdminSubView } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    role, 
    logout,
    managerSubView, 
    setManagerSubView, 
    adminSubView, 
    setAdminSubView,
    setClaimsViewMode,
    currentManager 
  } = useApp();

  const managerMenuItems: { id: ManagerSubView; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'restaurants', label: 'My Restaurants' },
    { id: 'wallet', label: 'Rewards Wallet' },
    { id: 'claim', label: 'Claim Rewards' },
    { id: 'referrals', label: 'My Referrals' },
    { id: 'profile', label: 'Profile' },
  ];

  const adminMenuItems: { id: AdminSubView; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'managers', label: 'Managers' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'rewards-claims', label: 'Rewards & Claims' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-[#202B27]/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#123C32] text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1B6B50] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D5AE62] to-[#B38D40] flex items-center justify-center text-[#123C32] shadow-md font-bold text-lg">
              PC
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                PURITY CIRCLE
              </h1>
              <p className="text-[11px] text-[#D5AE62] font-medium tracking-wider uppercase">
                {role === 'manager' ? 'Partner Network' : 'System Administration'}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Badge Banner (Admin only) */}
        {role === 'admin' && (
          <div className="px-4 py-3 mx-4 my-3 rounded-xl bg-[#1B6B50]/40 border border-[#1B6B50]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D5AE62]" />
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Super Admin</span>
                <span className="text-[10px] text-[#E2E9E3]/70">Full System Governance</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {role === 'manager' ? (
            managerMenuItems.map(item => {
              const isActive = managerSubView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setManagerSubView(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all
                    ${isActive 
                      ? 'bg-[#1B6B50] text-white shadow-sm font-semibold' 
                      : 'text-[#E2E9E3]/80 hover:bg-[#1B6B50]/40 hover:text-white'}
                  `}
                >
                  <span className="tracking-wide">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.id === 'wallet' && (
                      <span className="text-[10px] bg-[#D5AE62] text-[#123C32] px-1.5 py-0.5 rounded font-bold">
                        ₹{currentManager.walletBalance.toLocaleString('en-IN')}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D5AE62]" />}
                  </div>
                </button>
              );
            })
          ) : (
            adminMenuItems.map(item => {
              const isActive = 
                (item.id === 'managers' && (adminSubView === 'managers' || adminSubView === 'referrals')) ||
                (item.id === 'rewards-claims' && (adminSubView === 'rewards-claims' || adminSubView === 'reward-config' || adminSubView === 'referral-rewards' || adminSubView === 'wallet' || adminSubView === 'claims')) ||
                adminSubView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminSubView(item.id);
                    if (item.id === 'rewards-claims') {
                      setClaimsViewMode('table');
                    }
                    onClose();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all
                    ${isActive 
                      ? 'bg-[#1B6B50] text-white shadow-sm font-semibold' 
                      : 'text-[#E2E9E3]/80 hover:bg-[#1B6B50]/40 hover:text-white'}
                  `}
                >
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D5AE62]" />}
                </button>
              );
            })
          )}
        </nav>

        {/* Sign Out Action */}
        <div className="p-3 border-t border-[#1B6B50]">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E2E9E3]/80 hover:text-white hover:bg-[#D9534F]/20 transition-all text-left"
          >
            <LogOut className="w-4 h-4 text-[#D9534F]" />
            <span>Sign Out to Auth</span>
          </button>
        </div>

        {/* Footer Sync Indicator */}
        <div className="p-4 border-t border-[#1B6B50] bg-[#123C32]/80">
          <div className="flex items-center gap-2 text-[11px] text-[#E2E9E3]/80 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#21865A]" />
            <span>Purity Engine v2.4 Live</span>
          </div>
          <p className="text-[10px] text-[#78847D] text-center">
            Purity Circle © 2026. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};
