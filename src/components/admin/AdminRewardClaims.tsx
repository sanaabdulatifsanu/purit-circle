import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gift, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  CreditCard, 
  X,
  FileCheck2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { RewardClaim } from '../../types';

export const AdminRewardClaims: React.FC = () => {
  const { rewardClaims, updateClaimStatus } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  
  // Action Modal State
  const [selectedClaim, setSelectedClaim] = useState<RewardClaim | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [payoutRef, setPayoutRef] = useState('');

  const filtered = rewardClaims.filter(c => {
    const matchesSearch = c.managerName.toLowerCase().includes(search.toLowerCase()) ||
                          c.rewardTitle.toLowerCase().includes(search.toLowerCase()) ||
                          c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim || !actionType) return;

    if (actionType === 'approve') {
      updateClaimStatus(selectedClaim.id, 'completed', actionNotes, payoutRef || `UTR-BANK-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      updateClaimStatus(selectedClaim.id, 'rejected', actionNotes);
    }

    setSelectedClaim(null);
    setActionType(null);
    setActionNotes('');
    setPayoutRef('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#1B6B50]" /> Reward Claims & Redemption Processing
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Review manager reward redemptions, release holds upon rejection, or disburse cash and travel rewards (PRD Section 14 & 15).
          </p>
        </div>

        <div className="text-xs text-[#78847D] bg-[#F7F5EF] px-3.5 py-1.5 rounded-xl border border-[#E2E9E3]">
          Pending Reviews: <span className="font-bold text-[#D99A32]">{rewardClaims.filter(c => c.status === 'pending').length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search claim by manager, item title, or Claim ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#78847D]" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-[#FFFFFF] border border-[#E2E9E3] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#123C32]"
          >
            <option value="all">All Claims ({rewardClaims.length})</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed Only</option>
            <option value="rejected">Rejected Only</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="purity-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Claim ID & Date</th>
                <th className="py-3 px-4">Manager Info</th>
                <th className="py-3 px-4">Item & Category</th>
                <th className="py-3 px-4 text-right">Required Balance</th>
                <th className="py-3 px-4">Disbursement Ref / Reason</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filtered.map(claim => (
                <tr key={claim.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#123C32] block">{claim.id}</span>
                    <span className="text-[10px] text-[#78847D]">{claim.claimedDate}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-[#202B27] block">{claim.managerName}</span>
                    <span className="text-[10px] text-[#78847D]">{claim.managerMobile}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#123C32] block">{claim.rewardTitle}</span>
                    <span className="text-[10px] uppercase font-bold text-[#1B6B50]">{claim.rewardCategory}</span>
                  </td>

                  <td className="py-3 px-4 text-right font-extrabold text-[#123C32]">
                    ₹{claim.requiredAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4">
                    {claim.payoutReference ? (
                      <span className="font-mono text-[11px] bg-[#21865A]/10 text-[#21865A] px-2 py-0.5 rounded font-medium">
                        {claim.payoutReference}
                      </span>
                    ) : claim.rejectionReason ? (
                      <span className="text-[11px] text-[#D9534F] italic block truncate max-w-xs" title={claim.rejectionReason}>
                        Rejected: {claim.rejectionReason}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#D99A32] italic">Pending approval</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <Badge status={claim.status} size="sm" />
                  </td>

                  <td className="py-3 px-4 text-center">
                    {claim.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedClaim(claim);
                            setActionType('approve');
                            setPayoutRef(`UTR-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`);
                          }}
                          className="btn-primary text-[11px] py-1 px-2"
                        >
                          Approve & Pay
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClaim(claim);
                            setActionType('reject');
                          }}
                          className="p-1 rounded border border-[#D9534F]/30 text-[#D9534F] hover:bg-[#D9534F]/10"
                          title="Reject and release reserved hold"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#78847D] italic">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL / REJECTION MODAL */}
      {selectedClaim && actionType && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-md w-full p-6 shadow-elevated relative">
            <button 
              onClick={() => {
                setSelectedClaim(null);
                setActionType(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className={`text-base font-bold mb-1 ${actionType === 'approve' ? 'text-[#123C32]' : 'text-[#D9534F]'}`}>
              {actionType === 'approve' ? 'Approve & Settle Reward Claim' : 'Decline Reward Claim'}
            </h3>
            <p className="text-xs text-[#78847D] mb-4">
              Claim ID: <span className="font-mono font-semibold text-[#123C32]">{selectedClaim.id}</span> • {selectedClaim.managerName}
            </p>

            <form onSubmit={handleActionSubmit} className="space-y-4 text-xs">
              
              {actionType === 'approve' && (
                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">
                    Bank Payout UTR / Shipment Tracking Reference *:
                  </label>
                  <input 
                    type="text"
                    required
                    value={payoutRef}
                    onChange={e => setPayoutRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#78847D] mt-1 block">
                    Manager will be notified with this disbursement tracking key.
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold text-[#202B27] block mb-1">
                  {actionType === 'approve' ? 'Approval / Dispatch Notes:' : 'Reason for Rejection * (Reserved balance will be released):'}
                </label>
                <textarea 
                  required={actionType === 'reject'}
                  rows={3}
                  placeholder={actionType === 'approve' ? 'e.g. Bank transfer initiated via corporate account.' : 'e.g. KYC document pending / bank account mismatch.'}
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E9E3]">
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedClaim(null);
                    setActionType(null);
                  }}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={actionType === 'approve' ? 'btn-primary text-xs' : 'bg-[#D9534F] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c94541]'}
                >
                  {actionType === 'approve' ? 'Confirm Payout' : 'Decline & Release Balance'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
