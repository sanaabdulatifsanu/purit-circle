import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Wallet, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  Menu, 
  X,
  ExternalLink,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenAuth }) => {
  const { 
    role, 
    setRole, 
    logout,
    currentManager, 
    notifications, 
    markNotificationRead,
    setManagerSubView,
    setAdminSubView,
    setClaimsViewMode 
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const roleNotifs = notifications.filter(n => n.recipientRole === role);
  const unreadCount = roleNotifs.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E2E9E3] shadow-subtle px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger & Context title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar} 
            className="lg:hidden p-2 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#78847D]">
              {role === 'manager' ? 'Manager Portal' : 'Administrative Console'}
            </span>
            <span className="text-[#E2E9E3]">|</span>
            <span className="text-xs font-medium text-[#1B6B50] flex items-center gap-1 bg-[#1B6B50]/10 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#21865A] animate-pulse"></span>
              Purity Sync: Connected
            </span>
          </div>
        </div>

        {/* Right: Wallet, Notifications, Role Switcher, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Manager Wallet Balance Indicator */}
          {role === 'manager' && (
            <div 
              onClick={() => setManagerSubView('wallet')}
              className="cursor-pointer group flex items-center gap-2.5 bg-[#F7F5EF] hover:bg-[#D5AE62]/15 border border-[#E2E9E3] hover:border-[#D5AE62] px-3.5 py-1.5 rounded-xl transition-all"
              title="Click to view Rewards Wallet"
            >
              <div className="w-7 h-7 rounded-lg bg-[#D5AE62] flex items-center justify-center text-[#123C32] font-bold shadow-sm">
                <Wallet className="w-4 h-4 text-[#123C32]" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#78847D] group-hover:text-[#123C32]">
                  Reward Balance
                </span>
                <span className="text-sm font-bold text-[#123C32]">
                  ₹{currentManager.walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Admin System Balance Indicator */}
          {role === 'admin' && (
            <div 
              onClick={() => setAdminSubView('wallet')}
              className="hidden sm:flex cursor-pointer items-center gap-2.5 bg-[#123C32]/5 border border-[#123C32]/20 px-3.5 py-1.5 rounded-xl"
            >
              <ShieldCheck className="w-4 h-4 text-[#123C32]" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#78847D]">
                  System Ledger
                </span>
                <span className="text-xs font-bold text-[#123C32]">
                  Audited & Active
                </span>
              </div>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 text-[#78847D] hover:text-[#123C32] hover:bg-[#F7F5EF] rounded-xl transition-colors border border-transparent hover:border-[#E2E9E3]"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D9534F] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl shadow-elevated z-50 p-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E9E3]">
                  <h4 className="font-semibold text-sm text-[#123C32] flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#D5AE62]" /> Notifications ({unreadCount} unread)
                  </h4>
                  <button 
                    onClick={() => roleNotifs.forEach(n => markNotificationRead(n.id))}
                    className="text-xs text-[#1B6B50] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E9E3] mt-1">
                  {roleNotifs.length === 0 ? (
                    <p className="text-xs text-[#78847D] text-center py-6">No new notifications</p>
                  ) : (
                    roleNotifs.map(notif => {
                      const isRewardClaimNotif =
                        role === 'admin' &&
                        (notif.linkAction === 'claims' ||
                          notif.title.toLowerCase().includes('reward claim') ||
                          notif.title.toLowerCase().includes('reward redemption'));

                      return (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            setShowNotifDropdown(false);
                            if (isRewardClaimNotif) {
                              setClaimsViewMode('pending-view');
                              setAdminSubView('claims');
                            }
                          }}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer text-left ${notif.isRead ? 'opacity-70 hover:bg-[#F7F5EF]' : 'bg-[#F7F5EF]/60 hover:bg-[#F7F5EF]'}`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-semibold ${notif.type === 'success' ? 'text-[#21865A]' : notif.type === 'warning' ? 'text-[#D99A32]' : 'text-[#123C32]'}`}>
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-[#78847D]">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#78847D] mt-1 line-clamp-2">{notif.message}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-[#E2E9E3] text-center">
                  <button 
                    onClick={() => {
                      setShowNotifDropdown(false);
                      if (role === 'manager') setManagerSubView('notifications');
                      else setAdminSubView('notifications');
                    }}
                    className="text-xs font-medium text-[#123C32] hover:text-[#1B6B50]"
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Role Switcher (Manager <-> Admin) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-2 bg-[#123C32] text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-[#1B6B50] transition-colors shadow-sm"
            >
              <span>{role === 'manager' ? '👤 Manager View' : '🛡️ Admin View'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#D5AE62]" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl shadow-elevated z-50 p-2 text-left">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#78847D]">
                  Switch Active Portal
                </div>
                
                <button
                  onClick={() => {
                    setRole('manager');
                    setShowRoleSwitcher(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${role === 'manager' ? 'bg-[#123C32]/10 text-[#123C32] font-bold' : 'text-[#202B27] hover:bg-[#F7F5EF]'}`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#1B6B50]" />
                    Manager Dashboard
                  </span>
                  {role === 'manager' && <span className="w-1.5 h-1.5 rounded-full bg-[#21865A]" />}
                </button>

                <button
                  onClick={() => {
                    setRole('admin');
                    setShowRoleSwitcher(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${role === 'admin' ? 'bg-[#123C32]/10 text-[#123C32] font-bold' : 'text-[#202B27] hover:bg-[#F7F5EF]'}`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D5AE62]" />
                    Admin Dashboard
                  </span>
                  {role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-[#21865A]" />}
                </button>

                <div className="my-1 border-t border-[#E2E9E3]" />

                <button
                  onClick={() => {
                    setShowRoleSwitcher(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#D9534F] hover:bg-[#D9534F]/10 flex items-center gap-1.5 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out to Login Screen
                </button>
              </div>
            )}
          </div>

          {/* Quick Header Log Out Button */}
          <button
            onClick={logout}
            className="hidden sm:flex items-center gap-1.5 p-2 text-[#78847D] hover:text-[#D9534F] hover:bg-[#D9534F]/10 rounded-xl transition-colors border border-transparent hover:border-[#D9534F]/30"
            title="Log out and return to Authentication page"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-semibold">Exit</span>
          </button>

        </div>
      </div>
    </header>
  );
};
