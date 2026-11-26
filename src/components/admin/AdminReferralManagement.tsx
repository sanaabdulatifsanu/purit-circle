import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Users, GitBranch, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminReferralManagement: React.FC = () => {
  const { allManagers, directReferralBonus } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#1B6B50]" /> Referral Management & Hierarchy
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Visualizing direct referral paths and ensuring compliance with single-tier bonus rules (PRD Section 6).
          </p>
        </div>

        <span className="text-xs bg-[#123C32]/10 text-[#123C32] font-semibold px-3 py-1.5 rounded-xl border border-[#123C32]/20">
          Strict Non-MLM Single Tier
        </span>
      </div>

      {/* Referral Hierarchy Tree Card */}
      <div className="purity-card p-6">
        <h3 className="text-sm font-bold text-[#123C32] mb-3 flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-[#1B6B50]" /> Live Referral Tree Mapping
        </h3>

        <div className="space-y-4">
          {/* Level 0: Root Initial Manager */}
          <div className="p-4 rounded-xl bg-[#123C32]/5 border-2 border-[#123C32]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#123C32] text-white flex items-center justify-center font-bold text-xs">
                  ROOT
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#123C32]">First Initial Manager (Node 1001)</h4>
                  <span className="text-[10px] text-[#78847D]">Initial Referral Key: 1001 • Founder Entry</span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold bg-[#D5AE62] text-[#123C32] px-2 py-0.5 rounded">
                Code: 1001
              </span>
            </div>

            {/* Direct Children of 1001 */}
            <div className="mt-4 pl-6 border-l-2 border-[#1B6B50]/40 space-y-3">
              <div className="p-3 bg-white rounded-xl border border-[#E2E9E3]">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#123C32]">Rajesh Kumar</h5>
                    <span className="text-[10px] text-[#78847D]">Registered using 1001 • Code: A1001</span>
                  </div>
                  <span className="text-xs font-bold text-[#21865A]">4 Referred Restaurants</span>
                </div>

                {/* Direct Children of A1001 */}
                <div className="mt-3 pl-6 border-l-2 border-[#D5AE62]/60 space-y-2">
                  <div className="p-2.5 bg-[#F7F5EF] rounded-lg border border-[#E2E9E3] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#202B27]">Vikram Shah (B1001)</span>
                      <span className="text-[10px] text-[#78847D] block">Referred by Rajesh Kumar (A1001)</span>
                    </div>
                    <span className="text-[11px] bg-[#21865A]/10 text-[#21865A] px-2 py-0.5 rounded font-semibold">
                      ₹{directReferralBonus.toLocaleString('en-IN')} Bonus Paid to A1001
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#F7F5EF] rounded-lg border border-[#E2E9E3] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#202B27]">Priya Sharma (P1002)</span>
                      <span className="text-[10px] text-[#78847D] block">Referred by Rajesh Kumar (A1001)</span>
                    </div>
                    <span className="text-[11px] bg-[#D99A32]/10 text-[#D99A32] px-2 py-0.5 rounded font-medium">
                      Awaiting Qualifying Order
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
