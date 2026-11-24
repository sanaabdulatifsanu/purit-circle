import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, Download, CheckCircle2, Building, ArrowUpRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminPayouts: React.FC = () => {
  const { rewardClaims } = useApp();

  const completedPayouts = rewardClaims.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-[#1B6B50]" /> Payout & Disbursement Records
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Tracking completed banking NEFT/IMPS transfers, flight ticket issuances, and gadget dispatches (PRD Section 10 & 15).
          </p>
        </div>

        <button className="btn-secondary text-xs flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Export Bank Payout File (CSV)
        </button>
      </div>

      {/* Payouts Table */}
      <div className="purity-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Disbursement Ref</th>
                <th className="py-3 px-4">Manager Name</th>
                <th className="py-3 px-4">Redemption Item</th>
                <th className="py-3 px-4 text-right">Disbursed Amount</th>
                <th className="py-3 px-4">Settlement Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {completedPayouts.map(claim => (
                <tr key={claim.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#123C32]">
                    {claim.payoutReference || 'UTR-HDFC-99218401'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#202B27]">
                    {claim.managerName}
                  </td>
                  <td className="py-3 px-4 text-[#78847D]">
                    {claim.rewardTitle}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#21865A]">
                    ₹{claim.requiredAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#78847D]">
                    {claim.claimedDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge status="completed" size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
