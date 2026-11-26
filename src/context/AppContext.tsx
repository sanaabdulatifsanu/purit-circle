import React, { createContext, useContext, useState } from 'react';
import { 
  Role, 
  ManagerSubView, 
  AdminSubView, 
  Manager, 
  RestaurantReferral, 
  SalesTransaction, 
  WalletTransaction, 
  RewardItem, 
  RewardClaim, 
  NotificationItem, 
  RewardRuleConfig 
} from '../types';
import { 
  CURRENT_MANAGER, 
  ALL_MANAGERS, 
  INITIAL_RESTAURANTS, 
  SALES_TRANSACTIONS, 
  WALLET_TRANSACTIONS, 
  REWARD_ITEMS, 
  REWARD_CLAIMS, 
  NOTIFICATIONS, 
  REWARD_RULES 
} from '../data/mockData';

interface AppContextType {
  isAuthenticated: boolean;
  role: Role;
  setRole: (role: Role) => void;
  loginAsManager: (mobile?: string) => { success: boolean; message: string };
  loginAsAdmin: (code: string) => { success: boolean; message: string };
  logout: () => void;
  managerSubView: ManagerSubView;
  setManagerSubView: (view: ManagerSubView) => void;
  isAddRestaurantModalOpen: boolean;
  setIsAddRestaurantModalOpen: (open: boolean) => void;
  adminSubView: AdminSubView;
  setAdminSubView: (view: AdminSubView) => void;
  
  // Data
  currentManager: Manager;
  allManagers: Manager[];
  restaurants: RestaurantReferral[];
  salesTransactions: SalesTransaction[];
  walletTransactions: WalletTransaction[];
  rewardItems: RewardItem[];
  rewardClaims: RewardClaim[];
  notifications: NotificationItem[];
  rewardRules: RewardRuleConfig[];
  
  // Actions
  addRestaurantReferral: (data: Partial<RestaurantReferral>) => { success: boolean; message: string };
  approveRestaurant: (id: string, mappedPurityId: string) => void;
  rejectRestaurant: (id: string, reason: string) => void;
  toggleRestaurantStatus: (id: string) => void;
  submitRewardClaim: (rewardId: string, notes?: string) => { success: boolean; message: string };
  updateClaimStatus: (claimId: string, status: RewardClaim['status'], notes?: string, payoutRef?: string) => void;
  toggleManagerStatus: (managerId: string) => void;
  markNotificationRead: (id: string) => void;
  verifyAdminCode: (code: string) => boolean;
  registerManager: (data: { name: string; mobile: string; referralCode: string; password?: string }) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>('manager');
  const [managerSubView, setManagerSubView] = useState<ManagerSubView>('overview');
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState<boolean>(false);
  const [adminSubView, setAdminSubView] = useState<AdminSubView>('overview');
  
  const [currentManager, setCurrentManager] = useState<Manager>(CURRENT_MANAGER);
  const [allManagers, setAllManagers] = useState<Manager[]>(ALL_MANAGERS);
  const [restaurants, setRestaurants] = useState<RestaurantReferral[]>(INITIAL_RESTAURANTS);
  const [salesTransactions] = useState<SalesTransaction[]>(SALES_TRANSACTIONS);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(WALLET_TRANSACTIONS);
  const [rewardItems] = useState<RewardItem[]>(REWARD_ITEMS);
  const [rewardClaims, setRewardClaims] = useState<RewardClaim[]>(REWARD_CLAIMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [rewardRules] = useState<RewardRuleConfig[]>(REWARD_RULES);

  // Add restaurant referral with duplicate check
  const addRestaurantReferral = (data: Partial<RestaurantReferral>): { success: boolean; message: string } => {
    // Duplicate check on mobile number or existing purity ID
    const duplicate = restaurants.find(r => 
      (data.mobile && r.mobile === data.mobile) ||
      (data.existingPurityCustomerId && r.existingPurityCustomerId && r.existingPurityCustomerId.toUpperCase() === data.existingPurityCustomerId.toUpperCase())
    );

    if (duplicate) {
      // Add admin notification about duplicate detection attempt
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        recipientRole: 'admin',
        title: 'Duplicate Restaurant Detected',
        message: `Manager ${currentManager.name} attempted to refer "${data.restaurantName}", which already exists in system (${duplicate.restaurantName}).`,
        type: 'warning',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [newNotif, ...prev]);

      return {
        success: false,
        message: `Duplicate referral detected: A restaurant with mobile ${data.mobile} or Customer ID "${data.existingPurityCustomerId}" is already recorded.`
      };
    }

    const newRestaurant: RestaurantReferral = {
      id: `rest_${Date.now()}`,
      managerId: currentManager.id,
      managerName: currentManager.name,
      restaurantName: data.restaurantName || 'Unnamed Outlet',
      ownerName: data.ownerName || '',
      contactPerson: data.contactPerson || '',
      mobile: data.mobile || '',
      email: data.email || '',
      address: data.address || '',
      city: data.city || 'Kochi',
      state: data.state || 'Kerala',
      pinCode: data.pinCode || '',
      gstNumber: data.gstNumber,
      category: data.category || 'Casual Dining',
      existingPurityCustomerId: data.existingPurityCustomerId,
      remarks: data.remarks,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      monthlySales: 0,
      totalSales: 0,
      totalRewardsGenerated: 0,
    };

    setRestaurants(prev => [newRestaurant, ...prev]);
    setCurrentManager(prev => ({
      ...prev,
      referredRestaurantsCount: prev.referredRestaurantsCount + 1
    }));

    // Notify Admin
    const adminAlert: NotificationItem = {
      id: `notif_adm_${Date.now()}`,
      recipientRole: 'admin',
      title: 'New Restaurant Referral Submitted',
      message: `${currentManager.name} submitted "${newRestaurant.restaurantName}" (${newRestaurant.city}). Please verify and map.`,
      type: 'info',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [adminAlert, ...prev]);

    return {
      success: true,
      message: 'Restaurant referral submitted successfully! Sent to Admin for verification and Purity ID mapping.'
    };
  };

  // Admin approves restaurant and maps Purity customer ID
  const approveRestaurant = (id: string, mappedPurityId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'active',
          mappedPurityId: mappedPurityId || `PUR-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
          mappedDate: new Date().toISOString().split('T')[0],
        };
      }
      return r;
    }));

    const target = restaurants.find(r => r.id === id);
    if (target) {
      // Notify Manager
      const mgrNotif: NotificationItem = {
        id: `notif_mgr_${Date.now()}`,
        recipientRole: 'manager',
        managerId: target.managerId,
        title: 'Restaurant Approved & Mapped!',
        message: `Your referral "${target.restaurantName}" has been approved by Admin and mapped to Purity ID ${mappedPurityId}. Sales sync is now active.`,
        type: 'success',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [mgrNotif, ...prev]);
    }
  };

  // Admin rejects restaurant
  const rejectRestaurant = (id: string, reason: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'rejected',
          rejectionReason: reason || 'Not meeting eligibility criteria or duplicate outlet.'
        };
      }
      return r;
    }));

    const target = restaurants.find(r => r.id === id);
    if (target) {
      const mgrNotif: NotificationItem = {
        id: `notif_mgr_${Date.now()}`,
        recipientRole: 'manager',
        managerId: target.managerId,
        title: 'Restaurant Referral Declined',
        message: `Your referral for "${target.restaurantName}" was not approved: ${reason}`,
        type: 'error',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [mgrNotif, ...prev]);
    }
  };

  // Toggle restaurant active/inactive (Simulates automatic status sync from Purity Website)
  const toggleRestaurantStatus = (id: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'active' ? 'inactive' : 'active';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  // Manager submits reward claim
  const submitRewardClaim = (rewardId: string, notes?: string): { success: boolean; message: string } => {
    const item = rewardItems.find(r => r.id === rewardId);
    if (!item) return { success: false, message: 'Invalid reward selection.' };

    if (currentManager.walletBalance < item.requiredBalance) {
      return { 
        success: false, 
        message: `Insufficient wallet balance. You have ₹${currentManager.walletBalance.toLocaleString('en-IN')}, but ₹${item.requiredBalance.toLocaleString('en-IN')} is required.` 
      };
    }

    const newClaimId = `CLM-2026-${Math.floor(200 + Math.random() * 800)}`;

    // Create claim
    const newClaim: RewardClaim = {
      id: newClaimId,
      managerId: currentManager.id,
      managerName: currentManager.name,
      managerMobile: currentManager.mobile,
      rewardId: item.id,
      rewardTitle: item.title,
      rewardCategory: item.category,
      requiredAmount: item.requiredBalance,
      claimedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: notes || 'Standard redemption request.',
    };

    // Deduct / reserve available balance
    const updatedBalance = currentManager.walletBalance - item.requiredBalance;
    setCurrentManager(prev => ({
      ...prev,
      walletBalance: updatedBalance
    }));

    // Record Ledger HOLD/DEBIT
    const ledgerEntry: WalletTransaction = {
      id: `WAL-TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'HOLD',
      category: 'CLAIM_REDEEM',
      amount: item.requiredBalance,
      description: `Hold for Claim ${newClaimId} (${item.title})`,
      referenceId: newClaimId,
      balanceAfter: updatedBalance,
      status: 'pending'
    };

    setWalletTransactions(prev => [ledgerEntry, ...prev]);
    setRewardClaims(prev => [newClaim, ...prev]);

    // Admin alert
    const admAlert: NotificationItem = {
      id: `notif_adm_${Date.now()}`,
      recipientRole: 'admin',
      title: 'New Reward Redemption Request',
      message: `${currentManager.name} requested "${item.title}" (₹${item.requiredBalance.toLocaleString('en-IN')}).`,
      type: 'info',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [admAlert, ...prev]);

    return {
      success: true,
      message: `Redemption claim for "${item.title}" submitted! ₹${item.requiredBalance.toLocaleString('en-IN')} is reserved pending Admin approval.`
    };
  };

  // Admin updates claim status (Approved, Processing, Completed, Rejected)
  const updateClaimStatus = (claimId: string, status: RewardClaim['status'], notes?: string, payoutRef?: string) => {
    const claim = rewardClaims.find(c => c.id === claimId);
    if (!claim) return;

    if (status === 'rejected') {
      // Release held balance back to manager
      if (claim.managerId === currentManager.id) {
        setCurrentManager(prev => ({
          ...prev,
          walletBalance: prev.walletBalance + claim.requiredAmount
        }));
      }

      // Add Release ledger entry
      const releaseLedger: WalletTransaction = {
        id: `WAL-TX-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'CREDIT',
        category: 'CLAIM_REJECT_RELEASE',
        amount: claim.requiredAmount,
        description: `Release of reserved balance: Claim ${claimId} declined (${notes || 'Admin rejection'})`,
        referenceId: claimId,
        balanceAfter: (currentManager.walletBalance + claim.requiredAmount),
        status: 'completed'
      };
      setWalletTransactions(prev => [releaseLedger, ...prev]);
    }

    setRewardClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status,
          rejectionReason: status === 'rejected' ? notes : undefined,
          payoutReference: payoutRef || c.payoutReference,
        };
      }
      return c;
    }));

    // Notify Manager
    const mgrNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientRole: 'manager',
      managerId: claim.managerId,
      title: status === 'completed' ? 'Reward Claim Completed & Paid!' : status === 'approved' ? 'Reward Claim Approved!' : 'Reward Claim Update',
      message: status === 'completed'
        ? `Payout reference ${payoutRef || 'UTR-PROCESSED'} confirmed for ${claim.rewardTitle}.`
        : status === 'rejected'
        ? `Your claim for ${claim.rewardTitle} was rejected: ${notes}. Reserved balance released back.`
        : `Your claim for ${claim.rewardTitle} is now ${status}.`,
      type: status === 'completed' || status === 'approved' ? 'success' : 'error',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [mgrNotif, ...prev]);
  };

  const toggleManagerStatus = (managerId: string) => {
    setAllManagers(prev => prev.map(m => {
      if (m.id === managerId) {
        return { ...m, status: m.status === 'active' ? 'inactive' : 'active' };
      }
      return m;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Secure Admin Access Code Verification
  const verifyAdminCode = (code: string): boolean => {
    return code === 'risasi123';
  };

  // Register Manager
  const registerManager = (data: { name: string; mobile: string; referralCode: string }): { success: boolean; message: string } => {
    // Valid referral code check: must match 1001 or an existing manager's code
    const validReferrer = allManagers.find(m => m.referralCode.toUpperCase() === data.referralCode.toUpperCase());
    const isInitialCode = data.referralCode === '1001';

    if (!validReferrer && !isInitialCode) {
      return {
        success: false,
        message: 'Invalid referral code. A valid existing manager code (or initial code 1001) is required to register.'
      };
    }

    const firstLetter = (data.name.trim()[0] || 'M').toUpperCase();
    const newCode = `${firstLetter}${Math.floor(1000 + Math.random() * 9000)}`;

    const newMgr: Manager = {
      id: `mgr_${Date.now()}`,
      name: data.name,
      mobile: data.mobile,
      email: `${data.name.toLowerCase().replace(/\s+/g, '.')}@puritycircle.in`,
      referralCode: newCode,
      referredByCode: data.referralCode,
      referredByName: validReferrer ? validReferrer.name : 'Initial System Code (1001)',
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'active',
      referredRestaurantsCount: 0,
      totalSalesGenerated: 0,
      walletBalance: 0,
      totalRewardsEarned: 0,
    };

    setAllManagers(prev => [...prev, newMgr]);
    setCurrentManager(newMgr);
    setRole('manager');
    setIsAuthenticated(true);
    setManagerSubView('overview');

    return {
      success: true,
      message: `Registration successful! Your unique referral code is ${newCode}. Welcome to Purity Circle.`
    };
  };

  const loginAsManager = (mobile?: string) => {
    if (mobile) {
      const match = allManagers.find(m => m.mobile === mobile);
      if (match) {
        setCurrentManager(match);
      }
    }
    setRole('manager');
    setIsAuthenticated(true);
    setManagerSubView('overview');
    return { success: true, message: 'Welcome to Manager Portal!' };
  };

  const loginAsAdmin = (code: string) => {
    if (code.trim() === 'risasi123') {
      setRole('admin');
      setIsAuthenticated(true);
      setAdminSubView('overview');
      return { success: true, message: 'Admin authentication successful!' };
    }
    return { success: false, message: 'Invalid Admin Access Code. Enter risasi123 to unlock.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      role,
      setRole,
      loginAsManager,
      loginAsAdmin,
      logout,
      managerSubView,
      setManagerSubView,
      isAddRestaurantModalOpen,
      setIsAddRestaurantModalOpen,
      adminSubView,
      setAdminSubView,
      currentManager,
      allManagers,
      restaurants,
      salesTransactions,
      walletTransactions,
      rewardItems,
      rewardClaims,
      notifications,
      rewardRules,
      addRestaurantReferral,
      approveRestaurant,
      rejectRestaurant,
      toggleRestaurantStatus,
      submitRewardClaim,
      updateClaimStatus,
      toggleManagerStatus,
      markNotificationRead,
      verifyAdminCode,
      registerManager,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
