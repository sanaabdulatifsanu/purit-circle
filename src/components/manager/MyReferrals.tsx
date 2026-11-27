import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const MyReferrals: React.FC = () => {
  const { currentManager, allManagers, restaurants, directReferralBonus, directReferralThreshold } = useApp();
  const [copied, setCopied] = useState(false);

  const formattedBonus = `₹${directReferralBonus.toLocaleString('en-IN')}`;
  const formattedThreshold = `₹${directReferralThreshold.toLocaleString('en-IN')}`;

  // Managers referred directly by current manager
  const myReferredManagers = allManagers.filter(
    m => m.referredByCode === currentManager.referralCode
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(currentManager.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Unique Referral Code Card (PRD Section 4 & Section 11) */}
      <div className="bg-gradient-to-br from-[#123C32] to-[#1B6B50] text-white rounded-2xl p-4 sm:p-6 shadow-elevated border border-[#1B6B50] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D5AE62]/20 to-transparent pointer-events-none" />

        {/* Mobile Compact View */}
        <div className="relative z-10 flex flex-col gap-3 sm:hidden">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">
              Refer &amp; Earn ₹2,000
            </h2>
            <p className="text-xs text-[#E2E9E3]/90 leading-snug line-clamp-2">
              Share your code with new managers to earn ₹2,000 on their first qualifying order.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 bg-[#123C32]/70 border border-[#D5AE62]/40 rounded-full pl-4 pr-1.5 py-1.5">
            <span className="font-mono text-base font-black text-[#D5AE62] tracking-widest">
              {currentManager.referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-[#D5AE62] text-[#123C32] hover:bg-[#c79e50] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#123C32]" /> : <Copy className="w-3.5 h-3.5 text-[#123C32]" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Desktop / Tablet View */}
        <div className="relative z-10 hidden sm:flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 bg-[#D5AE62] text-[#123C32] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Direct Incentive Rule
            </div>
            <h2 className="text-xl font-bold text-white">
              Your Exclusive Referral Code
            </h2>
            <p className="text-xs text-[#E2E9E3]/90 leading-relaxed">
              Every new manager is required to register with a valid referral code. Share your code to onboard colleagues and earn a one-time {formattedBonus} bonus on their first qualifying restaurant order.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex flex-col items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#D5AE62] font-bold">
              Unique Code
            </span>
            <div className="font-mono text-3xl font-black text-[#D5AE62] tracking-widest px-4 py-1 bg-[#123C32]/70 rounded-xl border border-[#D5AE62]/40">
              {currentManager.referralCode}
            </div>

            <button
              onClick={handleCopy}
              className="mt-1 flex items-center gap-1.5 bg-[#D5AE62] text-[#123C32] hover:bg-[#c79e50] px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-[#123C32]" /> : <Copy className="w-4 h-4 text-[#123C32]" />}
              <span>{copied ? 'Code Copied!' : 'Copy Referral Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* My Referred Managers List Table */}
      <div className="purity-card overflow-hidden">
        <div className="p-4 border-b border-[#E2E9E3] flex items-center justify-between bg-[#F7F5EF]/50">
          <div>
            <h3 className="text-sm font-bold text-[#123C32]">Referred Managers List</h3>
            <p className="text-xs text-[#78847D]">Managers registered using your referral code {currentManager.referralCode}</p>
          </div>
          <span className="text-xs font-semibold text-[#1B6B50]">{myReferredManagers.length} Active Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Manager Name</th>
                <th className="py-3 px-4">Referral Code</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Referred Restaurants</th>
                <th className="py-3 px-4">Total Sales</th>
                <th className="py-3 px-4 text-center">{formattedBonus} Referral Bonus Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {myReferredManagers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#78847D]">
                    No managers registered under your code yet. Share your code to start earning referral bonuses.
                  </td>
                </tr>
              ) : (
                myReferredManagers.map(mgr => {
                  const hasQualifying = mgr.totalSalesGenerated >= directReferralThreshold;
                  return (
                    <tr key={mgr.id} className="hover:bg-[#F7F5EF] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#123C32]">{mgr.name}</div>
                        <div className="text-[10px] text-[#78847D]">{mgr.mobile}</div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#1B6B50]">
                        {mgr.referralCode}
                      </td>

                      <td className="py-3 px-4 text-[#78847D]">
                        {mgr.registeredDate}
                      </td>

                      <td className="py-3 px-4 font-medium text-[#202B27]">
                        {mgr.referredRestaurantsCount} outlets
                      </td>

                      <td className="py-3 px-4 font-bold text-[#123C32]">
                        ₹{mgr.totalSalesGenerated.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {hasQualifying ? (
                          <span className="inline-flex items-center gap-1 bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {formattedBonus} Credited
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#D99A32]/10 text-[#D99A32] border border-[#D99A32]/30 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                            <Clock className="w-3.5 h-3.5" /> Awaiting Qualifying Order
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
