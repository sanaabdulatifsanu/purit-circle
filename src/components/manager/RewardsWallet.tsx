import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ShieldCheck, 
  Coins, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const RewardsWallet: React.FC = () => {
  const { currentManager, walletTransactions, setManagerSubView } = useApp();

  const totalCredits = walletTransactions
    .filter(tx => tx.type === 'CREDIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebits = walletTransactions
    .filter(tx => tx.type === 'DEBIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalHolds = walletTransactions
    .filter(tx => tx.type === 'HOLD')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#1B6B50]" /> Rewards Wallet
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Individual manager ledger tracking rewards earned, available balance, and redemption payouts.
          </p>
        </div>

        <button 
          onClick={() => setManagerSubView('claim')}
          className="btn-accent text-xs"
        >
          Redeem Rewards →
        </button>
      </div>

      {/* Wallet Balance Cards (PRD Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Available Balance */}
        <div className="purity-card p-5 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-2 border-[#D5AE62]">
          <div className="flex items-center justify-between text-[#78847D]">
            <span className="text-xs font-bold text-[#123C32]">Available Balance</span>
            <div className="w-7 h-7 rounded-lg bg-[#D5AE62] flex items-center justify-center text-[#123C32]">
              <Wallet className="w-4 h-4 text-[#123C32]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#123C32] mt-2">
            ₹{currentManager.walletBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#1B6B50] font-medium mt-1">
            Unrestricted & redeemable
          </div>
        </div>

        {/* Total Rewards Earned */}
        <div className="purity-card p-5">
          <div className="flex items-center justify-between text-[#78847D]">
            <span className="text-xs font-medium">Lifetime Earned</span>
            <div className="w-7 h-7 rounded-lg bg-[#123C32]/10 flex items-center justify-center text-[#123C32]">
              <Coins className="w-4 h-4 text-[#123C32]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#123C32] mt-2">
            ₹{currentManager.totalRewardsEarned.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            Sum of all earned credits
          </div>
        </div>

        {/* Redeemed Rewards */}
        <div className="purity-card p-5">
          <div className="flex items-center justify-between text-[#78847D]">
            <span className="text-xs font-medium">Redeemed Payouts</span>
            <div className="w-7 h-7 rounded-lg bg-[#21865A]/10 flex items-center justify-center text-[#21865A]">
              <ArrowDownLeft className="w-4 h-4 text-[#21865A]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#202B27] mt-2">
            ₹{(totalDebits + 25000).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#21865A] font-medium mt-1">
            Disbursed via bank transfer
          </div>
        </div>

        {/* Pending Rewards / Hold */}
        <div className="purity-card p-5">
          <div className="flex items-center justify-between text-[#78847D]">
            <span className="text-xs font-medium">Pending Claims / Hold</span>
            <div className="w-7 h-7 rounded-lg bg-[#D99A32]/10 flex items-center justify-center text-[#D99A32]">
              <Clock className="w-4 h-4 text-[#D99A32]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#D99A32] mt-2">
            ₹{totalHolds.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            Reserved during review
          </div>
        </div>

      </div>

      {/* Auditable Ledger Table (PRD Section 13: Never update balance without transaction record) */}
      <div className="purity-card overflow-hidden">
        <div className="p-4 border-b border-[#E2E9E3] flex items-center justify-between bg-[#F7F5EF]/50">
          <div>
            <h3 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1B6B50]" /> Complete Wallet Transaction Ledger
            </h3>
            <p className="text-xs text-[#78847D]">Double-entry transaction audit log</p>
          </div>
          <span className="text-xs font-mono text-[#78847D] bg-[#FFFFFF] px-2 py-1 rounded border border-[#E2E9E3]">
            Ledger ID: LDG-{currentManager.id}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Tx ID & Date</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4">Description & Ref</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Balance After</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {walletTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-[#123C32] block">{tx.id}</span>
                    <span className="text-[10px] text-[#78847D]">{tx.date}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full ${
                      tx.type === 'CREDIT' ? 'bg-[#21865A]/10 text-[#21865A]' :
                      tx.type === 'DEBIT' ? 'bg-[#D9534F]/10 text-[#D9534F]' :
                      'bg-[#D99A32]/10 text-[#D99A32]'
                    }`}>
                      {tx.type === 'CREDIT' && <ArrowUpRight className="w-3 h-3" />}
                      {tx.type === 'DEBIT' && <ArrowDownLeft className="w-3 h-3" />}
                      {tx.type === 'HOLD' && <Clock className="w-3 h-3" />}
                      {tx.type}
                    </span>
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
