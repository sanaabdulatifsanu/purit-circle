export type Role = 'manager' | 'admin';

export type ManagerSubView = 
  | 'overview' 
  | 'restaurants' 
  | 'sales' 
  | 'earnings' 
  | 'wallet' 
  | 'claim' 
  | 'referrals' 
  | 'notifications' 
  | 'profile';

export type AdminSubView = 
  | 'overview' 
  | 'managers' 
  | 'referrals' 
  | 'restaurants' 
  | 'sales' 
  | 'reward-config' 
  | 'referral-rewards' 
  | 'wallet' 
  | 'claims' 
  | 'payouts' 
  | 'notifications' 
  | 'reports' 
  | 'settings';

export interface Manager {
  id: string;
  name: string;
  mobile: string;
  email: string;
  referralCode: string; // e.g. A1001, 1001
  referredByCode?: string; // e.g. 1001
  referredByName?: string;
  registeredDate: string;
  status: 'active' | 'inactive';
  referredRestaurantsCount: number;
  totalSalesGenerated: number;
  walletBalance: number;
  totalRewardsEarned: number;
}

export type RestaurantStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';

export interface RestaurantReferral {
  id: string;
  managerId: string;
  managerName: string;
  restaurantName: string;
  ownerName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber?: string;
  category: 'Fine Dining' | 'Casual Dining' | 'Cafe' | 'QSR' | 'Hotel';
  existingPurityCustomerId?: string; // Provided by manager or mapped by admin
  remarks?: string;
  submissionDate: string;
  status: RestaurantStatus;
  rejectionReason?: string;
  mappedPurityId?: string; // Mapped by Admin
  mappedDate?: string;
  monthlySales: number;
  totalSales: number;
  totalRewardsGenerated: number;
}

export interface ProductSale {
  productId: string;
  productName: string;
  category: string;
  unitsSold: number;
  unitPrice: number;
  totalAmount: number;
}

export interface SalesTransaction {
  id: string; // External Purity Tx ID
  restaurantId: string;
  restaurantName: string;
  managerId: string;
  managerName: string;
  date: string;
  amount: number;
  items: ProductSale[];
  rewardAmount: number;
  status: 'synced' | 'processed';
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'CREDIT' | 'DEBIT' | 'HOLD';
  category: 'SALES_REWARD' | 'DIRECT_REFERRAL_BONUS' | 'CLAIM_REDEEM' | 'CLAIM_REJECT_RELEASE';
  amount: number;
  description: string;
  referenceId: string; // e.g., Tx ID or Claim ID
  balanceAfter: number;
  status: 'completed' | 'pending';
}

export type RewardCategory = 'cash' | 'trip' | 'gadget' | 'gift';

export interface RewardItem {
  id: string;
  title: string;
  category: RewardCategory;
  requiredBalance: number;
  description: string;
  imageUrl: string;
  badge?: string;
  terms: string[];
  isAvailable: boolean;
}

export interface RewardClaim {
  id: string;
  managerId: string;
  managerName: string;
  managerMobile: string;
  rewardId: string;
  rewardTitle: string;
  rewardCategory: RewardCategory;
  requiredAmount: number;
  claimedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  payoutReference?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: 'manager' | 'admin';
  managerId?: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
}

export interface RewardRuleConfig {
  id: string;
  name: string;
  type: 'percentage' | 'fixed_per_unit' | 'slab';
  percentageRate?: number; // e.g. 5%
  fixedRatePerUnit?: number; // e.g. ₹50 per box
  slabs?: {
    minAmount: number;
    maxAmount: number;
    percentage: number;
  }[];
  minimumQualifyingSales: number;
  effectiveFrom: string;
  status: 'active' | 'archived';
}
