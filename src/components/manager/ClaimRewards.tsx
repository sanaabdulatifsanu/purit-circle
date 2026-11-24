import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gift, 
  Wallet, 
  Sparkles, 
  Plane, 
  Smartphone, 
  Check, 
  AlertCircle, 
  X,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { RewardCategory, RewardItem } from '../../types';
import { Badge } from '../common/Badge';

export const ClaimRewards: React.FC = () => {
  const { currentManager, rewardItems, rewardClaims, submitRewardClaim } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | RewardCategory>('all');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [claimNotes, setClaimNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredItems = rewardItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward) return;

    setFeedback(null);
    const res = submitRewardClaim(selectedReward.id, claimNotes);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setSelectedReward(null);
        setFeedback(null);
        setClaimNotes('');
      }, 2000);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const myClaims = rewardClaims.filter(c => c.managerId === currentManager.id);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D5AE62]/20 border border-[#D5AE62]/40 text-[#123C32] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D5AE62]" /> Purity Circle Club
          </div>
          <h1 className="text-xl font-bold text-[#123C32]">
            Reward Catalogue & Redemption
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Redeem your earned wallet balance for direct bank transfers, international luxury vacations, gadgets, or gold.
          </p>
        </div>

        {/* Current Available Balance Ticker */}
        <div className="purity-card p-4 border-2 border-[#D5AE62] bg-[#F7F5EF] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D5AE62] flex items-center justify-center text-[#123C32] font-bold">
            <Wallet className="w-5 h-5 text-[#123C32]" />
          </div>
          <div>
            <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider block">Available Balance</span>
            <span className="text-xl font-extrabold text-[#123C32]">
              ₹{currentManager.walletBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs (PRD Section 14) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Rewards' },
          { id: 'cash', label: 'Cash Payouts' },
          { id: 'trip', label: 'International Trips' },
          { id: 'gadget', label: 'Gadgets & Tech' },
          { id: 'gift', label: 'Special Gifts & Gold' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id 
                ? 'bg-[#123C32] text-white shadow-sm' 
                : 'bg-white border border-[#E2E9E3] text-[#78847D] hover:text-[#123C32] hover:border-[#123C32]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Reward Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredItems.map(item => {
          const isAffordable = currentManager.walletBalance >= item.requiredBalance;
          return (
            <div 
              key={item.id} 
              className="purity-card overflow-hidden flex flex-col justify-between hover:border-[#123C32] transition-all group hover:shadow-card"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-44 bg-[#F7F5EF] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-[#123C32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#123C32] border border-[#E2E9E3] text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                    ₹{item.requiredBalance.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#1B6B50] mb-1">
                    {item.category.toUpperCase()}
                  </div>
                  <h3 className="text-sm font-bold text-[#123C32] group-hover:text-[#1B6B50] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#78847D] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  disabled={!isAffordable}
                  onClick={() => setSelectedReward(item)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isAffordable 
                      ? 'bg-[#123C32] text-white hover:bg-[#1B6B50] shadow-sm cursor-pointer' 
                      : 'bg-[#E2E9E3] text-[#78847D] cursor-not-allowed opacity-75'
                  }`}
                >
                  {isAffordable ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#D5AE62]" /> Redeem Now
                    </>
                  ) : (
                    `Requires ₹${(item.requiredBalance - currentManager.walletBalance).toLocaleString('en-IN')} more`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Past Redemption Requests Table */}
      <div className="purity-card overflow-hidden mt-8">
        <div className="p-4 border-b border-[#E2E9E3] flex items-center justify-between bg-[#F7F5EF]/50">
          <div>
            <h3 className="text-sm font-bold text-[#123C32]">My Past Claim Requests</h3>
            <p className="text-xs text-[#78847D]">Audit trail of submitted redemptions and disbursement status</p>
          </div>
          <span className="text-xs text-[#78847D] font-medium">{myClaims.length} Claims submitted</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Claim ID & Date</th>
                <th className="py-3 px-4">Reward Item</th>
                <th className="py-3 px-4">Points / Amount</th>
                <th className="py-3 px-4">Disbursement Ref</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {myClaims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#78847D]">
                    No reward claims submitted yet.
                  </td>
                </tr>
              ) : (
                myClaims.map(claim => (
                  <tr key={claim.id} className="hover:bg-[#F7F5EF] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#123C32]">{claim.id}</span>
                      <span className="text-[10px] text-[#78847D] block">{claim.claimedDate}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#202B27]">{claim.rewardTitle}</td>
                    <td className="py-3 px-4 font-bold text-[#123C32]">₹{claim.requiredAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#78847D]">
                      {claim.payoutReference || 'Pending verification'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge status={claim.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLAIM SUBMISSION MODAL */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-lg w-full p-6 shadow-elevated relative">
            <button 
              onClick={() => setSelectedReward(null)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pb-3 border-b border-[#E2E9E3]">
              <h2 className="text-base font-bold text-[#123C32] flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#D5AE62]" /> Confirm Reward Redemption
              </h2>
              <p className="text-xs text-[#78847D] mt-0.5">
                Redeem your available balance for this item.
              </p>
            </div>

            {feedback && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${feedback.type === 'success' ? 'bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30' : 'bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/30'}`}>
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="p-3 bg-[#F7F5EF] rounded-xl border border-[#E2E9E3] mb-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78847D]">Item:</span>
                <span className="font-bold text-[#123C32]">{selectedReward.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78847D]">Required Balance:</span>
                <span className="font-bold text-[#D5AE62]">₹{selectedReward.requiredBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78847D]">Your Current Balance:</span>
                <span className="font-bold text-[#123C32]">₹{currentManager.walletBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E2E9E3]">
                <span className="text-[#78847D]">Balance After Claim:</span>
                <span className="font-bold text-[#21865A]">
                  ₹{(currentManager.walletBalance - selectedReward.requiredBalance).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#78847D] mb-1.5">
                Terms & Conditions:
              </h4>
              <ul className="space-y-1 text-xs text-[#78847D]">
                {selectedReward.terms.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#1B6B50]">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1">
                  Delivery / Account / Travel Notes (Optional):
                </label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Preferred delivery address, bank account number confirmation, travel month..."
                  value={claimNotes}
                  onChange={e => setClaimNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E9E3]">
                <button 
                  type="button" 
                  onClick={() => setSelectedReward(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs"
                >
                  Confirm & Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
