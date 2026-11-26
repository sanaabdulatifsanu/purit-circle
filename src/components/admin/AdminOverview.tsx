import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Store, 
  Wallet, 
  Gift, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Bell,
  Menu
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface AdminOverviewProps {
  onToggleSidebar?: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onToggleSidebar }) => {
  const { 
    role,
    notifications,
    markNotificationRead,
    allManagers, 
    restaurants, 
    salesTransactions, 
    rewardClaims, 
    setAdminSubView 
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const roleNotifs = notifications.filter(n => n.recipientRole === role);
  const unreadCount = roleNotifs.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    if (showNotifDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifDropdown]);

  const totalRewards = salesTransactions.reduce((acc, curr) => acc + curr.rewardAmount, 0);
  const pendingApprovals = restaurants.filter(r => r.status === 'pending');
  const activeRestaurants = restaurants.filter(r => r.status === 'active');
  const pendingClaims = rewardClaims.filter(c => c.status === 'pending');

  return (
    <div>
      
      {/* Admin Master Console Header Bar (Unboxed Content) */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-6">
        {/* Left: Console Title & Master Access Badge */}
        <div className="flex items-center gap-2.5 flex-1 md:flex-initial min-w-0">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar} 
              className="lg:hidden p-2 text-[#78847D] hover:text-[#123C32] bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl hover:bg-[#F7F5EF] transition-colors shadow-xs"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-bold text-[#123C32]">
            Admin Master<span className="hidden sm:inline"> Console</span>
          </h1>
          <span className="hidden md:inline-flex bg-[#123C32] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D5AE62]" /> Master Access
          </span>
        </div>

        {/* Right: Notification Bell & Review Approvals */}
        <div className="contents md:flex md:items-center md:gap-2.5">
          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 text-[#78847D] hover:text-[#123C32] bg-[#FFFFFF] border border-[#E2E9E3] hover:border-[#123C32]/30 rounded-xl transition-colors shadow-xs"
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
                    roleNotifs.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
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
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-[#E2E9E3] mt-1 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifDropdown(false);
                      setAdminSubView('notifications');
                    }}
                    className="text-xs text-[#123C32] font-semibold hover:underline"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Review Approvals Action Button */}
          <div className="hidden md:contents">
            <button 
              onClick={() => setAdminSubView('restaurants')}
              className="btn-primary text-xs whitespace-nowrap"
            >
              Review Approvals ({pendingApprovals.length})
            </button>
          </div>
        </div>
      </div>

      {/* Admin KPI Matrix (PRD Section 17) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        
        <div className="purity-card p-4 hover:border-[#123C32] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-1">
            <span className="text-[11px] font-medium">Total Managers</span>
            <Users className="w-3.5 h-3.5 text-[#123C32]" />
          </div>
          <div className="text-2xl font-bold text-[#123C32]">{allManagers.length}</div>
          <span className="text-[10px] text-[#21865A] mt-1 block">100% Active</span>
        </div>

        <div className="purity-card p-4 hover:border-[#1B6B50] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-1">
            <span className="text-[11px] font-medium">Referred Restaurants</span>
            <Store className="w-3.5 h-3.5 text-[#1B6B50]" />
          </div>
          <div className="text-2xl font-bold text-[#123C32]">{restaurants.length}</div>
          <span className="text-[10px] text-[#78847D] mt-1 block">{activeRestaurants.length} active mapped</span>
        </div>

        <div className="purity-card p-4 hover:border-[#D99A32] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-1">
            <span className="text-[11px] font-medium">Pending Approvals</span>
            <Clock className="w-3.5 h-3.5 text-[#D99A32]" />
          </div>
          <div className="text-2xl font-bold text-[#D99A32]">{pendingApprovals.length}</div>
          <span className="text-[10px] text-[#D99A32] mt-1 block">Awaiting customer mapping</span>
        </div>

        <div className="hidden md:block purity-card p-4 hover:border-[#D5AE62] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-1">
            <span className="text-[11px] font-medium">Total Rewards</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D5AE62]" />
          </div>
          <div className="text-2xl font-bold text-[#123C32]">₹{(totalRewards + 120000).toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#78847D] mt-1 block">Sales + Direct referrals</span>
        </div>

        <div className="purity-card p-4 hover:border-[#D9534F] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-1">
            <span className="text-[11px] font-medium">Pending Claims</span>
            <Gift className="w-3.5 h-3.5 text-[#D9534F]" />
          </div>
          <div className="text-2xl font-bold text-[#D9534F]">{pendingClaims.length}</div>
          <span className="text-[10px] text-[#78847D] mt-1 block">Redemption reviews</span>
        </div>

      </div>

      {/* Two Column Layout: Pending Approvals & Quick Claims Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Restaurant Approvals Queue (PRD Section 7) */}
        <div className="purity-card p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E9E3]">
            <div>
              <h3 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#D99A32]" /> Pending Restaurant Referrals
              </h3>
              <p className="hidden md:block text-xs text-[#78847D]">Leads submitted by managers requiring Purity ID verification</p>
            </div>
            <button 
              onClick={() => setAdminSubView('restaurants')}
              className="text-xs font-semibold text-[#1B6B50] hover:underline"
            >
              Manage ({pendingApprovals.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {pendingApprovals.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#78847D]">
                All submitted restaurants have been reviewed and mapped.
              </div>
            ) : (
              pendingApprovals.map(rest => (
                <div key={rest.id} className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E2E9E3] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#202B27]">{rest.restaurantName}</h4>
                    <div className="text-[11px] text-[#78847D] mt-0.5">
                      Referred by: <span className="font-semibold text-[#123C32]">{rest.managerName}</span> • {rest.address ? `${rest.address}, ${rest.city}` : rest.city}
                    </div>
                    {rest.existingPurityCustomerId && (
                      <span className="font-mono text-[10px] bg-[#E2E9E3] text-[#123C32] px-1.5 py-0.2 rounded mt-1 inline-block">
                        Claimed ID: {rest.existingPurityCustomerId}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => setAdminSubView('restaurants')}
                    className="btn-primary text-xs py-1 px-3"
                  >
                    Verify & Map
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Reward Claims Queue (PRD Section 14 & 15) */}
        <div className="purity-card p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E9E3]">
            <div>
              <h3 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#D5AE62]" /> Pending Reward Claims
              </h3>
              <p className="hidden md:block text-xs text-[#78847D]">Manager redemption requests awaiting approval</p>
            </div>
            <button 
              onClick={() => setAdminSubView('claims')}
              className="text-xs font-semibold text-[#1B6B50] hover:underline"
            >
              View Claims ({pendingClaims.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {pendingClaims.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#78847D]">
                No pending reward claims requiring action.
              </div>
            ) : (
              pendingClaims.map(claim => (
                <div key={claim.id} className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E2E9E3] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#202B27]">
                      {claim.rewardTitle}
                    </div>
                    <div className="text-[11px] text-[#78847D] mt-0.5">
                      Requested by: <span className="font-semibold text-[#123C32]">{claim.managerName}</span> • ₹{claim.requiredAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button 
                    onClick={() => setAdminSubView('claims')}
                    className="btn-accent text-xs py-1 px-3"
                  >
                    Process Claim
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
