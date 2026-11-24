import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
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
import { AdminManagers } from './components/admin/AdminManagers';
import { AdminReferralManagement } from './components/admin/AdminReferralManagement';
import { AdminReferredRestaurants } from './components/admin/AdminReferredRestaurants';
import { AdminSalesAnalytics } from './components/admin/AdminSalesAnalytics';
import { AdminRewardConfig } from './components/admin/AdminRewardConfig';
import { AdminReferralRewards } from './components/admin/AdminReferralRewards';
import { AdminWalletManagement } from './components/admin/AdminWalletManagement';
import { AdminRewardClaims } from './components/admin/AdminRewardClaims';
import { AdminPayouts } from './components/admin/AdminPayouts';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';

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
        {/* Top Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

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
              {adminSubView === 'managers' && <AdminManagers />}
              {adminSubView === 'referrals' && <AdminReferralManagement />}
              {adminSubView === 'restaurants' && <AdminReferredRestaurants />}
              {adminSubView === 'sales' && <AdminSalesAnalytics />}
              {adminSubView === 'reward-config' && <AdminRewardConfig />}
              {adminSubView === 'referral-rewards' && <AdminReferralRewards />}
              {adminSubView === 'wallet' && <AdminWalletManagement />}
              {adminSubView === 'claims' && <AdminRewardClaims />}
              {adminSubView === 'payouts' && <AdminPayouts />}
              {adminSubView === 'notifications' && <NotificationsView />}
              {adminSubView === 'reports' && <AdminReports />}
              {adminSubView === 'settings' && <AdminSettings />}
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
