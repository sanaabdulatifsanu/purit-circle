import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Users, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const AdminReferralRewards: React.FC = () => {
  const { allManagers } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D5AE62]" /> ₹2,000 Direct Referral Rewards Ledger
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Governing the one-time ₹2,000 direct manager referral incentives and qualifying sales conditions (PRD Section 11).
          </p>
        </div>

        <div className="bg-[#D5AE62]/20 border border-[#D5AE62]/40 text-[#123C32] px-3.5 py-1.5 rounded-xl text-xs font-bold">
          Configured Rule: ₹2,000 / Qualifying Event
        </div>
      </div>

      {/* Referral Incentive Matrix (PRD Section 6 & 11) */}
      <div className="purity-card p-5 border-l-4 border-l-[#D5AE62]">
        <h3 className="text-sm font-bold text-[#123C32] mb-1">
          Direct Attribution Governance Rules
        </h3>
        <p className="text-xs text-[#78847D] leading-relaxed">
          • When Manager A refers Manager B, and Manager B's referred restaurant generates qualifying sales (&gt; ₹25,000), Manager A receives ₹2,000 once.<br />
          • Higher-level managers (uplines) <strong className="text-[#123C32]">do not</strong> receive additional referral bonuses.<br />
          • Manager A <strong className="text-[#123C32]">does not</strong> earn recurring sales commission from Manager B's restaurants (Strict Non-MLM boundary).
        </p>
      </div>

      {/* Tracker Table */}
      <div className="purity-card overflow-hidden">
        <div className="p-4 border-b border-[#E2E9E3] flex items-center justify-between bg-[#F7F5EF]/50">
          <div>
            <h3 className="text-sm font-bold text-[#123C32]">Direct Manager Referral Relationships</h3>
            <p className="text-xs text-[#78847D]">Audit of qualifying restaurant sales and ₹2,000 credit logs</p>
          </div>
          <span className="text-xs font-semibold text-[#1B6B50]">{allManagers.length} Total Nodes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Manager (Downline)</th>
                <th className="py-3 px-4">Referring Manager (Upline)</th>
                <th className="py-3 px-4">Referred Restaurants</th>
                <th className="py-3 px-4 text-right">Qualifying Sales Total</th>
                <th className="py-3 px-4 text-center">₹2,000 Event Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {allManagers.filter(m => m.referredByCode).map(mgr => {
                const isCredited = mgr.totalSalesGenerated >= 25000;
                return (
                  <tr key={mgr.id} className="hover:bg-[#F7F5EF] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#123C32] block">{mgr.name}</span>
                      <span className="font-mono text-[10px] text-[#78847D]">Code: {mgr.referralCode}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#202B27] block">{mgr.referredByName}</span>
                      <span className="font-mono text-[10px] text-[#1B6B50]">Code: {mgr.referredByCode}</span>
                    </td>

                    <td className="py-3 px-4 text-[#202B27] font-medium">
                      {mgr.referredRestaurantsCount} outlets
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-[#123C32]">
                      ₹{mgr.totalSalesGenerated.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isCredited ? (
                        <span className="inline-flex items-center gap-1 bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ₹2,000 Credited to {mgr.referredByName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-[#D99A32]/10 text-[#D99A32] border border-[#D99A32]/30 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                          <Clock className="w-3.5 h-3.5" /> In Progress (&lt; ₹25,000 threshold)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
