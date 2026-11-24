import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, ShieldCheck, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminWalletManagement: React.FC = () => {
  const { walletTransactions } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#1B6B50]" /> Rewards Wallet System-Wide Ledger
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Global double-entry transaction oversight ensuring no manager balances are modified without an immutable record (PRD Section 13).
          </p>
        </div>

        <div className="text-xs text-[#78847D] bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-3.5 py-1.5 rounded-xl font-medium">
          Double-Entry Integrity: Verified
        </div>
      </div>

      {/* Global Ledger Table */}
      <div className="purity-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Ledger ID & Date</th>
                <th className="py-3 px-4">Entry Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Audit Description</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4 text-right">Ledger Post Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {walletTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#123C32] block">{tx.id}</span>
                    <span className="text-[10px] text-[#78847D]">{tx.date}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full ${
                      tx.type === 'CREDIT' ? 'bg-[#21865A]/10 text-[#21865A]' :
                      tx.type === 'DEBIT' ? 'bg-[#D9534F]/10 text-[#D9534F]' :
                      'bg-[#D99A32]/10 text-[#D99A32]'
                    }`}>
                      {tx.type}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-[#202B27]">
                    {tx.category}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-[#202B27] block">{tx.description}</span>
                    <span className="text-[10px] font-mono text-[#78847D]">Ref: {tx.referenceId}</span>
                  </td>

                  <td className={`py-3 px-4 text-right font-bold text-xs ${
                    tx.type === 'CREDIT' ? 'text-[#21865A]' : 'text-[#D9534F]'
                  }`}>
                    {tx.type === 'CREDIT' ? `+₹${tx.amount.toLocaleString('en-IN')}` : `-₹${tx.amount.toLocaleString('en-IN')}`}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-[#123C32]">
                    ₹{tx.balanceAfter.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <Badge status={tx.status} size="sm" />
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
