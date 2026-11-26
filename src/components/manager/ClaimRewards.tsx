import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Sparkles, 
  Plane, 
  Smartphone, 
  Banknote,
  Check, 
  AlertCircle, 
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { RewardItem } from '../../types';

type AllowedCategory = 'trip' | 'gadget' | 'cash';

export const ClaimRewards: React.FC = () => {
  const { currentManager, rewardItems, submitRewardClaim } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<AllowedCategory>('trip');
  const [mobileStep, setMobileStep] = useState<'categories' | 'items'>('categories');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [claimNotes, setClaimNotes] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const optionsSectionRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (catId: AllowedCategory) => {
    setSelectedCategory(catId);
    setMobileStep('items');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (optionsSectionRef.current) {
      optionsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter rewards strictly to the 3 allowed categories (no gifts/gold)
  const categoryRewards = rewardItems.filter(item => item.category === selectedCategory);

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

  // Category metadata
  const categories: {
    id: AllowedCategory;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    count: number;
  }[] = [
    {
      id: 'trip',
      title: 'International Trip',
      subtitle: 'Luxury vacations, flights & 5-star packages',
      icon: <Plane className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: '#1B6B50',
      count: rewardItems.filter(r => r.category === 'trip').length,
    },
    {
      id: 'gadget',
      title: 'Gadgets',
      subtitle: 'Apple iPhones, iPads & premium electronics',
      icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: '#D5AE62',
      count: rewardItems.filter(r => r.category === 'gadget').length,
    },
    {
      id: 'cash',
      title: 'Cash Redeem',
      subtitle: 'Direct NEFT / IMPS bank account transfers',
      icon: <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: '#21865A',
      count: rewardItems.filter(r => r.category === 'cash').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 3 ONLY OPTIONS SELECTOR CARDS (International Trip, Gadgets, Cash Redeem) */}
      <div className={mobileStep === 'items' ? 'hidden md:block' : 'block'}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 px-0.5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78847D]">
            Select Redemption Category
          </div>
          <div className="text-xs font-semibold text-[#123C32] bg-white border border-[#E2E9E3] px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#1B6B50]" />
            <span className="text-[#78847D]">Available Balance:</span>
            <span className="font-mono font-bold text-[#123C32]">₹{currentManager.walletBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#123C32] text-white border-2 border-[#D5AE62] shadow-elevated ring-2 ring-[#123C32]/30 scale-[1.01]'
                    : 'bg-[#FFFFFF] text-[#202B27] border border-[#E2E9E3] hover:border-[#123C32]/40 hover:bg-[#F7F5EF]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/15 text-[#D5AE62]' : 'bg-[#123C32]/10 text-[#123C32]'
                  }`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#D5AE62] text-[#123C32]' : 'bg-[#E2E9E3] text-[#78847D]'
                  }`}>
                    {cat.count} Available
                  </span>
                </div>

                <div>
                  <h3 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-[#123C32]'}`}>
                    {cat.title}
                  </h3>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-[#F7F5EF]/80' : 'text-[#78847D]'}`}>
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? 'text-[#D5AE62]' : 'text-[#1B6B50]'}>
                    {isSelected ? 'View Selected Options' : 'Choose Option'}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-[#D5AE62]' : 'text-[#78847D]'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* REWARD ITEMS (CLEAN BOXES - NO REFERENCE PICTURES) */}
      <div 
        ref={optionsSectionRef}
        className={mobileStep === 'categories' ? 'hidden md:block' : 'block'}
      >
        {/* Mobile Navigation Header when viewing options */}
        <div className="md:hidden space-y-3 mb-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileStep('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123C32] bg-white border border-[#E2E9E3] px-3 py-2 rounded-xl shadow-2xs hover:bg-[#F7F5EF] active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#1B6B50]" />
              <span>Back to Categories</span>
            </button>

            <div className="text-xs font-semibold text-[#123C32] bg-white border border-[#E2E9E3] px-2.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-[#1B6B50]" />
              <span className="font-mono font-bold text-[#123C32]">₹{currentManager.walletBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Quick Category Switcher Tabs on mobile */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#E2E9E3]/60 rounded-xl">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#123C32] text-white shadow-2xs'
                      : 'text-[#202B27] hover:bg-white/60 bg-transparent'
                  }`}
                >
                  <span className="text-xs">
                    {cat.id === 'trip' ? '✈️' : cat.id === 'gadget' ? '📱' : '💵'}
                  </span>
                  <span className="truncate">
                    {cat.id === 'trip' ? 'Trips' : cat.id === 'gadget' ? 'Gadgets' : 'Cash'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#78847D]">
            Available {categories.find(c => c.id === selectedCategory)?.title} Options ({categoryRewards.length})
          </div>
          <span className="text-xs text-[#1B6B50] font-semibold hidden sm:inline">
            Redeem directly with verified points
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryRewards.map(item => {
            const isAffordable = currentManager.walletBalance >= item.requiredBalance;
            const isTrip = item.category === 'trip';
            const isGadget = item.category === 'gadget';
            const isCash = item.category === 'cash';

            return (
              <div 
                key={item.id}
                className="purity-card p-5 flex flex-col justify-between hover:border-[#123C32] transition-all bg-[#FFFFFF] shadow-xs hover:shadow-subtle"
              >
                <div>
                  {/* Top Header Row with Category & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isTrip ? 'bg-[#123C32]/10 text-[#123C32]' :
                      isGadget ? 'bg-[#D5AE62]/20 text-[#123C32]' :
                      'bg-[#21865A]/15 text-[#21865A]'
                    }`}>
                      {isTrip && <Plane className="w-3 h-3 text-[#1B6B50]" />}
                      {isGadget && <Smartphone className="w-3 h-3 text-[#D5AE62]" />}
                      {isCash && <Banknote className="w-3 h-3 text-[#21865A]" />}
                      {isTrip ? 'International Trip' : isGadget ? 'Gadget' : 'Cash Payout'}
                    </span>

                    {item.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#78847D] border border-[#E2E9E3]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Required Amount Display */}
                  <div className="mb-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#123C32] tracking-tight block">
                      ₹{item.requiredBalance.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-semibold text-[#78847D]">
                      Points Required for Redemption
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#123C32] leading-snug mt-2 mb-1.5">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#78847D] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Key Highlights / Terms List */}
                  <div className="bg-[#F7F5EF]/70 rounded-xl p-3 border border-[#E2E9E3] mb-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#123C32] block mb-1">
                      Key Highlights & Inclusions:
                    </span>
                    {item.terms.map((term, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-[#202B27]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#21865A] shrink-0 mt-0.5" />
                        <span className="leading-tight">{term}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redeem Action Button */}
                <div className="pt-2">
                  <button
                    disabled={!isAffordable}
                    onClick={() => setSelectedReward(item)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isAffordable 
                        ? 'bg-[#123C32] text-white hover:bg-[#1B6B50] shadow-sm cursor-pointer active:scale-[0.98]' 
                        : 'bg-[#E2E9E3] text-[#78847D] cursor-not-allowed opacity-80'
                    }`}
                  >
                    {isAffordable ? (
                      <>
                        <Sparkles className="w-4 h-4 text-[#D5AE62]" /> Redeem {isTrip ? 'Trip' : isGadget ? 'Gadget' : 'Cash'} Now →
                      </>
                    ) : (
                      <span>Requires ₹{(item.requiredBalance - currentManager.walletBalance).toLocaleString('en-IN')} more points</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONFIRMATION REDEMPTION MODAL (NO PICTURES) */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-lg w-full p-6 shadow-elevated relative max-h-[92vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedReward(null)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pb-3 border-b border-[#E2E9E3]">
              <h2 className="text-base font-bold text-[#123C32] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D5AE62]" /> Confirm Reward Claim
              </h2>
              <p className="text-xs text-[#78847D] mt-0.5">
                Redeem your available wallet points for this {selectedReward.category === 'trip' ? 'international trip package' : selectedReward.category === 'gadget' ? 'gadget' : 'cash payout'}.
              </p>
            </div>

            {feedback && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${feedback.type === 'success' ? 'bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30' : 'bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/30'}`}>
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="p-3.5 bg-[#F7F5EF] rounded-xl border border-[#E2E9E3] mb-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#78847D]">Reward Option:</span>
                <span className="font-bold text-[#123C32] text-right">{selectedReward.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#78847D]">Points Deducted:</span>
                <span className="font-bold text-[#D5AE62] text-sm">₹{selectedReward.requiredBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#78847D]">Current Available Balance:</span>
                <span className="font-bold text-[#123C32]">₹{currentManager.walletBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E2E9E3]">
                <span className="text-[#78847D]">Wallet Balance After Redeem:</span>
                <span className="font-bold text-[#21865A] text-sm">
                  ₹{(currentManager.walletBalance - selectedReward.requiredBalance).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1">
                  {selectedReward.category === 'trip' 
                    ? 'Passport Details & Preferred Travel Dates / City:' 
                    : selectedReward.category === 'gadget'
                    ? 'Doorstep Shipping Address & PIN Code:'
                    : 'Bank Account Number & IFSC Confirmation:'}
                </label>
                <textarea 
                  rows={3}
                  required
                  placeholder={
                    selectedReward.category === 'trip' 
                      ? 'e.g. Passport No: X1234567, preferred travel in December 2026, departure from Kochi or Bengaluru...'
                      : selectedReward.category === 'gadget'
                      ? 'e.g. Plot No 14, 2nd Cross, MG Road, Kochi, Kerala - 682001'
                      : 'e.g. HDFC Bank, A/C: 501002941029, IFSC: HDFC0001234, Name: Rajesh Kumar'
                  }
                  value={claimNotes}
                  onChange={e => setClaimNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none bg-white"
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
