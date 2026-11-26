import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Lock,
  Percent,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  ShieldAlert,
  X
} from 'lucide-react';

type CommissionApplyMode = 'preserve' | 'overwrite';
type ReferralApplyMode = 'upcoming' | 'all';

export const AdminSettings: React.FC = () => {
  const {
    adminPasscode,
    updateAdminPasscode,
    defaultCommissionRate,
    minRedemptionThreshold,
    updateGlobalCommissionSettings,
    directReferralBonus,
    directReferralThreshold,
    updateDirectReferralSettings,
    allManagers
  } = useApp();

  // 1. Admin Access Passcode
  const [passcodeInput, setPasscodeInput] = useState(adminPasscode);
  const [showPasscode, setShowPasscode] = useState(true);
  const [passcodeSaved, setPasscodeSaved] = useState(false);

  // 2. Global Default Commission Rate & Optional Minimum Redemption Threshold
  const [rateInput, setRateInput] = useState(String(defaultCommissionRate));
  const [minRedemptionInput, setMinRedemptionInput] = useState(
    minRedemptionThreshold !== null ? String(minRedemptionThreshold) : ''
  );
  const [commissionSavedLabel, setCommissionSavedLabel] = useState<string | null>(null);

  // 3. Direct Manager Referral Bonus
  const [referralBonusInput, setReferralBonusInput] = useState(String(directReferralBonus));
  const [referralThresholdInput, setReferralThresholdInput] = useState(String(directReferralThreshold));
  const [referralSavedLabel, setReferralSavedLabel] = useState<string | null>(null);

  useEffect(() => {
    setReferralBonusInput(String(directReferralBonus));
  }, [directReferralBonus]);

  useEffect(() => {
    setReferralThresholdInput(String(directReferralThreshold));
  }, [directReferralThreshold]);

  // Confirmation modal safeguard when changing default commission rate
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [applyMode, setApplyMode] = useState<CommissionApplyMode>('preserve');

  // Confirmation modal safeguard when changing direct manager referral bonus
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralApplyMode, setReferralApplyMode] = useState<ReferralApplyMode>('upcoming');

  const customRateManagersCount = allManagers.filter(
    m => m.customCommissionRate !== undefined
  ).length;

  const parsedRate = parseFloat(rateInput);
  const isRateValid = !Number.isNaN(parsedRate) && parsedRate >= 0 && parsedRate <= 100;
  const parsedThreshold =
    minRedemptionInput.trim() === ''
      ? null
      : Math.max(0, parseFloat(minRedemptionInput));

  const parsedBonus = parseFloat(referralBonusInput);
  const parsedReferralThreshold = parseFloat(referralThresholdInput);
  const isReferralValid =
    !Number.isNaN(parsedBonus) &&
    parsedBonus >= 0 &&
    !Number.isNaN(parsedReferralThreshold) &&
    parsedReferralThreshold >= 0;

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReferralValid) return;
    setReferralApplyMode('upcoming');
    setIsReferralModalOpen(true);
  };

  const handleConfirmReferralUpdate = () => {
    if (!isReferralValid) return;
    updateDirectReferralSettings(parsedBonus, parsedReferralThreshold);
    setIsReferralModalOpen(false);
    setReferralSavedLabel(
      referralApplyMode === 'all'
        ? 'Applied across active rules'
        : 'Saved (upcoming milestones)'
    );
    setTimeout(() => setReferralSavedLabel(null), 3000);
  };

  const showCommissionSavedToast = (label: string) => {
    setCommissionSavedLabel(label);
    setTimeout(() => setCommissionSavedLabel(null), 3000);
  };

  const handleSavePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;
    updateAdminPasscode(passcodeInput.trim());
    setPasscodeSaved(true);
    setTimeout(() => setPasscodeSaved(false), 2500);
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRateValid) return;

    // Safeguard: prompt before committing whenever the default rate itself changes
    if (parsedRate !== defaultCommissionRate) {
      setApplyMode('preserve');
      setIsConfirmModalOpen(true);
      return;
    }

    updateGlobalCommissionSettings(parsedRate, parsedThreshold, false);
    showCommissionSavedToast('Saved');
  };

  const handleConfirmCommissionUpdate = () => {
    if (!isRateValid) return;
    const shouldOverwrite = applyMode === 'overwrite';
    updateGlobalCommissionSettings(parsedRate, parsedThreshold, shouldOverwrite);
    setIsConfirmModalOpen(false);
    showCommissionSavedToast(
      shouldOverwrite ? 'Applied to all managers' : 'Saved (custom rates preserved)'
    );
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header (heading rendered inline with menu toggle below lg) */}
      <div className="hidden sm:block">
        <h1 className="hidden lg:flex text-xl font-bold text-[#123C32] items-center gap-2">
          <Settings className="w-6 h-6 text-[#1B6B50]" /> System Settings
        </h1>
        <p className="text-xs text-[#78847D] lg:mt-1">
          Manage your admin access passcode and global commission defaults.
        </p>
      </div>

      {/* Section 1: Admin Access Passcode */}
      <form onSubmit={handleSavePasscode} className="purity-card p-6 space-y-4 text-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#D5AE62]" /> Admin Access Passcode
            </h2>
            <p className="text-xs text-[#78847D] mt-0.5">
              Secret passcode used to unlock the Admin portal.
            </p>
          </div>
          {passcodeSaved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/25 text-[11px] font-semibold shrink-0">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1 max-w-sm">
            <label htmlFor="admin-passcode" className="font-semibold text-[#202B27] block mb-1.5">
              Passcode
            </label>
            <div className="relative">
              <input
                id="admin-passcode"
                type={showPasscode ? 'text' : 'password'}
                value={passcodeInput}
                onChange={e => setPasscodeInput(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full pl-3 pr-9 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-mono font-bold text-[#123C32]"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(prev => !prev)}
                aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78847D] hover:text-[#123C32] transition-colors"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!passcodeInput.trim()}
            className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed sm:self-end"
          >
            Save
          </button>
        </div>
      </form>

      {/* Section 2: Global Default Commission Rate */}
      <form onSubmit={handleCommissionSubmit} className="purity-card p-6 space-y-4 text-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-[#1B6B50]" /> Global Default Commission Rate
            </h2>
            <p className="hidden sm:block text-xs text-[#78847D] mt-0.5">
              Default percentage applied across all managers. Individual manager rates can be customized in the Managers section.
            </p>
          </div>
          {commissionSavedLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/25 text-[11px] font-semibold shrink-0">
              <Check className="w-3.5 h-3.5" /> {commissionSavedLabel}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="default-commission-rate" className="font-semibold text-[#202B27] block mb-1.5">
              Default Percentage Rate (%)
            </label>
            <div className="relative">
              <input
                id="default-commission-rate"
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={rateInput}
                onChange={e => setRateInput(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-bold text-[#123C32]"
              />
              <Percent className="w-3.5 h-3.5 text-[#78847D] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label htmlFor="min-redemption-threshold" className="font-semibold text-[#202B27] block mb-1.5">
              Minimum Redemption Threshold (Optional)
            </label>
            <div className="relative">
              <span className="text-[#78847D] font-semibold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
              <input
                id="min-redemption-threshold"
                type="number"
                step="100"
                min="0"
                value={minRedemptionInput}
                onChange={e => setMinRedemptionInput(e.target.value)}
                placeholder="No minimum (optional)"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-semibold text-[#123C32]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!isRateValid}
            className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </form>

      {/* Section 3: Direct Manager Referral Bonus */}
      <form onSubmit={handleReferralSubmit} className="purity-card p-6 space-y-4 text-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D5AE62]" /> Direct Manager Referral Bonus
            </h2>
            <p className="hidden sm:block text-xs text-[#78847D] mt-0.5">
              Configure the one-time bonus awarded to an upline/initial manager when their referred manager reaches qualifying restaurant sales.
            </p>
          </div>
          {referralSavedLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/25 text-[11px] font-semibold shrink-0">
              <Check className="w-3.5 h-3.5" /> {referralSavedLabel}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="direct-referral-bonus" className="font-semibold text-[#202B27] block mb-1.5">
              Direct Referral Bonus Amount (₹)
            </label>
            <div className="relative">
              <span className="text-[#78847D] font-semibold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
              <input
                id="direct-referral-bonus"
                type="number"
                step="100"
                min="0"
                value={referralBonusInput}
                onChange={e => setReferralBonusInput(e.target.value)}
                placeholder="2000"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-bold text-[#123C32]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="qualifying-sales-threshold" className="font-semibold text-[#202B27] block mb-1.5">
              Qualifying Restaurant Sales Threshold (₹)
            </label>
            <div className="relative">
              <span className="text-[#78847D] font-semibold absolute left-3 top-1/2 -translate-y-1/2">₹</span>
              <input
                id="qualifying-sales-threshold"
                type="number"
                step="500"
                min="0"
                value={referralThresholdInput}
                onChange={e => setReferralThresholdInput(e.target.value)}
                placeholder="25000"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-bold text-[#123C32]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!isReferralValid}
            className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </form>

      {/* Safeguard Confirmation Modal for Default Commission Rate Changes */}
      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="commission-safeguard-title"
        >
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-md w-full p-6 shadow-elevated relative">
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              aria-label="Close confirmation dialog"
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#D99A32]/15 text-[#D99A32] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 id="commission-safeguard-title" className="text-sm font-bold text-[#123C32]">
                  Update Global Default Commission Rate?
                </h3>
                <p className="text-xs text-[#78847D] mt-0.5">
                  Changing default rate from{' '}
                  <span className="font-semibold text-[#123C32]">{defaultCommissionRate}%</span> to{' '}
                  <span className="font-semibold text-[#123C32]">{parsedRate}%</span>.
                  {customRateManagersCount > 0 && (
                    <> ({customRateManagersCount} manager{customRateManagersCount === 1 ? ' has' : 's have'} a custom rate.)</>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs mb-5">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  applyMode === 'preserve'
                    ? 'bg-[#0E3B2E]/5 border-[#0E3B2E] ring-1 ring-[#0E3B2E]/20'
                    : 'bg-[#F7F5EF]/60 border-[#E2E9E3] hover:border-[#C8C2B4]'
                }`}
              >
                <input
                  type="radio"
                  name="commission-apply-mode"
                  value="preserve"
                  checked={applyMode === 'preserve'}
                  onChange={() => setApplyMode('preserve')}
                  className="mt-0.5 accent-[#123C32]"
                />
                <div>
                  <div className="font-bold text-[#123C32] flex items-center gap-1.5 flex-wrap">
                    <span>Keep existing custom manager rates</span>
                    <span className="text-[10px] font-semibold bg-[#21865A]/15 text-[#21865A] px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78847D] mt-1 leading-relaxed">
                    Applies <span className="font-semibold text-[#202B27]">{parsedRate}%</span> only to managers using the default rate. Individual custom rates remain intact.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  applyMode === 'overwrite'
                    ? 'bg-[#D99A32]/10 border-[#D99A32] ring-1 ring-[#D99A32]/25'
                    : 'bg-[#F7F5EF]/60 border-[#E2E9E3] hover:border-[#C8C2B4]'
                }`}
              >
                <input
                  type="radio"
                  name="commission-apply-mode"
                  value="overwrite"
                  checked={applyMode === 'overwrite'}
                  onChange={() => setApplyMode('overwrite')}
                  className="mt-0.5 accent-[#D99A32]"
                />
                <div>
                  <div className="font-bold text-[#202B27]">
                    Apply to all managers (overwrite custom rates)
                  </div>
                  <p className="text-[11px] text-[#78847D] mt-1 leading-relaxed">
                    Replaces all individual custom rates so every manager uses the new{' '}
                    <span className="font-semibold text-[#202B27]">{parsedRate}%</span> global rate.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E9E3]">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCommissionUpdate}
                className={`text-xs font-semibold px-4 py-2 rounded-lg text-white transition-colors ${
                  applyMode === 'overwrite'
                    ? 'bg-[#D99A32] hover:bg-[#c28725]'
                    : 'bg-[#123C32] hover:bg-[#1B6B50]'
                }`}
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safeguard Confirmation Modal for Direct Manager Referral Bonus Changes */}
      {isReferralModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="referral-safeguard-title"
        >
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-md w-full p-6 shadow-elevated relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsReferralModalOpen(false)}
              aria-label="Close confirmation dialog"
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#D99A32]/15 text-[#D99A32] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 id="referral-safeguard-title" className="text-sm font-bold text-[#123C32]">
                  Update Direct Manager Referral Bonus?
                </h3>
                <p className="text-xs text-[#78847D] mt-0.5 leading-relaxed">
                  Bonus: <span className="font-semibold text-[#123C32]">₹{directReferralBonus.toLocaleString('en-IN')}</span> →{' '}
                  <span className="font-semibold text-[#123C32]">₹{parsedBonus.toLocaleString('en-IN')}</span>
                  {' • '}
                  Threshold: <span className="font-semibold text-[#123C32]">₹{directReferralThreshold.toLocaleString('en-IN')}</span> →{' '}
                  <span className="font-semibold text-[#123C32]">₹{parsedReferralThreshold.toLocaleString('en-IN')}</span>.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs mb-5">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  referralApplyMode === 'upcoming'
                    ? 'bg-[#0E3B2E]/5 border-[#0E3B2E] ring-1 ring-[#0E3B2E]/20'
                    : 'bg-[#F7F5EF]/60 border-[#E2E9E3] hover:border-[#C8C2B4]'
                }`}
              >
                <input
                  type="radio"
                  name="referral-apply-mode"
                  value="upcoming"
                  checked={referralApplyMode === 'upcoming'}
                  onChange={() => setReferralApplyMode('upcoming')}
                  className="mt-0.5 accent-[#123C32]"
                />
                <div>
                  <div className="font-bold text-[#123C32] flex items-center gap-1.5 flex-wrap">
                    <span>Apply to upcoming referral milestones only</span>
                    <span className="text-[10px] font-semibold bg-[#21865A]/15 text-[#21865A] px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78847D] mt-1 leading-relaxed">
                    Keeps already-credited referral bonuses intact and applies the new bonus/threshold to future qualifying referrals.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  referralApplyMode === 'all'
                    ? 'bg-[#D99A32]/10 border-[#D99A32] ring-1 ring-[#D99A32]/25'
                    : 'bg-[#F7F5EF]/60 border-[#E2E9E3] hover:border-[#C8C2B4]'
                }`}
              >
                <input
                  type="radio"
                  name="referral-apply-mode"
                  value="all"
                  checked={referralApplyMode === 'all'}
                  onChange={() => setReferralApplyMode('all')}
                  className="mt-0.5 accent-[#D99A32]"
                />
                <div>
                  <div className="font-bold text-[#202B27]">
                    Recalculate & apply across active referral rules
                  </div>
                  <p className="text-[11px] text-[#78847D] mt-1 leading-relaxed">
                    Updates the active referral bonus configuration across all managers and syncs the new ₹ value throughout the Rewards & Claims module.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E9E3]">
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReferralUpdate}
                className="text-xs font-semibold px-4 py-2 rounded-lg text-white transition-colors bg-[#123C32] hover:bg-[#1B6B50]"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
