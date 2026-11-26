import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  UserX,
  ArrowRight,
  X,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { FilterSelect } from '../common/FilterSelect';
import { Manager } from '../../types';
import { ManagerProfileDrawer } from './ManagerProfileDrawer';

interface AdminManagersProps {
  selectedProfileManagerId?: string | null;
  onSelectProfileManagerId?: (id: string | null) => void;
  onCloseProfile?: () => void;
}

export const AdminManagers: React.FC<AdminManagersProps> = ({
  selectedProfileManagerId: controlledProfileId,
  onSelectProfileManagerId,
  onCloseProfile
}) => {
  const { 
    allManagers, 
    toggleManagerStatus, 
    rewardClaims 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Status toggle confirmation modal state
  const [pendingManager, setPendingManager] = useState<Manager | null>(null);

  // Password View Modal state
  const [passwordModalManager, setPasswordModalManager] = useState<Manager | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Manager Profile view state (controlled when parent passes props, otherwise local fallback)
  const [internalProfileId, setInternalProfileId] = useState<string | null>(null);
  const selectedProfileManagerId =
    controlledProfileId !== undefined ? controlledProfileId : internalProfileId;
  const setSelectedProfileManagerId = onSelectProfileManagerId ?? setInternalProfileId;

  const handleSelectProfile = (id: string | null) => {
    if (id === null && onCloseProfile) {
      onCloseProfile();
    } else {
      setSelectedProfileManagerId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close action modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPendingManager(null);
        setPasswordModalManager(null);
      }
    };
    if (pendingManager || passwordModalManager) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingManager, passwordModalManager]);

  const filteredManagers = allManagers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.referralCode.toLowerCase().includes(search.toLowerCase()) ||
                          m.mobile.includes(search);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmToggle = () => {
    if (pendingManager) {
      toggleManagerStatus(pendingManager.id);
      setPendingManager(null);
    }
  };

  const nextStatus = pendingManager ? (pendingManager.status === 'active' ? 'inactive' : 'active') : 'inactive';

  // Open Password Modal
  const handleOpenPasswordModal = (mgr: Manager) => {
    setPasswordModalManager(mgr);
    setShowCurrentPassword(false);
    setCopiedPassword(false);
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    if (!passwordModalManager) return;
    const pwd = passwordModalManager.password || 'password123';
    navigator.clipboard.writeText(pwd);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };


  // Calculate manager wallet balance based ONLY on sales commission minus redeemed/claimed amounts
  const getManagerCalculatedWallet = (mgr: Manager) => {
    const commissionRate = mgr.commissionRate ?? 10;
    const sales = mgr.totalSalesGenerated || 0;
    
    // Sum redeemed/claimed amounts (completed, approved, or pending claims)
    const redeemedAmount = rewardClaims
      .filter(c => c.managerId === mgr.id && (c.status === 'completed' || c.status === 'approved' || c.status === 'pending'))
      .reduce((sum, c) => sum + c.requiredAmount, 0);

    const grossSalesCommission = Math.round(sales * (commissionRate / 100));
    const netWalletBalance = Math.max(0, grossSalesCommission - redeemedAmount);

    return {
      commissionRate,
      grossSalesCommission,
      redeemedAmount,
      netWalletBalance
    };
  };

  return (
    <>
      {selectedProfileManagerId ? (
        <ManagerProfileDrawer
          managerId={selectedProfileManagerId}
          onClose={() => handleSelectProfile(null)}
          onOpenPasswordModal={(mgr) => handleOpenPasswordModal(mgr)}
          onToggleStatus={(mgr) => setPendingManager(mgr)}
        />
      ) : (
        <div className="rounded-2xl border border-[#E2E9E3] bg-white overflow-hidden shadow-subtle">
          {/* Search & Filter Bar */}
          <div className="flex flex-row items-center justify-between gap-2 md:gap-3 px-4 py-3 border-b border-[#E2E9E3]">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search manager by name, mobile, or referral code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]/50"
              />
            </div>

            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              icon={<Filter className="w-3.5 h-3.5" />}
              ariaLabel="Filter managers by status"
              className="shrink-0"
              compactMobile
              options={[
                { value: 'all', label: `All Statuses (${allManagers.length})` },
                { value: 'active', label: 'Active Only' },
                { value: 'inactive', label: 'Inactive Only' },
              ]}
            />
          </div>

          {/* Managers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4 min-w-[210px]">Manager Name</th>
                    <th className="py-3.5 px-4 min-w-[100px]">Unique Code</th>
                    <th className="py-3.5 px-4 min-w-[125px]">Referred By</th>
                    <th className="py-3.5 px-4 min-w-[125px]">Referred Restaurants</th>
                    <th className="py-3.5 px-4 min-w-[120px] text-right">Generated Sales</th>
                    <th className="py-3.5 px-4 min-w-[130px] text-right">Wallet Balance</th>
                    <th className="py-3.5 px-4 min-w-[120px] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E9E3]">
                  {filteredManagers.map(mgr => {
                    const isActive = mgr.status === 'active';
                    const { commissionRate, grossSalesCommission, redeemedAmount, netWalletBalance } = getManagerCalculatedWallet(mgr);

                    return (
                      <tr key={mgr.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                        {/* Manager Name (Interactive Link to Profile) */}
                        <td className="py-3.5 px-4">
                          <div>
                            <button
                              type="button"
                              onClick={() => handleSelectProfile(mgr.id)}
                              className="group/name text-left font-bold text-[#123C32] hover:text-[#1B6B50] flex items-center gap-1 transition-colors focus:outline-none"
                              title={`Click to view full manager profile for ${mgr.name}`}
                            >
                              <span className="group-hover/name:underline underline-offset-2 decoration-[#1B6B50]">
                                {mgr.name}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#78847D] opacity-40 group-hover/name:opacity-100 group-hover/name:translate-x-0.5 group-hover/name:text-[#1B6B50] transition-all shrink-0" />
                            </button>
                            <div className="text-[10px] text-[#78847D]">{mgr.mobile}</div>
                          </div>
                        </td>

                    {/* Unique Code */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded">
                        {mgr.referralCode}
                      </span>
                    </td>

                    {/* Referred By */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#202B27]">{mgr.referredByName || 'Root System'}</span>
                      <span className="text-[10px] font-mono text-[#78847D] block">({mgr.referredByCode || '1001'})</span>
                    </td>

                    {/* Referred Restaurants */}
                    <td className="py-3.5 px-4 font-medium text-[#202B27]">
                      {mgr.referredRestaurantsCount} outlets
                    </td>

                    {/* Generated Sales */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-[#123C32]">
                        ₹{mgr.totalSalesGenerated.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#78847D] block">Approved outlets</span>
                    </td>

                    {/* Wallet Balance (Sales Commission Only) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-[#D5AE62]">
                        ₹{netWalletBalance.toLocaleString('en-IN')}
                      </div>
                      <span 
                        className="text-[10px] text-[#78847D] block"
                        title={`Sales: ₹${mgr.totalSalesGenerated.toLocaleString('en-IN')} × ${commissionRate}% = ₹${grossSalesCommission.toLocaleString('en-IN')}${redeemedAmount > 0 ? ` minus ₹${redeemedAmount.toLocaleString('en-IN')} redeemed` : ''}. Referral bonuses strictly excluded.`}
                      >
                        Sales comm. only
                      </span>
                    </td>

                    {/* Read-Only Status Badge Column */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${
                          isActive
                            ? 'bg-[#21865A]/10 text-[#21865A] border-[#21865A]/30'
                            : 'bg-[#D9534F]/10 text-[#D9534F]/80 border-[#D9534F]/25'
                        }`}
                      >
                        {mgr.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredManagers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78847D]">
                    <p className="font-medium text-sm">No managers found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or filter selection.</p>
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password View Compact Modal */}
      {passwordModalManager && (
        <div 
          className="fixed inset-0 z-[60] !mt-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPasswordModalManager(null)}
        >
          <div 
            className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 space-y-5"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPasswordModalManager(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#78847D] hover:text-[#123C32] hover:bg-[#F7F5EF] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#123C32]/10 text-[#123C32] shrink-0">
                <KeyRound className="w-5 h-5 text-[#1B6B50]" />
              </div>
              <div>
                <h3 id="password-modal-title" className="text-base font-bold text-[#123C32]">
                  Manager Login Password
                </h3>
                <p className="text-xs text-[#78847D] mt-0.5">
                  View or copy login credentials for this manager.
                </p>
              </div>
            </div>

            {/* Manager Details Summary */}
            <div className="bg-[#F7F5EF] border border-[#E2E9E3] rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#123C32] block">{passwordModalManager.name}</span>
                <span className="text-[#78847D] text-[11px]">{passwordModalManager.mobile}</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded">
                {passwordModalManager.referralCode}
              </span>
            </div>

            {/* View / Copy Current Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#78847D] block">
                Login Password
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl px-3 py-2 flex items-center justify-between shadow-2xs">
                  <span className="font-mono text-xs font-semibold text-[#123C32]">
                    {showCurrentPassword 
                      ? (passwordModalManager.password || 'password123') 
                      : '••••••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-[#78847D] hover:text-[#123C32] p-1 transition-colors"
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-2xs ${
                    copiedPassword
                      ? 'bg-[#21865A] text-white border-[#21865A]'
                      : 'bg-[#FFFFFF] border-[#E2E9E3] text-[#123C32] hover:bg-[#F7F5EF]'
                  }`}
                  title="Copy password to clipboard"
                >
                  {copiedPassword ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#78847D]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#78847D] flex items-center gap-1 mt-1">
                <Info className="w-3 h-3 text-[#1B6B50] shrink-0" />
                <span>Managers sign in using mobile number <strong>{passwordModalManager.mobile}</strong> and this password.</span>
              </p>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-[#E2E9E3]">
              <button
                type="button"
                onClick={() => setPasswordModalManager(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78847D] hover:text-[#123C32] bg-[#F7F5EF] hover:bg-[#E2E9E3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Status Toggle */}
      {pendingManager && (
        <div 
          className="fixed inset-0 z-[60] !mt-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPendingManager(null)}
        >
          <div 
            className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 space-y-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPendingManager(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#78847D] hover:text-[#123C32] hover:bg-[#F7F5EF] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Icon */}
            <div className="flex items-start gap-3">
              <div 
                className={`p-2.5 rounded-xl shrink-0 ${
                  pendingManager.status === 'active' 
                    ? 'bg-[#D9534F]/10 text-[#D9534F]' 
                    : 'bg-[#21865A]/10 text-[#21865A]'
                }`}
              >
                {pendingManager.status === 'active' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>

              <div>
                <h3 id="status-modal-title" className="text-base font-bold text-[#123C32]">
                  {pendingManager.status === 'active' ? 'Deactivate Manager Account?' : 'Activate Manager Account?'}
                </h3>
                <p className="text-xs text-[#78847D] mt-0.5">
                  {pendingManager.status === 'active'
                    ? 'Confirming will suspend this manager’s active referral access.'
                    : 'Confirming will reinstate this manager’s full referral privileges.'}
                </p>
              </div>
            </div>

            {/* Manager Details Summary Card */}
            <div className="bg-[#F7F5EF] border border-[#E2E9E3] rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#123C32]">{pendingManager.name}</div>
                  <div className="text-[11px] text-[#78847D]">{pendingManager.mobile}</div>
                </div>
                <span className="font-mono text-xs font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded">
                  {pendingManager.referralCode}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E2E9E3] flex items-center justify-between text-xs">
                <span className="text-[#78847D]">Status change:</span>
                <div className="flex items-center gap-2">
                  <Badge status={pendingManager.status} size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-[#78847D]" />
                  <Badge status={nextStatus} size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E9E3] text-[11px]">
                <div>
                  <span className="text-[#78847D] block">Referred Outlets:</span>
                  <span className="font-semibold text-[#202B27]">{pendingManager.referredRestaurantsCount} outlets</span>
                </div>
                <div>
                  <span className="text-[#78847D] block">Total Generated Sales:</span>
                  <span className="font-semibold text-[#123C32]">₹{pendingManager.totalSalesGenerated.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#78847D] leading-relaxed">
              {pendingManager.status === 'active'
                ? '⚠️ Once deactivated, the manager cannot attribute new restaurants or receive automated commission payouts until reactivated.'
                : '✅ Once activated, the manager will immediately resume earning commission on attributed restaurant orders.'}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingManager(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78847D] hover:text-[#123C32] bg-[#F7F5EF] hover:bg-[#E2E9E3] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggle}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors flex items-center gap-1.5 ${
                  pendingManager.status === 'active'
                    ? 'bg-[#D9534F] hover:bg-[#c94541]'
                    : 'bg-[#21865A] hover:bg-[#1B6B50]'
                }`}
              >
                {pendingManager.status === 'active' ? (
                  <>
                    <UserX className="w-3.5 h-3.5" />
                    <span>Deactivate Manager</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Activate Manager</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
