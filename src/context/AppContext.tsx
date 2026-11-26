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
  adminSubView: AdminSubView;
  setAdminSubView: (view: AdminSubView) => void;
  claimsViewMode: 'table' | 'pending-view';
  setClaimsViewMode: (mode: 'table' | 'pending-view') => void;
  
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
  approveRestaurant: (id: string, mappedPurityId?: string) => void;
  rejectRestaurant: (id: string, reason?: string) => void;
  toggleRestaurantStatus: (id: string) => void;
  submitRewardClaim: (rewardId: string, notes?: string) => { success: boolean; message: string };
  updateClaimStatus: (claimId: string, status: RewardClaim['status'], notes?: string, payoutRef?: string) => void;
  toggleManagerStatus: (managerId: string) => void;
  markNotificationRead: (id: string) => void;
  adminPasscode: string;
  updateAdminPasscode: (code: string) => void;
  defaultCommissionRate: number;
  minRedemptionThreshold: number | null;
  updateGlobalCommissionSettings: (rate: number, minThreshold: number | null, overwriteCustomRates: boolean) => void;
  directReferralBonus: number;
  directReferralThreshold: number;
  updateDirectReferralSettings: (bonus: number, threshold: number) => void;
  verifyAdminCode: (code: string) => boolean;
  registerManager: (data: { name: string; mobile: string; referralCode: string; password?: string }) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>('manager');
  const [managerSubView, setManagerSubView] = useState<ManagerSubView>('overview');
  const [adminSubView, setAdminSubView] = useState<AdminSubView>('overview');
  const [claimsViewMode, setClaimsViewMode] = useState<'table' | 'pending-view'>('table');
  
  const [currentManager, setCurrentManager] = useState<Manager>(CURRENT_MANAGER);
  const [allManagers, setAllManagers] = useState<Manager[]>(ALL_MANAGERS);
  const [restaurants, setRestaurants] = useState<RestaurantReferral[]>(INITIAL_RESTAURANTS);
  const [salesTransactions, setSalesTransactions] = useState<SalesTransaction[]>(SALES_TRANSACTIONS);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(WALLET_TRANSACTIONS);
  const [rewardItems] = useState<RewardItem[]>(REWARD_ITEMS);
  const [rewardClaims, setRewardClaims] = useState<RewardClaim[]>(REWARD_CLAIMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [rewardRules] = useState<RewardRuleConfig[]>(REWARD_RULES);
  const [adminPasscode, setAdminPasscode] = useState<string>('risasi123');
  const [defaultCommissionRate, setDefaultCommissionRate] = useState<number>(10);
  const [minRedemptionThreshold, setMinRedemptionThreshold] = useState<number | null>(null);
  const [directReferralBonus, setDirectReferralBonus] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('purit_direct_referral_bonus');
      return saved !== null && !isNaN(parseFloat(saved)) ? Math.max(0, parseFloat(saved)) : 2000;
    } catch {
      return 2000;
    }
  });
  const [directReferralThreshold, setDirectReferralThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('purit_direct_referral_threshold');
      return saved !== null && !isNaN(parseFloat(saved)) ? Math.max(0, parseFloat(saved)) : 25000;
    } catch {
      return 25000;
    }
  });

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
      managerReferralCode: currentManager.referralCode,
      restaurantName: data.restaurantName || 'Unnamed Outlet',
      ownerName: data.ownerName || '',
      contactPerson: data.contactPerson || '',
      mobile: data.mobile || '',
      email: data.email || '',
      address: data.address || '',
      city: data.city || 'Bengaluru',
      state: data.state || 'Karnataka',
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

    // Notify Admin with full restaurant & referring manager details
    const adminAlert: NotificationItem = {
      id: `notif_adm_${Date.now()}`,
      recipientRole: 'admin',
      title: 'Restaurant Verification Request',
      message: `${currentManager.name} (${currentManager.referralCode}) submitted "${newRestaurant.restaurantName}" in ${newRestaurant.city}. Verification required.`,
      type: 'warning',
      timestamp: 'Just now',
      isRead: false,
      restaurantId: newRestaurant.id,
      verificationData: {
        restaurantName: newRestaurant.restaurantName,
        ownerName: newRestaurant.ownerName || 'Not Provided',
        contactPerson: newRestaurant.contactPerson || newRestaurant.ownerName || 'Not Provided',
        phone: newRestaurant.mobile,
        email: newRestaurant.email || 'N/A',
        address: newRestaurant.address || 'N/A',
        city: newRestaurant.city,
        state: newRestaurant.state || 'Karnataka',
        pinCode: newRestaurant.pinCode || 'N/A',
        gstNumber: newRestaurant.gstNumber || 'Not Provided',
        category: newRestaurant.category,
        remarks: newRestaurant.remarks,
        managerName: currentManager.name,
        managerReferralCode: currentManager.referralCode,
      }
    };
    setNotifications(prev => [adminAlert, ...prev]);

    return {
      success: true,
      message: 'Restaurant referral submitted successfully! Sent to Admin for verification and Purity ID mapping.'
    };
  };

  // Admin approves restaurant, maps Purity customer ID, links sales, and updates counts
  const approveRestaurant = (id: string, mappedPurityId?: string) => {
    const target = restaurants.find(r => r.id === id);
    if (!target) return;

    const finalMappedId = mappedPurityId || target.existingPurityCustomerId || `PUR-BLR-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialOrderAmount = target.totalSales > 0 ? target.totalSales : 34500;
    const initialRewardAmount = target.totalRewardsGenerated > 0 ? target.totalRewardsGenerated : 3450;

    // 1. Update restaurant to active with mapped ID and initial linked sales
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'active',
          mappedPurityId: finalMappedId,
          mappedDate: new Date().toISOString().split('T')[0],
          monthlySales: r.monthlySales > 0 ? r.monthlySales : initialOrderAmount,
          totalSales: r.totalSales > 0 ? r.totalSales : initialOrderAmount,
          totalRewardsGenerated: r.totalRewardsGenerated > 0 ? r.totalRewardsGenerated : initialRewardAmount,
        };
      }
      return r;
    }));

    // 2. Add linked sales transaction if not already present
    const existingTx = salesTransactions.find(tx => tx.restaurantId === id);
    if (!existingTx) {
      const initialSale: SalesTransaction = {
        id: `TX-PUR-${Math.floor(100000 + Math.random() * 900000)}`,
        restaurantId: target.id,
        restaurantName: target.restaurantName,
        managerId: target.managerId,
        managerName: target.managerName,
        date: new Date().toISOString().split('T')[0],
        amount: initialOrderAmount,
        rewardAmount: initialRewardAmount,
        status: 'synced',
        items: [
          {
            productId: 'prod_001',
            productName: 'Purity Soft Table Napkins (Case of 24)',
            category: 'Paper Products',
            unitsSold: 25,
            unitPrice: 580,
            totalAmount: 14500,
          },
          {
            productId: 'prod_002',
            productName: 'Purity Anti-Bacterial Hand Wash 5L',
            category: 'Cleaning & Hygiene',
            unitsSold: 20,
            unitPrice: 1000,
            totalAmount: 20000,
          }
        ]
      };
      setSalesTransactions(prev => [initialSale, ...prev]);

      // Record wallet transaction for sales reward credit
      const newWalletTx: WalletTransaction = {
        id: `WLT-TX-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'CREDIT',
        category: 'SALES_REWARD',
        amount: initialRewardAmount,
        description: `10% reward on synced sales for ${target.restaurantName}`,
        referenceId: initialSale.id,
        balanceAfter: currentManager.walletBalance + initialRewardAmount,
        status: 'completed',
      };
      setWalletTransactions(prev => [newWalletTx, ...prev]);
    }

    // 3. Update manager's sales & wallet stats
    setCurrentManager(prev => {
      if (prev.id === target.managerId) {
        return {
          ...prev,
          totalSalesGenerated: prev.totalSalesGenerated + initialOrderAmount,
          totalRewardsEarned: prev.totalRewardsEarned + initialRewardAmount,
          walletBalance: prev.walletBalance + initialRewardAmount
        };
      }
      return prev;
    });

    setAllManagers(prev => prev.map(m => {
      if (m.id === target.managerId) {
        return {
          ...m,
          totalSalesGenerated: m.totalSalesGenerated + initialOrderAmount,
          totalRewardsEarned: m.totalRewardsEarned + initialRewardAmount,
          walletBalance: m.walletBalance + initialRewardAmount
        };
      }
      return m;
    }));

    // 4. Notify Manager
    const mgrNotif: NotificationItem = {
      id: `notif_mgr_${Date.now()}`,
      recipientRole: 'manager',
      managerId: target.managerId,
      title: 'Restaurant Approved & Mapped!',
      message: `Your referral "${target.restaurantName}" has been approved by Admin and mapped to Purity ID ${finalMappedId}. Sales sync is active with ₹${initialOrderAmount.toLocaleString('en-IN')} verified orders.`,
      type: 'success',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [mgrNotif, ...prev]);
  };

  // Admin rejects restaurant
  const rejectRestaurant = (id: string, reason?: string) => {
    const rejectionReason = reason || 'Not meeting eligibility criteria or duplicate outlet.';
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'rejected',
          rejectionReason: rejectionReason
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
        message: `Your referral for "${target.restaurantName}" was not approved: ${rejectionReason}`,
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

    // Create claim with pre- and post-redemption balances
    const currentBal = currentManager.walletBalance;
    const updatedBalance = currentBal - item.requiredBalance;

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
      preRedemptionBalance: currentBal,
      postRedemptionBalance: updatedBalance,
    };

    // Deduct / reserve available balance
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

  const updateAdminPasscode = (code: string) => {
    const trimmed = code.trim();
    if (trimmed) {
      setAdminPasscode(trimmed);
    }
  };

  const updateGlobalCommissionSettings = (
    rate: number,
    minThreshold: number | null,
    overwriteCustomRates: boolean
  ) => {
    setDefaultCommissionRate(rate);
    setMinRedemptionThreshold(minThreshold);

    if (overwriteCustomRates) {
      setAllManagers(prev =>
        prev.map(m => ({ ...m, customCommissionRate: undefined }))
      );
      setCurrentManager(prev => ({ ...prev, customCommissionRate: undefined }));
    }
  };

  const updateDirectReferralSettings = (bonus: number, threshold: number) => {
    setDirectReferralBonus(bonus);
    setDirectReferralThreshold(threshold);
    try {
      localStorage.setItem('purit_direct_referral_bonus', String(bonus));
      localStorage.setItem('purit_direct_referral_threshold', String(threshold));
    } catch (e) {
      console.warn('Unable to persist referral settings to localStorage:', e);
    }
  };

  // Secure Admin Access Code Verification
  const verifyAdminCode = (code: string): boolean => {
    return code === adminPasscode;
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
    if (code.trim() === adminPasscode) {
      setRole('admin');
      setIsAuthenticated(true);
      setAdminSubView('overview');
      return { success: true, message: 'Admin authentication successful!' };
    }
    return { success: false, message: 'Invalid Admin Access Code. Enter the active admin passcode to unlock.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setClaimsViewMode('table');
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
      adminSubView,
      setAdminSubView,
      claimsViewMode,
      setClaimsViewMode,
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
      adminPasscode,
      updateAdminPasscode,
      defaultCommissionRate,
      minRedemptionThreshold,
      updateGlobalCommissionSettings,
      directReferralBonus,
      directReferralThreshold,
      updateDirectReferralSettings,
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
