import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, PlusCircle, Check, Percent, Layers, Calendar } from 'lucide-react';
import { RewardRuleConfig } from '../../types';

export const AdminRewardConfig: React.FC = () => {
  const { 
    rewardRules, 
    directReferralBonus, 
    directReferralThreshold, 
    updateDirectReferralSettings 
  } = useApp();
  const [rules, setRules] = useState<RewardRuleConfig[]>(rewardRules);
  const [isSaved, setIsSaved] = useState(false);

  // Edit current standard rate
  const [defaultPercentage, setDefaultPercentage] = useState(10.0);
  const [minQualifyingSales, setMinQualifyingSales] = useState(directReferralThreshold);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDirectReferralSettings(directReferralBonus, minQualifyingSales);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#1B6B50]" /> Sales-Based Reward Rules Engine
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Configure percentage-based reward rates, sales slabs, and minimum qualifying criteria (PRD Section 12).
          </p>
        </div>

        {isSaved && (
          <div className="bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Rule configuration active!
          </div>
        )}
      </div>

      {/* Main Configuration Card */}
      <form onSubmit={handleSave} className="purity-card p-6 space-y-6">
        
        <div>
          <h3 className="text-sm font-bold text-[#123C32] mb-1">
            Standard Commission Model
          </h3>
          <p className="text-xs text-[#78847D]">
            Default percentage credited to managers on every verified order placed by their approved restaurants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-[#202B27] block mb-1">
              Sales Reward Percentage (%):
            </label>
            <div className="relative">
              <input 
                type="number"
                step="0.5"
                min="1"
                max="50"
                value={defaultPercentage}
                onChange={e => setDefaultPercentage(parseFloat(e.target.value))}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-bold text-[#123C32]"
              />
              <Percent className="w-4 h-4 text-[#78847D] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[10px] text-[#78847D] mt-1 block">Currently 10.0% of total invoiced product value.</span>
          </div>

          <div>
            <label className="font-semibold text-[#202B27] block mb-1">
              Qualifying Sales Threshold for ₹{directReferralBonus.toLocaleString('en-IN')} Bonus:
            </label>
            <div className="relative">
              <input 
                type="number"
                step="1000"
                value={minQualifyingSales}
                onChange={e => setMinQualifyingSales(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-bold text-[#123C32]"
              />
            </div>
            <span className="text-[10px] text-[#78847D] mt-1 block">
              Cumulative orders a referred manager's restaurants must hit to trigger direct bonus.
            </span>
          </div>
        </div>

        {/* Sales Slabs Configuration (PRD Section 12) */}
        <div className="pt-4 border-t border-[#E2E9E3]">
          <h3 className="text-sm font-bold text-[#123C32] mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#1B6B50]" /> High-Volume Volume Slabs (Tiered Incentive)
          </h3>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-3 p-2.5 bg-[#F7F5EF] rounded-lg font-medium text-[#78847D] text-[11px]">
              <span>Monthly Sales Tier</span>
              <span>Invoiced Range (INR)</span>
              <span className="text-right">Commission Rate</span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-2.5 bg-white border border-[#E2E9E3] rounded-lg">
              <span className="font-semibold text-[#202B27]">Tier 1 (Base)</span>
              <span className="text-[#78847D]">₹0 – ₹50,000</span>
              <span className="text-right font-bold text-[#123C32]">8.0%</span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-2.5 bg-white border border-[#E2E9E3] rounded-lg">
              <span className="font-semibold text-[#202B27]">Tier 2 (Growth)</span>
              <span className="text-[#78847D]">₹50,001 – ₹1,50,000</span>
              <span className="text-right font-bold text-[#123C32]">10.0%</span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-2.5 bg-[#D5AE62]/10 border border-[#D5AE62]/40 rounded-lg">
              <span className="font-semibold text-[#123C32]">Tier 3 (Enterprise Partner)</span>
              <span className="text-[#78847D]">₹1,50,001+</span>
              <span className="text-right font-extrabold text-[#D5AE62]">12.5%</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E9E3] flex justify-end">
          <button type="submit" className="btn-primary text-xs">
            Save & Publish Calculation Rules
          </button>
        </div>

      </form>
    </div>
  );
};
