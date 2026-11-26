import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { AuthenticationPage } from './components/auth/AuthenticationPage';

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
import { AdminPayoutsAndReports } from './components/admin/AdminPayoutsAndReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminSalesAnalytics } from './components/admin/AdminSalesAnalytics';

const MainLayout: React.FC = () => {
  const { isAuthenticated, role, managerSubView, adminSubView } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Show authentication screen immediately when opening the website
  if (!isAuthenticated) {
    return <AuthenticationPage />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
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
              {['payouts-reports', 'payouts', 'reports'].includes(adminSubView) && (
                <AdminPayoutsAndReports />
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
