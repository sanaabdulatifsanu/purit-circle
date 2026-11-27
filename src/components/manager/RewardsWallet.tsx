import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Plane,
  Smartphone,
  Banknote,
  Calendar,
  CheckCircle2,
  Sparkles,
  Clock
} from 'lucide-react';
import { RewardClaim } from '../../types';

export const RewardsWallet: React.FC = () => {
  const { currentManager, rewardClaims, setManagerSubView } = useApp();

  const [claimCategoryFilter, setClaimCategoryFilter] = useState<'all' | 'trip' | 'gadget' | 'cash'>('all');

  // Filter manager's actual claims
  const actualManagerClaims = rewardClaims.filter(c => c.managerId === currentManager.id);

  // If newly registered manager has no claims yet, provide rich demonstration records
  // showcasing how rewards are collected (International Trip, Gadget, Cash Amount, Points used, and Redeem Date)
  const sampleClaims: RewardClaim[] = [
    {
      id: 'CLM-TRIP-2026-081',
      managerId: currentManager.id,
      managerName: currentManager.name,
      managerMobile: currentManager.mobile,
      rewardId: 'rew_trip_thai',
      rewardTitle: '5-Day International Trip to Thailand (Bangkok & Pattaya)',
      rewardCategory: 'trip',
      requiredAmount: 120000,
      claimedDate: '2026-11-15',
      status: 'completed',
      payoutReference: 'TRIP-BKK-492081',
      notes: 'All-inclusive flights & 5-star hotel package issued'
    },
    {
      id: 'CLM-GADGET-2026-042',
      managerId: currentManager.id,
      managerName: currentManager.name,
      managerMobile: currentManager.mobile,
      rewardId: 'rew_gadget_iphone',
      rewardTitle: 'Apple iPhone 15 Pro 128GB (Natural Titanium)',
      rewardCategory: 'gadget',
      requiredAmount: 80000,
      claimedDate: '2026-11-02',
      status: 'completed',
      payoutReference: 'AWB-BLR-892104',
      notes: 'Dispatched via BlueDart Express with transit insurance'
    },
    {
      id: 'CLM-CASH-2026-104',
      managerId: currentManager.id,
      managerName: currentManager.name,
      managerMobile: currentManager.mobile,
      rewardId: 'rew_cash_25k',
      rewardTitle: '₹25,000 Direct Bank Cash Transfer',
      rewardCategory: 'cash',
      requiredAmount: 25000,
      claimedDate: '2026-10-24',
      status: 'completed',
      payoutReference: 'UTR-HDFC-99218401',
      notes: 'Disbursed directly to registered HDFC bank account'
    }
  ];

  const displayClaims = actualManagerClaims.length > 0 ? actualManagerClaims : sampleClaims;
  const completedClaims = displayClaims.filter(c => c.status === 'completed');
  const pendingClaims = displayClaims.filter(c => c.status !== 'completed');

  const filteredDisplayClaims = displayClaims.filter(c => {
    if (claimCategoryFilter === 'all') return true;
    return c.rewardCategory === claimCategoryFilter;
  });

  // Calculate category totals and latest redemptions from completed rewards
  const tripClaims = completedClaims.filter(c => c.rewardCategory === 'trip');
  const gadgetClaims = completedClaims.filter(c => c.rewardCategory === 'gadget');
  const cashClaims = completedClaims.filter(c => c.rewardCategory === 'cash');

  const latestTrip = tripClaims[0] || null;
  const latestGadget = gadgetClaims[0] || null;
  const latestCash = cashClaims[0] || null;

  const totalTripPoints = tripClaims.reduce((sum, c) => sum + c.requiredAmount, 0);
  const totalGadgetPoints = gadgetClaims.reduce((sum, c) => sum + c.requiredAmount, 0);
  const totalCashPoints = cashClaims.reduce((sum, c) => sum + c.requiredAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Active In-Progress Redemptions Alert Banner */}
      {pendingClaims.length > 0 && (
        <div className="bg-[#D5AE62]/10 border border-[#D5AE62]/40 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D5AE62]/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#123C32]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#123C32] block">
                {pendingClaims.length} Selected Redemption Request(s) Under Verification
              </span>
              <span className="text-[11px] text-[#78847D]">
                "{pendingClaims[0].rewardTitle}" was selected in Claim Rewards. Once verified and received, it will show here as Completed.
              </span>
            </div>
          </div>
          <button
            onClick={() => setManagerSubView('claim')}
            className="text-xs font-bold text-[#123C32] bg-white border border-[#E2E9E3] px-3.5 py-1.5 rounded-xl shadow-2xs hover:bg-[#F7F5EF] transition-all shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Track in Claim Rewards →
          </button>
        </div>
      )}

      {/* REDESIGNED BOX THEME: 2 Cards Per Row on Phone, 4-Column Grid on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Box 1: Available Balance */}
        <div className="purity-card p-3 sm:p-4 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-2 border-[#D5AE62] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#78847D] mb-1.5 sm:mb-2 min-h-[28px] sm:min-h-[32px]">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#123C32]">Available Balance</span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#D5AE62]/20 flex items-center justify-center text-[#123C32] shrink-0">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#123C32]" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#123C32] tracking-tight">
              ₹{currentManager.walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#1B6B50] font-semibold mt-1 flex items-center gap-1 line-clamp-1">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#21865A] shrink-0" /> Ready to redeem
            </p>
          </div>
          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E2E9E3]/80 flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#78847D] font-mono hidden xs:inline">Active</span>
            <button 
              onClick={() => setManagerSubView('claim')}
              className="font-bold text-[#1B6B50] hover:text-[#123C32] transition-colors ml-auto xs:ml-0"
            >
              + Redeem →
            </button>
          </div>
        </div>

        {/* Box 2: International Trip Collected */}
        <div className="purity-card p-3 sm:p-4 bg-[#FFFFFF] border border-[#E2E9E3] hover:border-[#123C32]/40 transition-all shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#78847D] mb-1.5 sm:mb-2 min-h-[28px] sm:min-h-[32px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#123C32]/10 text-[#123C32] truncate max-w-[105px] sm:max-w-none">
                <Plane className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1B6B50] shrink-0" /> Trips
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#123C32]/10 flex items-center justify-center text-[#123C32] shrink-0">
                <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B6B50]" />
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-[#123C32] tracking-tight mt-1">
              {totalTripPoints.toLocaleString('en-IN')} <span className="text-[10px] sm:text-xs font-semibold text-[#78847D]">Pts</span>
            </div>

            <div className="mt-1 text-[10px] sm:text-xs font-bold text-[#202B27] line-clamp-1">
              {latestTrip ? latestTrip.rewardTitle : 'No Trips yet'}
            </div>
          </div>

          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E2E9E3] flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#78847D] flex items-center gap-1 truncate max-w-[85px] sm:max-w-none">
              <Calendar className="w-3 h-3 text-[#1B6B50] shrink-0" />
              {latestTrip ? latestTrip.claimedDate : 'No claim'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#21865A]/10 text-[#21865A] shrink-0">
              Done
            </span>
          </div>
        </div>

        {/* Box 3: Gadgets Collected */}
        <div className="purity-card p-3 sm:p-4 bg-[#FFFFFF] border border-[#E2E9E3] hover:border-[#D5AE62]/60 transition-all shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#78847D] mb-1.5 sm:mb-2 min-h-[28px] sm:min-h-[32px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#D5AE62]/20 text-[#123C32] truncate max-w-[105px] sm:max-w-none">
                <Smartphone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D5AE62] shrink-0" /> Gadgets
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#D5AE62]/20 flex items-center justify-center text-[#123C32] shrink-0">
                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#123C32]" />
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-[#123C32] tracking-tight mt-1">
              {totalGadgetPoints.toLocaleString('en-IN')} <span className="text-[10px] sm:text-xs font-semibold text-[#78847D]">Pts</span>
            </div>

            <div className="mt-1 text-[10px] sm:text-xs font-bold text-[#202B27] line-clamp-1">
              {latestGadget ? latestGadget.rewardTitle : 'No Gadgets yet'}
            </div>
          </div>

          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E2E9E3] flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#78847D] flex items-center gap-1 truncate max-w-[85px] sm:max-w-none">
              <Calendar className="w-3 h-3 text-[#D5AE62] shrink-0" />
              {latestGadget ? latestGadget.claimedDate : 'No claim'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#21865A]/10 text-[#21865A] shrink-0">
              Done
            </span>
          </div>
        </div>

        {/* Box 4: Direct Cash Amount Collected */}
        <div className="purity-card p-3 sm:p-4 bg-[#FFFFFF] border border-[#E2E9E3] hover:border-[#21865A]/40 transition-all shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#78847D] mb-1.5 sm:mb-2 min-h-[28px] sm:min-h-[32px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#21865A]/10 text-[#21865A] truncate max-w-[105px] sm:max-w-none">
                <Banknote className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#21865A] shrink-0" /> Cash
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#21865A]/10 flex items-center justify-center text-[#21865A] shrink-0">
                <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#21865A]" />
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-[#21865A] tracking-tight mt-1">
              ₹{totalCashPoints.toLocaleString('en-IN')} <span className="text-[10px] sm:text-xs font-semibold text-[#78847D]">Pts</span>
            </div>

            <div className="mt-1 text-[10px] sm:text-xs font-bold text-[#202B27] line-clamp-1">
              {latestCash ? latestCash.rewardTitle : 'No Cash yet'}
            </div>
          </div>

          <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E2E9E3] flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#78847D] flex items-center gap-1 truncate max-w-[85px] sm:max-w-none">
              <Calendar className="w-3 h-3 text-[#21865A] shrink-0" />
              {latestCash ? latestCash.claimedDate : 'No claim'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#21865A]/10 text-[#21865A] shrink-0">
              Paid
            </span>
          </div>
        </div>

      </div>

      {/* DEDICATED REDEEMED REWARDS & CLAIMS TABLE */}
      <div className="purity-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E9E3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7F5EF]/60">
          <div>
            <h2 className="text-base font-bold text-[#123C32] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D5AE62]" /> Collected Rewards & Completed Redemptions
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#FFFFFF] p-1 rounded-xl border border-[#E2E9E3] text-xs self-start sm:self-auto">
            <button
              onClick={() => setClaimCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                claimCategoryFilter === 'all' 
                  ? 'bg-[#123C32] text-white shadow-xs' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              All ({displayClaims.length})
            </button>
            <button
              onClick={() => setClaimCategoryFilter('trip')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                claimCategoryFilter === 'trip' 
                  ? 'bg-[#123C32] text-white shadow-xs' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              Trips ({tripClaims.length})
            </button>
            <button
              onClick={() => setClaimCategoryFilter('gadget')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                claimCategoryFilter === 'gadget' 
                  ? 'bg-[#123C32] text-white shadow-xs' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              Gadgets ({gadgetClaims.length})
            </button>
            <button
              onClick={() => setClaimCategoryFilter('cash')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                claimCategoryFilter === 'cash' 
                  ? 'bg-[#123C32] text-white shadow-xs' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              Cash Amount ({cashClaims.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3.5 px-4">Reward Collected</th>
                <th className="py-3.5 px-4">Reward Type</th>
                <th className="py-3.5 px-4 text-right">Points Used at Redeem Time</th>
                <th className="py-3.5 px-4">Date of Redeem</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filteredDisplayClaims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#78847D]">
                    No redemptions found for this category.
                  </td>
                </tr>
              ) : (
                filteredDisplayClaims.map(claim => {
                  const isTrip = claim.rewardCategory === 'trip';
                  const isGadget = claim.rewardCategory === 'gadget';
                  const isCash = claim.rewardCategory === 'cash';

                  return (
                    <tr key={claim.id} className="hover:bg-[#F7F5EF]/80 transition-colors">
                      {/* Reward Collected */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isTrip ? 'bg-[#123C32]/10 text-[#123C32]' :
                            isGadget ? 'bg-[#D5AE62]/20 text-[#123C32]' :
                            'bg-[#21865A]/15 text-[#21865A]'
                          }`}>
                            {isTrip && <Plane className="w-4 h-4 text-[#1B6B50]" />}
                            {isGadget && <Smartphone className="w-4 h-4 text-[#123C32]" />}
                            {isCash && <Banknote className="w-4 h-4 text-[#21865A]" />}
                          </div>
                          <div>
                            <span className="font-bold text-[#123C32] block text-[13px]">{claim.rewardTitle}</span>
                            <span className="text-[11px] text-[#78847D]">{claim.notes || 'Redemption successfully fulfilled'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Reward Type / Category */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                          isTrip ? 'bg-[#123C32]/10 text-[#123C32]' :
                          isGadget ? 'bg-[#D5AE62]/20 text-[#123C32]' :
                          'bg-[#21865A]/15 text-[#21865A]'
                        }`}>
                          {isTrip && 'International Trip'}
                          {isGadget && 'Gadget & Tech'}
                          {isCash && 'Cash / Amount'}
                        </span>
                      </td>

                      {/* Points Used at Redeem Time */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-sm text-[#123C32] block">
                          {claim.requiredAmount.toLocaleString('en-IN')} Pts
                        </span>
                        <span className="text-[10px] text-[#78847D]">
                          ₹{claim.requiredAmount.toLocaleString('en-IN')} Value
                        </span>
                      </td>

                      {/* Date of Redeem */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-[#202B27]">
                          <Calendar className="w-3.5 h-3.5 text-[#78847D]" />
                          <span>{claim.claimedDate}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {claim.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-1 rounded-full bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30">
                            <CheckCircle2 className="w-3 h-3 text-[#21865A]" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-1 rounded-full bg-[#D5AE62]/20 text-[#123C32] border border-[#D5AE62]/40">
                            <Clock className="w-3 h-3 text-[#D5AE62]" /> Processing
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
