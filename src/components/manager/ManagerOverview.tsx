import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  TrendingUp, 
  Wallet, 
  Coins, 
  Users, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  PlusCircle,
  Gift
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const ManagerOverview: React.FC = () => {
  const { 
    currentManager, 
    restaurants, 
    salesTransactions, 
    setManagerSubView,
    directReferralBonus
  } = useApp();

  // Filter manager's own restaurants (active/approved prioritized first)
  const myRestaurants = restaurants.filter(r => r.managerId === currentManager.id);
  const displayRestaurants = [...myRestaurants].sort((a, b) => {
    if ((a.status === 'active' || a.status === 'approved') && b.status !== 'active') return -1;
    if (a.status !== 'active' && (b.status === 'active' || b.status === 'approved')) return 1;
    return 0;
  });
  const activeCount = myRestaurants.filter(r => r.status === 'active').length;
  const inactiveCount = myRestaurants.filter(r => r.status === 'inactive').length;
  const pendingCount = myRestaurants.filter(r => r.status === 'pending').length;

  const totalMonthlySales = myRestaurants.reduce((acc, curr) => acc + curr.monthlySales, 0);
  const totalLifetimeSales = myRestaurants.reduce((acc, curr) => acc + curr.totalSales, 0);

  // Manager's own transactions
  const mySales = salesTransactions.filter(tx => tx.managerId === currentManager.id);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#123C32]">
              Welcome back, {currentManager.name}
            </h1>
            <span className="bg-[#123C32]/10 text-[#123C32] text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Manager #{currentManager.referralCode}
            </span>
          </div>
          <p className="text-xs text-[#78847D] mt-1">
            Tracking your referred restaurant sales and earned incentives synchronized with Purity Core.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setManagerSubView('restaurants')}
            className="btn-primary text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            + Add Restaurant
          </button>
          
          <button 
            onClick={() => setManagerSubView('claim')}
            className="btn-accent text-xs"
          >
            <Gift className="w-4 h-4 text-[#123C32]" />
            Claim Rewards
          </button>
        </div>
      </div>

      {/* KPI Grid (8 metrics specified in PRD Section 10) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Referred Restaurants */}
        <div className="purity-card p-4 hover:border-[#1B6B50] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-medium">Total Referred Restaurants</span>
            <div className="w-7 h-7 rounded-lg bg-[#123C32]/10 flex items-center justify-center text-[#123C32]">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#123C32]">
            {myRestaurants.length}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1 flex items-center gap-1">
            <span>{pendingCount} pending admin review</span>
          </div>
        </div>

        {/* Active Restaurants */}
        <div className="purity-card p-4 hover:border-[#21865A] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-medium">Active Restaurants</span>
            <div className="w-7 h-7 rounded-lg bg-[#21865A]/10 flex items-center justify-center text-[#21865A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#21865A]">
            {activeCount}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            Generating reward points
          </div>
        </div>

        {/* Inactive Restaurants */}
        <div className="purity-card p-4 hover:border-[#D9534F] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-medium">Inactive Restaurants</span>
            <div className="w-7 h-7 rounded-lg bg-[#D9534F]/10 flex items-center justify-center text-[#D9534F]">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#D9534F]">
            {inactiveCount}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            Synced from Purity status
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="purity-card p-4 hover:border-[#1B6B50] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-medium">Monthly Sales (Nov)</span>
            <div className="w-7 h-7 rounded-lg bg-[#1B6B50]/10 flex items-center justify-center text-[#1B6B50]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#123C32]">
            ₹{totalMonthlySales.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#21865A] mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="purity-card p-4 hover:border-[#123C32] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-medium">Total Lifetime Sales</span>
            <div className="w-7 h-7 rounded-lg bg-[#123C32]/10 flex items-center justify-center text-[#123C32]">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#123C32]">
            ₹{totalLifetimeSales.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            Across verified customer orders
          </div>
        </div>

        {/* Total Rewards Earned */}
        <div className="purity-card p-4 hover:border-[#D5AE62] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-medium">Total Rewards Earned</span>
            <div className="w-7 h-7 rounded-lg bg-[#D5AE62]/20 flex items-center justify-center text-[#123C32]">
              <Sparkles className="w-4 h-4 text-[#D5AE62]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#123C32]">
            ₹{currentManager.totalRewardsEarned.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            Sales commission + Referral bonuses
          </div>
        </div>

        {/* Available Reward Balance */}
        <div className="purity-card p-4 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-[#D5AE62] border-2 shadow-sm">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-bold text-[#123C32]">Available Balance</span>
            <div className="w-7 h-7 rounded-lg bg-[#D5AE62] flex items-center justify-center text-[#123C32] shadow-xs">
              <Wallet className="w-4 h-4 text-[#123C32]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#123C32]">
            ₹{currentManager.walletBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#1B6B50] font-semibold mt-1">
            Ready for instant redemption
          </div>
        </div>

        {/* Pending Claims */}
        <div className="purity-card p-4 hover:border-[#D99A32] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-2">
            <span className="text-xs font-medium">Pending Claims</span>
            <div className="w-7 h-7 rounded-lg bg-[#D99A32]/10 flex items-center justify-center text-[#D99A32]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#D99A32]">
            ₹0
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            No claims awaiting review
          </div>
        </div>

      </div>

      {/* Featured Incentive & Referral Highlight Card */}
      <div className="bg-[#123C32] text-white rounded-2xl p-6 border border-[#1B6B50] shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D5AE62]/20 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-[#D5AE62]/20 border border-[#D5AE62]/40 text-[#D5AE62] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Direct Referral Bonus
            </div>
            <h3 className="text-lg font-bold text-white">
              Earn ₹{directReferralBonus.toLocaleString('en-IN')} for each new manager you refer!
            </h3>
            <p className="text-xs text-[#E2E9E3]/90 leading-relaxed">
              When a manager registers with your code <span className="font-mono font-bold text-[#D5AE62]">{currentManager.referralCode}</span> and their referred restaurant achieves qualifying sales, ₹{directReferralBonus.toLocaleString('en-IN')} is directly credited to your wallet.
            </p>
          </div>

          <button 
            onClick={() => setManagerSubView('referrals')}
            className="btn-accent text-xs whitespace-nowrap"
          >
            <Users className="w-4 h-4 text-[#123C32]" />
            View Referral Program & Code
          </button>
        </div>
      </div>

      {/* My Approved Restaurants & Recent Synced Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* My Approved Restaurants Preview */}
        <div className="purity-card p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E9E3]">
            <div>
              <h3 className="text-sm font-bold text-[#123C32]">My Approved Restaurants</h3>
              <p className="text-xs text-[#78847D]">Mapped & active outlets earning rewards</p>
            </div>
            <button 
              onClick={() => setManagerSubView('restaurants')}
              className="text-xs font-semibold text-[#1B6B50] hover:text-[#123C32] hover:underline"
            >
              View All ({myRestaurants.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {displayRestaurants.length === 0 ? (
              <p className="text-xs text-[#78847D] py-4 text-center">No referred restaurants yet.</p>
            ) : (
              displayRestaurants.slice(0, 4).map(rest => (
                <div 
                  key={rest.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E9E3] hover:border-[#1B6B50] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#123C32] text-white flex items-center justify-center font-bold text-xs">
                      {rest.restaurantName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#202B27]">{rest.restaurantName}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#78847D]">
                        <span>{rest.city}</span>
                        <span>•</span>
                        <span className="font-mono">{rest.mappedPurityId || 'Mapping Pending'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge status={rest.status} size="sm" />
                    <div className="text-xs font-bold text-[#123C32] mt-1">
                      ₹{rest.monthlySales.toLocaleString('en-IN')} <span className="text-[10px] text-[#78847D] font-normal">/mo</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Synced Sales Transactions */}
        <div className="purity-card p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E9E3]">
            <div>
              <h3 className="text-sm font-bold text-[#123C32]">Recent Synced Sales</h3>
              <p className="text-xs text-[#78847D]">Live transaction feeds from Purity Core</p>
            </div>
            <button 
              onClick={() => setManagerSubView('restaurants')}
              className="text-xs font-semibold text-[#1B6B50] hover:text-[#123C32] hover:underline"
            >
              View Restaurants →
            </button>
          </div>

          <div className="space-y-3">
            {mySales.length === 0 ? (
              <p className="text-xs text-[#78847D] py-4 text-center">No recent sales records.</p>
            ) : (
              mySales.slice(0, 3).map(tx => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E9E3]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#202B27]">{tx.restaurantName}</span>
                      <span className="font-mono text-[10px] bg-[#E2E9E3] text-[#78847D] px-1.5 py-0.2 rounded">
                        {tx.id}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#78847D] mt-0.5">
                      {tx.items.length} product lines • {tx.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#123C32] block">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-semibold text-[#21865A] block">
                      +₹{tx.rewardAmount.toLocaleString('en-IN')} reward
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
