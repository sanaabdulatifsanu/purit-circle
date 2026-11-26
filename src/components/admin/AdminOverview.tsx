import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Store, 
  TrendingUp, 
  Wallet, 
  Gift, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  ArrowUpRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminOverview: React.FC = () => {
  const { 
    allManagers, 
    restaurants, 
    salesTransactions, 
    rewardClaims, 
    setAdminSubView,
    setClaimsViewMode 
  } = useApp();

  const totalSales = salesTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRewards = salesTransactions.reduce((acc, curr) => acc + curr.rewardAmount, 0);
  const pendingApprovals = restaurants.filter(r => r.status === 'pending');
  const activeRestaurants = restaurants.filter(r => r.status === 'active');
  const pendingClaims = rewardClaims.filter(c => c.status === 'pending');

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Purity Sync Status */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#123C32]">Admin Master Console</h1>
            <span className="bg-[#123C32] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D5AE62]" /> Master Access
            </span>
          </div>
          <p className="text-xs text-[#78847D] mt-1">
            Governance for managers, restaurant referral mappings, synchronized sales, and rewards wallet payouts.
          </p>
        </div>

        {/* Sync Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="bg-[#21865A]/10 border border-[#21865A]/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#21865A] animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider block">Purity API Core</span>
              <span className="text-xs font-bold text-[#21865A]">Synchronized (Live)</span>
            </div>
          </div>

          <button 
            onClick={() => setAdminSubView('restaurants')}
            className="btn-primary text-xs"
          >
            Review Approvals ({pendingApprovals.length})
          </button>
        </div>
      </div>

      {/* Admin KPI Matrix (PRD Section 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
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
            <span className="text-[11px] font-medium">Active Restaurants</span>
            <Store className="w-3.5 h-3.5 text-[#1B6B50]" />
          </div>
          <div className="text-2xl font-bold text-[#123C32]">{activeRestaurants.length}</div>
          <span className="text-[10px] text-[#21865A] mt-1 block font-medium">{restaurants.length} Total Recorded ({activeRestaurants.length} Active)</span>
        </div>

        <div className="purity-card p-4 hover:border-[#D99A32] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-1">
            <span className="text-[11px] font-medium">Pending Approvals</span>
            <Clock className="w-3.5 h-3.5 text-[#D99A32]" />
          </div>
          <div className="text-2xl font-bold text-[#D99A32]">{pendingApprovals.length}</div>
          <span className="text-[10px] text-[#D99A32] mt-1 block font-medium">Awaiting admin verification</span>
        </div>

        <div className="purity-card p-4 hover:border-[#123C32] transition-colors">
          <div className="flex items-center justify-between text-[#78847D] mb-1">
            <span className="text-[11px] font-medium">Synchronized Sales</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#123C32]" />
          </div>
          <div className="text-2xl font-bold text-[#123C32]">₹{(totalSales + 1200000).toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#21865A] mt-1 block">+18.5% MoM</span>
        </div>

        <div className="purity-card p-4 hover:border-[#D5AE62] transition-colors">
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
              <p className="text-xs text-[#78847D]">Leads submitted by managers requiring Purity ID verification</p>
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
                      Referred by: <span className="font-semibold text-[#123C32]">{rest.managerName}</span> • {rest.city}
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
              <p className="text-xs text-[#78847D]">Manager redemption requests awaiting approval</p>
            </div>
            <button 
              onClick={() => {
                setClaimsViewMode('pending-view');
                setAdminSubView('claims');
              }}
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#202B27]">{claim.rewardTitle}</span>
                      <span className="font-mono text-[10px] text-[#78847D]">{claim.id}</span>
                    </div>
                    <div className="text-[11px] text-[#78847D] mt-0.5">
                      Requested by: <span className="font-semibold text-[#123C32]">{claim.managerName}</span> • ₹{claim.requiredAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setClaimsViewMode('pending-view');
                      setAdminSubView('claims');
                    }}
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
