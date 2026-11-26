import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  Sparkles, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const MyEarnings: React.FC = () => {
  const { currentManager, walletTransactions, directReferralBonus } = useApp();

  // Split earnings by source
  const salesRewardTotal = walletTransactions
    .filter(tx => tx.category === 'SALES_REWARD')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const referralBonusTotal = walletTransactions
    .filter(tx => tx.category === 'DIRECT_REFERRAL_BONUS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Coins className="w-6 h-6 text-[#D5AE62]" /> My Earnings Breakdown
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Transparent breakdown of Sales-Based Commissions and ₹{directReferralBonus.toLocaleString('en-IN')} Direct Referral Rewards.
          </p>
        </div>

        <div className="bg-[#D5AE62]/15 border border-[#D5AE62]/40 px-4 py-2 rounded-xl text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#123C32]">Total Rewards Accrued</span>
          <span className="text-xl font-extrabold text-[#123C32] block">
            ₹{currentManager.totalRewardsEarned.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Dual Revenue Stream Breakdown (PRD Section 11 & 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stream 1: Sales-Based Restaurant Rewards */}
        <div className="purity-card p-5 border-l-4 border-l-[#123C32]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E9E3]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#123C32]/10 flex items-center justify-center text-[#123C32]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#123C32]">Sales-Based Rewards</h3>
                <span className="text-[11px] text-[#78847D]">Calculated on verified restaurant orders</span>
              </div>
            </div>
            <span className="text-base font-bold text-[#123C32]">
              ₹{(salesRewardTotal + 115860).toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-[#78847D] mt-3 leading-relaxed">
            You earn continuous commissions from recurring product orders placed by your approved referred restaurants (Tissue Rolls, Hand Washes, Degreasers).
          </p>

          <div className="mt-4 p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E9E3] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#78847D]">Commission Model:</span>
              <span className="font-semibold text-[#123C32]">10% Standard Invoiced Sales</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78847D]">Eligible Outlets:</span>
              <span className="font-semibold text-[#123C32]">4 Approved Outlets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78847D]">Status:</span>
              <span className="text-[#21865A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-crediting
              </span>
            </div>
          </div>
        </div>

        {/* Stream 2: Direct Referral Rewards */}
        <div className="purity-card p-5 border-l-4 border-l-[#D5AE62]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E9E3]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D5AE62]/20 flex items-center justify-center text-[#123C32]">
                <Sparkles className="w-4 h-4 text-[#D5AE62]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#123C32]">₹{directReferralBonus.toLocaleString('en-IN')} Direct Referral Rewards</h3>
                <span className="text-[11px] text-[#78847D]">Manager referral incentive</span>
              </div>
            </div>
            <span className="text-base font-bold text-[#D5AE62]">
              ₹{(referralBonusTotal + directReferralBonus).toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-[#78847D] mt-3 leading-relaxed">
            One-time incentive paid when your directly referred manager achieves their first qualifying restaurant order. (Strictly 1st-level direct attribution).
          </p>

          <div className="mt-4 p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E9E3] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#78847D]">Direct Managers Referred:</span>
              <span className="font-semibold text-[#123C32]">2 Managers (Vikram & Priya)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78847D]">Qualifying Events Met:</span>
              <span className="font-semibold text-[#21865A]">1 Bonus Credited (Vikram Shah)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78847D]">Pending Qualifying Sales:</span>
              <span className="text-[#D99A32] font-semibold">1 Manager (Priya Sharma)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Earnings Ledger History */}
      <div className="purity-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E9E3] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#123C32]">Recent Earnings Credits</h3>
            <p className="text-xs text-[#78847D]">Immutable earnings ledger entries with reference IDs</p>
          </div>
          <span className="text-xs bg-[#21865A]/10 text-[#21865A] px-2.5 py-0.5 rounded-full font-medium">
            Audit-Verified
          </span>
        </div>

        <div className="space-y-3">
          {walletTransactions
            .filter(tx => tx.type === 'CREDIT')
            .map(tx => (
              <div 
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E2E9E3]"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${tx.category === 'DIRECT_REFERRAL_BONUS' ? 'bg-[#D5AE62] text-[#123C32]' : 'bg-[#123C32] text-white'}`}>
                    {tx.category === 'DIRECT_REFERRAL_BONUS' ? '₹2K' : '%'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#202B27]">{tx.description}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-[#78847D] mt-0.5">
                      <span>Ref: {tx.referenceId}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#21865A] block">
                    +₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#78847D]">
                    Balance after: ₹{tx.balanceAfter.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};
