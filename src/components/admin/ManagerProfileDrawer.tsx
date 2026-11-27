import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft,
  Phone, 
  Calendar, 
  KeyRound, 
  Check, 
  Percent, 
  Store, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Manager } from '../../types';

interface ManagerProfileDrawerProps {
  managerId: string;
  onClose: () => void;
  onOpenPasswordModal: (mgr: Manager) => void;
  onToggleStatus: (mgr: Manager) => void;
}

export const ManagerProfileDrawer: React.FC<ManagerProfileDrawerProps> = ({
  managerId,
  onClose,
  onOpenPasswordModal,
  onToggleStatus
}) => {
  const { 
    allManagers, 
    restaurants, 
    rewardClaims, 
    updateManagerCommission 
  } = useApp();

  const manager = allManagers.find(m => m.id === managerId);

  const [rateInput, setRateInput] = useState<string>('10');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync rateInput whenever manager changes
  useEffect(() => {
    if (manager) {
      setRateInput((manager.commissionRate ?? 10).toString());
      setSaveSuccess(false);
      setSaveError(null);
    }
  }, [manager?.id, manager?.commissionRate]);

  if (!manager) return null;

  const currentRate = manager.commissionRate ?? 10;
  const sales = manager.totalSalesGenerated || 0;

  // Sum claimed / redeemed amounts
  const redeemedAmount = rewardClaims
    .filter(c => c.managerId === manager.id && (c.status === 'completed' || c.status === 'approved' || c.status === 'pending'))
    .reduce((sum, c) => sum + c.requiredAmount, 0);

  const grossSalesCommission = Math.round(sales * (currentRate / 100));
  const netWalletBalance = Math.max(0, grossSalesCommission - redeemedAmount);

  // Preview calculation based on input
  const parsedInputRate = parseFloat(rateInput);
  const isValidRate = !isNaN(parsedInputRate) && parsedInputRate >= 0 && parsedInputRate <= 100;
  const previewGross = isValidRate ? Math.round(sales * (parsedInputRate / 100)) : grossSalesCommission;
  const previewNet = isValidRate ? Math.max(0, previewGross - redeemedAmount) : netWalletBalance;
  const hasUnsavedChanges = isValidRate && parsedInputRate !== currentRate;

  // Filter referred restaurants
  const referredRestaurants = restaurants.filter(
    r => r.managerId === manager.id || r.managerName.toLowerCase() === manager.name.toLowerCase()
  );

  // Filter referred managers (direct downlines)
  const referredManagers = allManagers.filter(
    m => m.referredByCode === manager.referralCode && m.id !== manager.id
  );

  // Handle save commission rate
  const handleSaveCommission = (rateToSet?: number) => {
    const targetRate = rateToSet !== undefined ? rateToSet : parsedInputRate;

    if (isNaN(targetRate) || targetRate < 0 || targetRate > 100) {
      setSaveError('Please enter a valid rate between 0% and 100%.');
      return;
    }

    updateManagerCommission(manager.id, targetRate);
    setRateInput(targetRate.toString());
    setSaveError(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const initials = manager.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isManagerActive = manager.status === 'active';
  const statusActionLabel = isManagerActive ? 'Deactivate' : 'Activate';
  const statusActionTitle = isManagerActive ? 'Deactivate manager' : 'Activate manager';
  const statusActionToneClass = isManagerActive
    ? 'bg-[#D9534F]/10 text-[#D9534F] border-[#D9534F]/30 hover:bg-[#D9534F]/20'
    : 'bg-[#21865A]/10 text-[#21865A] border-[#21865A]/30 hover:bg-[#21865A]/20';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Profile Title Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-4 sm:px-6 shadow-subtle">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to Managers"
            title="Back to Managers"
            className="inline-flex items-center justify-center p-0 -ml-1 bg-transparent text-[#1B6B50] hover:text-[#123C32] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-[#123C32]/10 text-[#123C32] flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>

          <h2 className="text-base font-bold text-[#123C32] leading-tight truncate">
            {manager.name}
          </h2>
        </div>

        <span className="font-mono text-xs font-bold text-[#1B6B50] bg-[#1B6B50]/10 border border-[#1B6B50]/20 px-2.5 py-1 rounded-lg shrink-0">
          {manager.referralCode}
        </span>
      </div>

      {/* Stacked Full-Width Cards: Manager Account Info & Commission Rate / Wallet Control */}
      <div className="grid grid-cols-1 gap-6">
        {/* Card 1: Manager Account Info Card */}
        <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg font-bold text-[#123C32]">{manager.name}</h3>
              <Badge status={manager.status} size="sm" />
            </div>

            {/* Action Buttons: Password & Status */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenPasswordModal(manager)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#123C32] bg-[#F7F5EF] hover:bg-[#E2E9E3] border border-[#E2E9E3] hidden md:inline-flex items-center gap-1.5 transition-colors"
                title="View login password"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#1B6B50]" />
                <span>Password Key</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleStatus(manager)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border hidden md:inline-flex items-center gap-1.5 transition-colors ${statusActionToneClass}`}
                title={statusActionTitle}
              >
                {statusActionLabel}
              </button>
            </div>
          </div>

          {/* Account Info Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:pt-5 md:border-t md:border-[#E2E9E3] text-xs">
            <div className="flex items-start gap-2.5 text-[#78847D] bg-[#F7F5EF]/60 rounded-xl p-3 border border-[#E2E9E3]/70">
              <Phone className="w-4 h-4 text-[#1B6B50] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] block">Mobile Number</span>
                <span className="text-[#202B27] font-semibold">+91 {manager.mobile}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[#78847D] bg-[#F7F5EF]/60 rounded-xl p-3 border border-[#E2E9E3]/70">
              <Calendar className="w-4 h-4 text-[#1B6B50] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] block">Registered On</span>
                <strong className="text-[#202B27]">{manager.registeredDate}</strong>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-[#78847D] bg-[#F7F5EF]/60 rounded-xl p-3 border border-[#E2E9E3]/70">
              <Users className="w-4 h-4 text-[#1B6B50] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] block">Referred By</span>
                <span className="text-[#202B27]">
                  <strong>{manager.referredByName || 'Root System'}</strong>{' '}
                  (<span className="font-mono text-[#1B6B50] font-semibold">{manager.referredByCode || '1001'}</span>)
                </span>
              </div>
            </div>
          </div>

          {/* Mobile-only Actions */}
          <div className="border-t border-[#E2E9E3] pt-4 mt-4 flex flex-col gap-2.5 md:hidden">
            <button
              type="button"
              onClick={() => onOpenPasswordModal(manager)}
              className="w-full justify-center px-3 py-2 rounded-xl text-xs font-semibold text-[#123C32] bg-[#F7F5EF] hover:bg-[#E2E9E3] border border-[#E2E9E3] flex items-center gap-1.5 transition-colors"
              title="View login password"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#1B6B50]" />
              <span>Password Key</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleStatus(manager)}
              className={`w-full justify-center px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${statusActionToneClass}`}
              title={statusActionTitle}
            >
              {statusActionLabel}
            </button>
          </div>
        </div>

        {/* Card 2: Individual Commission Rate Control & Wallet Card */}
        <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#123C32] flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#D5AE62]" /> Individual Commission Rate & Wallet Control
            </h4>
            <span className="text-xs font-bold text-[#1B6B50] bg-[#1B6B50]/10 border border-[#1B6B50]/20 px-2.5 py-1 rounded-full whitespace-nowrap">
              Current: {currentRate}%
            </span>
          </div>

          {/* Current Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7F5EF] border border-[#E2E9E3] rounded-xl p-3.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#78847D] tracking-wider block">Total Sales</span>
              <span className="text-base font-bold text-[#123C32]">₹{sales.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-[#78847D] block">{referredRestaurants.length} approved outlets</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#78847D] tracking-wider block">Redeemed Claims</span>
              <span className="text-base font-bold text-[#78847D]">₹{redeemedAmount.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-[#78847D] block">Deducted from gross</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#D5AE62] tracking-wider block">Sales Wallet Balance</span>
              <span className="text-base font-bold text-[#D5AE62]">₹{netWalletBalance.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-[#78847D] block">Sales comm. only</span>
            </div>
          </div>

          {/* Commission Rate Edit Form */}
          <div className="p-4 bg-[#FFFFFF] border border-[#123C32]/15 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Numeric input with % */}
              <div className="relative w-full sm:w-28 shrink-0">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={rateInput}
                  onChange={(e) => {
                    setRateInput(e.target.value);
                    setSaveSuccess(false);
                    setSaveError(null);
                  }}
                  placeholder="e.g. 10"
                  aria-label="Commission Percentage"
                  className="w-full pl-3 pr-7 py-2 text-xs font-bold border border-[#E2E9E3] rounded-lg focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#78847D] pointer-events-none">
                  %
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[5, 8, 10, 15, 20].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setRateInput(rate.toString());
                      setSaveSuccess(false);
                      setSaveError(null);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      parsedInputRate === rate
                        ? 'bg-[#123C32] text-white'
                        : 'bg-[#F7F5EF] text-[#78847D] hover:text-[#123C32] hover:bg-[#E2E9E3]'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => handleSaveCommission()}
                disabled={!isValidRate}
                className="sm:ml-auto px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#123C32] hover:bg-[#1B6B50] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Rate</span>
              </button>
            </div>

            {/* Live Preview / Feedback note */}
            {hasUnsavedChanges && (
              <div className="text-xs text-[#1B6B50] bg-[#1B6B50]/10 border border-[#1B6B50]/20 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                <span>
                  Preview at <strong>{parsedInputRate}%</strong>: Gross ₹{previewGross.toLocaleString('en-IN')} → New Wallet Balance: <strong>₹{previewNet.toLocaleString('en-IN')}</strong>
                </span>
                <span className="text-[11px] font-semibold text-[#78847D]">Unsaved</span>
              </div>
            )}

            {saveSuccess && (
              <div className="text-xs text-[#21865A] bg-[#21865A]/10 border border-[#21865A]/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Commission rate updated to <strong>{currentRate}%</strong>! Wallet balance recalculated to <strong>₹{netWalletBalance.toLocaleString('en-IN')}</strong>.
                </span>
              </div>
            )}

            {saveError && (
              <div className="text-xs text-[#D9534F] bg-[#D9534F]/10 border border-[#D9534F]/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Referred Restaurants List */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-[#123C32] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#1B6B50]" /> Referred Restaurants
            </h4>
            <p className="text-xs text-[#78847D] mt-0.5">
              Restaurants registered under {manager.name}'s referral attribution.
            </p>
          </div>
          <span className="text-xs font-bold bg-[#123C32]/10 text-[#123C32] px-3 py-1 rounded-full shrink-0">
            {referredRestaurants.length} {referredRestaurants.length === 1 ? 'Outlet' : 'Outlets'}
          </span>
        </div>

        {referredRestaurants.length === 0 ? (
          <div className="p-8 text-center text-[#78847D] bg-[#F7F5EF]/60 rounded-xl border border-dashed border-[#E2E9E3]">
            <Store className="w-6 h-6 mx-auto text-[#78847D]/50 mb-1.5" />
            <p className="text-xs font-medium text-[#202B27]">No restaurants referred yet</p>
            <p className="text-xs text-[#78847D] mt-0.5">When this manager onboards restaurants, they will appear here with live sales metrics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referredRestaurants.map(restaurant => (
              <div 
                key={restaurant.id}
                className="p-4 bg-[#FFFFFF] hover:bg-[#F7F5EF]/50 border border-[#E2E9E3] rounded-xl transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#123C32]">{restaurant.restaurantName}</span>
                      <span className="text-[11px] font-medium bg-[#123C32]/5 text-[#123C32] px-2 py-0.5 rounded">
                        {restaurant.category}
                      </span>
                    </div>
                    <span className="text-xs text-[#78847D] block mt-0.5">
                      {restaurant.address}, {restaurant.city} • {restaurant.mobile}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge status={restaurant.status} size="sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#E2E9E3]/70">
                  <div className="text-xs text-[#78847D]">
                    ID: <span className="font-mono font-semibold text-[#1B6B50]">{restaurant.mappedPurityId || restaurant.existingPurityCustomerId || 'Pending mapping'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#78847D] mr-1.5">Total Sales:</span>
                    <span className="font-bold text-sm text-[#123C32]">₹{restaurant.totalSales.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Referred Managers (Direct Downlines & ₹2,000 Bonus) */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-[#123C32] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1B6B50]" /> Referred Managers (Direct Downlines)
            </h4>
            <p className="text-xs text-[#78847D] mt-0.5">
              Managers who registered using code <span className="font-mono font-bold text-[#1B6B50]">{manager.referralCode}</span>.
            </p>
          </div>
          <span className="text-xs font-bold bg-[#123C32]/10 text-[#123C32] px-3 py-1 rounded-full shrink-0">
            {referredManagers.length} {referredManagers.length === 1 ? 'Manager' : 'Managers'}
          </span>
        </div>

        {referredManagers.length === 0 ? (
          <div className="p-8 text-center text-[#78847D] bg-[#F7F5EF]/60 rounded-xl border border-dashed border-[#E2E9E3]">
            <Users className="w-6 h-6 mx-auto text-[#78847D]/50 mb-1.5" />
            <p className="text-xs font-medium text-[#202B27]">No referred managers</p>
            <p className="text-xs text-[#78847D] mt-0.5">Colleagues who register using {manager.name}'s referral code will be listed here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referredManagers.map(downline => {
              const isBonusEligible = downline.totalSalesGenerated >= 25000;

              return (
                <div 
                  key={downline.id}
                  className="p-4 bg-[#FFFFFF] hover:bg-[#F7F5EF]/50 border border-[#E2E9E3] rounded-xl transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#123C32]">{downline.name}</span>
                        <span className="font-mono text-[11px] font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded">
                          {downline.referralCode}
                        </span>
                      </div>
                      <span className="text-xs text-[#78847D] block mt-0.5">
                        {downline.mobile}
                      </span>
                    </div>

                    <Badge status={downline.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2.5 border-t border-[#E2E9E3]/70">
                    <div>
                      <span className="text-[11px] text-[#78847D] block">Referred Outlets:</span>
                      <span className="font-semibold text-[#202B27]">{downline.referredRestaurantsCount} outlets</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#78847D] block">Generated Sales:</span>
                      <span className="font-bold text-sm text-[#123C32]">₹{downline.totalSalesGenerated.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* ₹2,000 Direct Referral Bonus Status Pill */}
                  <div className="pt-2.5 border-t border-[#E2E9E3]/70 flex items-center justify-between gap-2 text-xs">
                    <span className="text-xs text-[#78847D]">₹2,000 Direct Referral Bonus:</span>
                    {isBonusEligible ? (
                      <span className="inline-flex items-center gap-1 bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ₹2,000 Credited to {manager.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#D99A32]/10 text-[#D99A32] border border-[#D99A32]/30 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> In Progress (&lt; ₹25,000 sales)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
