import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Menu, 
  Copy,
  Check,
  Phone
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    role, 
    currentManager, 
    notifications, 
    markNotificationRead,
    managerSubView,
    adminSubView,
    setManagerSubView,
    setAdminSubView 
  } = useApp();

  const isRestaurantScreen = role === 'manager' && managerSubView === 'restaurants';

  const getScreenTitle = () => {
    if (role === 'manager') {
      switch (managerSubView) {
        case 'overview': return `Welcome back, ${currentManager?.name || 'Partner'}`;
        case 'restaurants': return 'My Restaurants';
        case 'wallet': return 'Rewards Wallet';
        case 'claim': return 'Claim Rewards';
        case 'referrals': return 'My Referrals';
        case 'sales': return 'Sales Performance';
        case 'earnings': return 'My Earnings';
        case 'notifications': return 'Notifications';
        case 'profile': return 'My Profile';
        default: return 'Purity Circle';
      }
    } else {
      switch (adminSubView) {
        case 'overview': return 'Welcome back, Admin';
        case 'managers': return 'Managers';
        case 'referrals': return 'Referrals';
        case 'restaurants': return 'Restaurants';
        case 'sales': return 'Sales Analytics';
        case 'reward-config': return 'Reward Config';
        case 'referral-rewards': return 'Referral Bonuses';
        case 'wallet': return 'Wallets';
        case 'claims': return 'Claims';
        case 'payouts': return 'Payouts';
        case 'notifications': return 'Notifications';
        case 'reports': return 'Reports';
        case 'settings': return 'Settings';
        default: return 'Admin Console';
      }
    }
  };

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const roleNotifs = notifications.filter(n => n.recipientRole === role);
  const unreadCount = roleNotifs.filter(n => !n.isRead).length;

  const handleCopyCode = () => {
    const code = role === 'manager' ? currentManager.referralCode : '1001';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const actionControls = (
    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
      {/* Notification Symbol with Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          className="relative p-2 text-[#78847D] hover:text-[#123C32] bg-[#FFFFFF] hover:bg-[#FFFFFF]/80 rounded-xl transition-colors border border-[#E2E9E3] shadow-2xs hover:border-[#1B6B50]"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D9534F] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifDropdown && (
          <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-sm bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl shadow-elevated z-50 p-3 animate-in fade-in duration-150">
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

            <div className="pt-2 mt-2 border-t border-[#E2E9E3] text-center">
              <button 
                onClick={() => {
                  setShowNotifDropdown(false);
                  if (role === 'manager') setManagerSubView('profile');
                  else setAdminSubView('notifications');
                }}
                className="text-xs font-medium text-[#123C32] hover:text-[#1B6B50]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On My Restaurants screen: show ONLY Purity contact number. On all other screens: show Code */}
      {isRestaurantScreen ? (
        <a 
          href="tel:9633231212"
          className="flex items-center gap-1.5 sm:gap-2 bg-[#FFFFFF] hover:bg-[#123C32]/5 border border-[#E2E9E3] hover:border-[#1B6B50] px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-2xs shrink-0 group text-[#123C32]"
          title="Call Purity Support: 9633231212"
        >
          <Phone className="w-3.5 h-3.5 text-[#1B6B50] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline text-xs font-semibold text-[#78847D] group-hover:text-[#123C32]">
            Purity:
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-[#123C32]">
            9633231212
          </span>
        </a>
      ) : (
        /* Code number badge - on other screens */
        <div 
          onClick={handleCopyCode}
          className="cursor-pointer group flex items-center gap-1.5 sm:gap-2 bg-[#FFFFFF] hover:bg-[#D5AE62]/10 border border-[#E2E9E3] hover:border-[#D5AE62] px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all shadow-2xs shrink-0"
          title="Click to copy your code"
        >
          <span className="hidden sm:inline text-xs font-semibold text-[#78847D] group-hover:text-[#123C32]">
            Your Code:
          </span>
          <span className="sm:hidden text-[10px] font-semibold text-[#78847D]">
            Code:
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-[#123C32] bg-[#F7F5EF] px-1.5 sm:px-2 py-0.5 rounded-lg border border-[#E2E9E3]">
            {role === 'manager' ? currentManager.referralCode : '1001'}
          </span>
          {copiedCode ? (
            <span className="text-[10px] font-bold text-[#21865A] bg-[#21865A]/10 px-1 py-0.5 rounded flex items-center gap-0.5">
              <Check className="w-3 h-3" /> <span className="hidden sm:inline">Copied!</span>
            </span>
          ) : (
            <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#78847D] group-hover:text-[#D5AE62] transition-colors" />
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-30 bg-[#F7F5EF] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 border-b border-[#E2E9E3]/70">
      <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Mobile/Tablet Hamburger & Screen Heading */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            onClick={onToggleSidebar} 
            className="lg:hidden p-2 text-[#78847D] hover:text-[#123C32] bg-[#FFFFFF] border border-[#E2E9E3] rounded-lg hover:bg-[#F7F5EF] transition-colors shadow-2xs shrink-0 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-[#123C32] tracking-tight truncate">
            {getScreenTitle()}
          </h1>
        </div>

        {/* Right: Notification Icon and Code Number / Support Number */}
        <div className="shrink-0">
          {actionControls}
        </div>
      </div>
    </header>
  );
};
