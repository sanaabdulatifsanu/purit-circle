import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AuthModal } from './components/auth/AuthModal';
import { AuthenticationPage } from './components/auth/AuthenticationPage';
import { Menu, Bell, Settings, Gift, ChevronRight } from 'lucide-react';

// Manager Modules
import { ManagerOverview } from './components/manager/ManagerOverview';
import { MyRestaurants } from './components/manager/MyRestaurants';
import { SalesPerformance } from './components/manager/SalesPerformance';
import { MyEarnings } from './components/manager/MyEarnings';
import { RewardsWallet } from './components/manager/RewardsWallet';
import { ClaimRewards } from './components/manager/ClaimRewards';
import { MyReferrals } from './components/manager/MyReferrals';
import { NotificationsView } from './components/manager/NotificationsView';
import { ProfileView } from './components/manager/ProfileView';

// Admin Modules
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminManagersView } from './components/admin/AdminManagersView';
import { AdminReferredRestaurants } from './components/admin/AdminReferredRestaurants';
import { AdminRewardsAndClaims } from './components/admin/AdminRewardsAndClaims';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminSalesAnalytics } from './components/admin/AdminSalesAnalytics';

const MainLayout: React.FC = () => {
  const { 
    isAuthenticated, 
    role, 
    managerSubView, 
    adminSubView,
    rewardClaims,
    claimsViewMode,
    setClaimsViewMode
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Show authentication screen immediately when opening the website
  if (!isAuthenticated) {
    return <AuthenticationPage />;
  }

  // Remove top header on Settings, Notifications, and Reward Claims
  const isNotificationsView =
    (role === 'admin' && adminSubView === 'notifications') ||
    (role === 'manager' && managerSubView === 'notifications');
  const isSettingsView = role === 'admin' && adminSubView === 'settings';
  const isRewardsClaimsView =
    role === 'admin' &&
    ['rewards-claims', 'reward-config', 'referral-rewards', 'wallet', 'claims'].includes(adminSubView);

  const isHeaderHidden = isNotificationsView || isSettingsView || isRewardsClaimsView;

  const pendingClaimsCount = rewardClaims.filter(c => c.status === 'pending').length;

  const compactHeader = isSettingsView
    ? {
        title: 'System Settings',
        icon: <Settings className="hidden sm:block w-5 h-5 text-[#1B6B50] shrink-0" />,
      }
    : isRewardsClaimsView
      ? {
          title: 'Reward Claims',
          icon: <Gift className="hidden sm:block w-5 h-5 text-[#1B6B50] shrink-0" />,
        }
      : {
          title: role === 'admin' ? 'Admin Notifications & Verifications' : 'Activity & System Notifications',
          icon: <Bell className="hidden sm:block w-5 h-5 text-[#1B6B50] shrink-0" />,
        };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header - Omitted on Settings, Notifications, and Payout & Disbursement Records */}
        {!isHeaderHidden ? (
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        ) : (
          /* Mobile/compact header: menu toggle inline with page heading (suppressed on pending claims view to avoid duplicate headers) */
          (isRewardsClaimsView && claimsViewMode === 'pending-view') ? null : (
            <div className="lg:hidden px-4 sm:px-6 pt-4 pb-0 flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <button 
                  onClick={() => setSidebarOpen(true)} 
                  className="p-2 text-[#78847D] hover:text-[#123C32] rounded-lg bg-[#FFFFFF] border border-[#E2E9E3] shadow-xs shrink-0"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-[#123C32] flex items-center gap-2 min-w-0 truncate">
                  {compactHeader.icon}
                  <span className="truncate">{compactHeader.title}</span>
                </h1>
              </div>

              {/* Pending Claims Action Chip alongside Reward Claims on phone/mobile */}
              {isRewardsClaimsView && claimsViewMode === 'table' && (
                <button
                  type="button"
                  onClick={() => setClaimsViewMode('pending-view')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2E9E3] hover:border-[#123C32] text-[#123C32] hover:bg-[#F7F5EF] shadow-xs transition-colors shrink-0 whitespace-nowrap ml-auto"
                  title="Review pending claims awaiting admin action"
                >
                  <Gift className="w-3.5 h-3.5 text-[#1B6B50] shrink-0" />
                  <span>Pending</span>
                  {pendingClaimsCount > 0 && (
                    <span className="text-[10px] bg-[#D9534F] text-white px-1.5 py-0.5 rounded-full font-bold shrink-0 min-w-[18px] text-center leading-none">
                      {pendingClaimsCount}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[#78847D] shrink-0" />
                </button>
              )}
            </div>
          )
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {role === 'manager' ? (
            <>
              {managerSubView === 'overview' && <ManagerOverview />}
              {managerSubView === 'restaurants' && <MyRestaurants />}
              {managerSubView === 'sales' && <SalesPerformance />}
              {managerSubView === 'earnings' && <MyEarnings />}
              {managerSubView === 'wallet' && <RewardsWallet />}
              {managerSubView === 'claim' && <ClaimRewards />}
              {managerSubView === 'referrals' && <MyReferrals />}
              {managerSubView === 'notifications' && <NotificationsView />}
              {managerSubView === 'profile' && <ProfileView />}
            </>
          ) : (
            <>
              {adminSubView === 'overview' && <AdminOverview />}
              {(adminSubView === 'managers' || adminSubView === 'referrals') && <AdminManagersView />}
              {adminSubView === 'restaurants' && <AdminReferredRestaurants />}
              {['rewards-claims', 'reward-config', 'referral-rewards', 'wallet', 'claims'].includes(adminSubView) && (
                <AdminRewardsAndClaims />
              )}
              {adminSubView === 'notifications' && <NotificationsView />}
              {adminSubView === 'settings' && <AdminSettings />}
              {adminSubView === 'sales' && <AdminSalesAnalytics />}
            </>
          )}
        </main>
      </div>

      {/* Auth & Admin Gateway Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
