import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gift,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Check,
  User,
  Clock,
  AlertCircle,
  CreditCard,
  Sparkles,
  Users
} from 'lucide-react';
import { RewardClaim } from '../../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Record for managers who earn the first-referral bonus and their payout history
interface ReferralBonusPayoutRecord {
  id: string;
  beneficiaryName: string;
  beneficiaryCode: string;
  referredName: string;
  referredCode: string;
  qualifyingSales: number;
  bonusAmount: number;
  payoutDate: string;
  payoutReference: string;
  status: 'completed' | 'pending';
}

export const AdminRewardClaims: React.FC = () => {
  const { 
    rewardClaims, 
    allManagers, 
    updateClaimStatus, 
    claimsViewMode, 
    setClaimsViewMode,
    directReferralBonus
  } = useApp();

  // View mode: 'table' (main table layout) or 'pending-view' (dedicated pending claims action screen)
  const viewMode = claimsViewMode;
  const setViewMode = setClaimsViewMode;

  // Filter chips above table: 'manager' (redemptions/claims) vs 'referral' (first-referral bonus payouts)
  const [tableFilter, setTableFilter] = useState<'manager' | 'referral'>('manager');

  // Search and Date filter states for table
  const [search, setSearch] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [hoverDate, setHoverDate] = useState('');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // Calendar view navigation
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10); // 10 = November

  // Action Modal State (Approve / Reject)
  const [selectedClaim, setSelectedClaim] = useState<RewardClaim | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [payoutRef, setPayoutRef] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Collapsible accordion state for pending claims
  const [expandedClaimIds, setExpandedClaimIds] = useState<Record<string, boolean>>({});

  const toggleClaimExpand = (claimId: string) => {
    setExpandedClaimIds(prev => ({
      ...prev,
      [claimId]: !prev[claimId]
    }));
  };

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close calendar popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  // Calendar days generation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrent = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      year: number;
      month: number;
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
    }[] = [];

    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrev - i;
      const mm = String(prevMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      days.push({
        year: prevYear,
        month: prevMonth,
        day: d,
        dateStr: `${prevYear}-${mm}-${dd}`,
        isCurrentMonth: false,
      });
    }

    for (let d = 1; d <= daysInCurrent; d++) {
      const mm = String(viewMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      days.push({
        year: viewYear,
        month: viewMonth,
        day: d,
        dateStr: `${viewYear}-${mm}-${dd}`,
        isCurrentMonth: true,
      });
    }

    const totalDays = days.length;
    const nextMonthDaysNeeded = (7 - (totalDays % 7)) % 7;
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    for (let d = 1; d <= nextMonthDaysNeeded; d++) {
      const mm = String(nextMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      days.push({
        year: nextYear,
        month: nextMonth,
        day: d,
        dateStr: `${nextYear}-${mm}-${dd}`,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = (dateStr: string) => {
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(dateStr);
      setToDate('');
      setHoverDate('');
    } else if (fromDate && !toDate) {
      if (dateStr < fromDate) {
        setFromDate(dateStr);
        setToDate('');
        setHoverDate('');
      } else {
        setToDate(dateStr);
        setHoverDate('');
      }
    }
  };

  const handleDateHover = (dateStr: string) => {
    if (fromDate && !toDate) {
      setHoverDate(dateStr);
    }
  };

  const hasActiveDateFilter = Boolean(appliedFromDate || appliedToDate);

  const handleApplyDateFilter = () => {
    if (!fromDate) return;
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate || fromDate);
    setIsPopoverOpen(false);
  };

  const handleResetDateFilter = () => {
    setFromDate('');
    setToDate('');
    setHoverDate('');
    setAppliedFromDate('');
    setAppliedToDate('');
    setIsPopoverOpen(false);
  };

  // Calculate pre- and post-redemption balances for each claim
  const getClaimBalances = (claim: RewardClaim) => {
    const manager = allManagers.find(m => m.id === claim.managerId);
    const currentBal = manager?.walletBalance ?? 48500;

    const remainingBalance = claim.postRedemptionBalance !== undefined
      ? claim.postRedemptionBalance
      : (claim.status === 'completed' ? currentBal : Math.max(0, currentBal - claim.requiredAmount));

    const totalBalance = claim.preRedemptionBalance !== undefined
      ? claim.preRedemptionBalance
      : (remainingBalance + claim.requiredAmount);

    return { totalBalance, remainingBalance };
  };

  // Pending claims list
  const pendingClaims = useMemo(() => {
    return rewardClaims.filter(c => c.status === 'pending');
  }, [rewardClaims]);

  // Settled / Completed & Filtered claims for Manager table (history table shows completed only)
  const filteredClaims = useMemo(() => {
    return rewardClaims.filter(claim => {
      if (claim.status !== 'completed') return false;

      const matchesSearch =
        claim.managerName.toLowerCase().includes(search.toLowerCase()) ||
        claim.rewardTitle.toLowerCase().includes(search.toLowerCase()) ||
        claim.id.toLowerCase().includes(search.toLowerCase()) ||
        (claim.payoutReference && claim.payoutReference.toLowerCase().includes(search.toLowerCase()));

      const claimDate = claim.claimedDate.trim().split(' ')[0];
      const matchesFrom = !appliedFromDate || claimDate >= appliedFromDate;
      const matchesTo = !appliedToDate || claimDate <= appliedToDate;
      const matchesDate = matchesFrom && matchesTo;

      return matchesSearch && matchesDate;
    });
  }, [rewardClaims, search, appliedFromDate, appliedToDate]);

  // First-referral bonus payout records for Referral Management
  const referralBonusRecords: ReferralBonusPayoutRecord[] = useMemo(() => {
    return [
      {
        id: 'REF-PAY-001',
        beneficiaryName: 'Rajesh Kumar',
        beneficiaryCode: 'A1001',
        referredName: 'Vikram Shah',
        referredCode: 'B1001',
        qualifyingSales: 312000,
        bonusAmount: directReferralBonus,
        payoutDate: '2026-11-10',
        payoutReference: 'REF-BONUS-B1001',
        status: 'completed',
      },
      {
        id: 'REF-PAY-002',
        beneficiaryName: 'Rajesh Kumar',
        beneficiaryCode: 'A1001',
        referredName: 'Priya Sharma',
        referredCode: 'P1002',
        qualifyingSales: 145000,
        bonusAmount: directReferralBonus,
        payoutDate: '2026-11-15',
        payoutReference: 'REF-BONUS-P1002',
        status: 'completed',
      },
      {
        id: 'REF-PAY-003',
        beneficiaryName: 'Rajesh Kumar',
        beneficiaryCode: 'A1001',
        referredName: 'Sneha Reddy',
        referredCode: 'S1004',
        qualifyingSales: 890000,
        bonusAmount: directReferralBonus,
        payoutDate: '2026-11-20',
        payoutReference: 'REF-BONUS-S1004',
        status: 'completed',
      },
      {
        id: 'REF-PAY-004',
        beneficiaryName: 'Root Initial Manager',
        beneficiaryCode: '1001',
        referredName: 'Rajesh Kumar',
        referredCode: 'A1001',
        qualifyingSales: 486200,
        bonusAmount: directReferralBonus,
        payoutDate: '2026-10-28',
        payoutReference: 'REF-BONUS-A1001',
        status: 'completed',
      },
      {
        id: 'REF-PAY-005',
        beneficiaryName: 'Root Initial Manager',
        beneficiaryCode: '1001',
        referredName: 'Amit Patel',
        referredCode: 'A1003',
        qualifyingSales: 45000,
        bonusAmount: directReferralBonus,
        payoutDate: '2026-11-05',
        payoutReference: 'REF-BONUS-A1003',
        status: 'completed',
      }
    ];
  }, [directReferralBonus]);

  // Filtered referral bonus records
  const filteredReferralRecords = useMemo(() => {
    return referralBonusRecords.filter(rec => {
      const matchesSearch =
        rec.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
        rec.beneficiaryCode.toLowerCase().includes(search.toLowerCase()) ||
        rec.referredName.toLowerCase().includes(search.toLowerCase()) ||
        rec.referredCode.toLowerCase().includes(search.toLowerCase()) ||
        rec.payoutReference.toLowerCase().includes(search.toLowerCase());

      const recDate = rec.payoutDate.trim().split(' ')[0];
      const matchesFrom = !appliedFromDate || recDate >= appliedFromDate;
      const matchesTo = !appliedToDate || recDate <= appliedToDate;
      const matchesDate = matchesFrom && matchesTo;

      return matchesSearch && matchesDate;
    });
  }, [referralBonusRecords, search, appliedFromDate, appliedToDate]);

  // Export CSV
  const handleExportCSV = () => {
    if (tableFilter === 'manager') {
      const headers = [
        'Manager Name',
        'Manager Code',
        'Payout Date',
        'Prev. Balance (INR)',
        'Selected Reward',
        'Reward Value (INR)',
        'Left Balance (INR)',
        'Status',
        'Disbursement Reference'
      ];
      const rows = filteredClaims.map(claim => {
        const { totalBalance, remainingBalance } = getClaimBalances(claim);
        const manager = allManagers.find(m => m.id === claim.managerId);
        return [
          claim.managerName,
          manager?.referralCode || '1001',
          claim.claimedDate,
          totalBalance,
          claim.rewardTitle,
          claim.requiredAmount,
          remainingBalance,
          claim.status,
          claim.payoutReference || 'N/A'
        ];
      });

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Reward_Claims_Disbursements_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const headers = [
        'Beneficiary Manager',
        'Beneficiary Code',
        'Referred Manager',
        'Referred Code',
        'Payout Date',
        'First Referral Bonus (INR)',
        'Payout Status',
        'Disbursement Reference'
      ];
      const rows = filteredReferralRecords.map(rec => [
        rec.beneficiaryName,
        rec.beneficiaryCode,
        rec.referredName,
        rec.referredCode,
        rec.payoutDate,
        rec.bonusAmount,
        rec.status,
        rec.payoutReference
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Referral_Bonus_Disbursements_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Submit Approval / Rejection
  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim || !actionType) return;

    if (actionType === 'approve') {
      const finalRef = payoutRef.trim() || `UTR-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`;
      updateClaimStatus(selectedClaim.id, 'completed', actionNotes, finalRef);
      setActionFeedback(`Claim for "${selectedClaim.rewardTitle}" approved and settled! Payout ref: ${finalRef}`);
    } else {
      updateClaimStatus(selectedClaim.id, 'rejected', actionNotes);
      setActionFeedback(`Claim for "${selectedClaim.rewardTitle}" declined. Reserved balance released back to manager.`);
    }

    setSelectedClaim(null);
    setActionType(null);
    setActionNotes('');
    setPayoutRef('');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">

      {/* Feedback Banner */}
      {actionFeedback && (
        <div className="bg-[#21865A]/10 border border-[#21865A]/30 text-[#21865A] p-4 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#21865A]" />
            <span className="font-semibold">{actionFeedback}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-[#21865A] hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DEDICATED PENDING CLAIMS ACTION SCREEN / VIEW */}
      {viewMode === 'pending-view' ? (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Header Bar (Borderless) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="p-2 sm:p-2.5 rounded-xl border border-[#E2E9E3] bg-[#FFFFFF] text-[#123C32] hover:bg-[#F7F5EF] hover:border-[#123C32] transition-colors shrink-0 shadow-xs"
              title="Back to Claims Table"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-[#123C32] flex items-center gap-2">
              <Gift className="hidden md:inline-flex w-5 h-5 text-[#1B6B50] shrink-0" />
              <span className="md:hidden">Pending Reward</span>
              <span className="hidden md:inline">Pending Reward Claims Queue</span>
            </h1>
          </div>

          {/* Pending Claims List */}
          {pendingClaims.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-12 text-center text-xs text-[#78847D] shadow-subtle">
              <Gift className="w-10 h-10 text-[#78847D]/30 mx-auto mb-3" />
              <p className="font-semibold text-sm text-[#123C32] mb-1">No Pending Claims</p>
              <p>All reward claims have been settled or reviewed.</p>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className="mt-4 btn-primary text-xs"
              >
                Return to Claims Table
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {pendingClaims.map(claim => {
                const { totalBalance, remainingBalance } = getClaimBalances(claim);
                const manager = allManagers.find(m => m.id === claim.managerId);
                const managerCode = manager?.referralCode || 'B1001';
                const isExpanded = Boolean(expandedClaimIds[claim.id]);

                return (
                  <div
                    key={claim.id}
                    className={`bg-[#FFFFFF] border rounded-2xl shadow-subtle transition-all duration-200 ${
                      isExpanded
                        ? 'border-[#1B6B50]/50 p-5 sm:p-6 space-y-4 ring-1 ring-[#1B6B50]/15'
                        : 'border-[#E2E9E3] p-4 sm:p-5 hover:border-[#1B6B50]/40'
                    }`}
                  >
                    {/* Header Row: Manager & Submission info + Value + Actions + Chevron */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isExpanded ? 'pb-4 border-b border-[#E2E9E3]' : ''}`}>
                      <div className="flex items-start sm:items-center justify-between gap-3 w-full sm:w-auto min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#123C32]/5 text-[#1B6B50] flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-[#1B6B50]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-[#123C32] truncate">{claim.managerName}</h3>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D99A32]/10 text-[#D99A32] border border-[#D99A32]/30 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" />
                                Pending
                              </span>
                              <span className="hidden sm:inline text-xs text-[#78847D] font-mono">
                                Code: <span className="font-semibold text-[#1B6B50]">{managerCode}</span>
                              </span>
                            </div>
                            <p className="text-xs text-[#78847D] mt-0.5 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#78847D]" />
                              <span>Submitted on {claim.claimedDate}</span>
                            </p>
                          </div>
                        </div>

                        {/* Mobile plain text Code aligned to the right side of the card */}
                        <div className="sm:hidden text-right shrink-0 pt-0.5">
                          <span className="text-xs text-[#78847D] font-mono">
                            Code: <span className="font-semibold text-[#1B6B50]">{managerCode}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Reward Value + Actions + Chevron Toggle */}
                      <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center flex-wrap">
                        <div className="text-right hidden sm:block mr-1">
                          <span className="text-[10px] uppercase font-bold text-[#78847D] block tracking-wider">Reward Value</span>
                          <span className="text-sm font-extrabold text-[#123C32]">₹{claim.requiredAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClaim(claim);
                            setActionType('approve');
                            setPayoutRef(`UTR-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`);
                          }}
                          className="px-3.5 sm:px-4 py-2 bg-[#1B6B50] hover:bg-[#123C32] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Pay
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClaim(claim);
                            setActionType('reject');
                          }}
                          className="px-3.5 sm:px-4 py-2 rounded-xl border border-[#D9534F]/35 text-[#D9534F] hover:bg-[#D9534F]/5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleClaimExpand(claim.id)}
                          className="p-2 rounded-xl border border-[#E2E9E3] text-[#78847D] hover:text-[#123C32] hover:bg-[#F7F5EF] transition-all shrink-0"
                          title={isExpanded ? 'Collapse details' : 'Expand details'}
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#123C32]' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Details Grid: Revealed on expand */}
                    {isExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Left: Reward Requested */}
                        <div className="bg-[#F7F5EF]/70 p-4 sm:p-5 rounded-xl border border-[#E2E9E3] flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider flex items-center gap-1.5">
                              <Gift className="w-3.5 h-3.5 text-[#1B6B50]" /> REQUESTED REWARD ITEM
                            </span>
                            <div>
                              <div className="text-sm font-bold text-[#123C32]">{claim.rewardTitle}</div>
                              <div className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider mt-0.5">
                                CATEGORY: <span className="text-[#1B6B50] font-bold">{claim.rewardCategory}</span>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-[#E2E9E3] flex justify-between items-center text-xs">
                              <span className="text-[#78847D] font-medium">Required Points / Value:</span>
                              <span className="font-extrabold text-[#123C32] text-sm sm:text-base">
                                ₹{claim.requiredAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider block mb-1.5">
                              MANAGER NOTES:
                            </span>
                            <p className="text-xs text-[#202B27] bg-[#FFFFFF] p-3 rounded-xl border border-[#E2E9E3] italic leading-relaxed">
                              "{claim.notes || 'No manager notes provided.'}"
                            </p>
                          </div>
                        </div>

                        {/* Right: Points & Balance Verification */}
                        <div className="bg-[#F7F5EF]/70 p-4 sm:p-5 rounded-xl border border-[#E2E9E3] flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider flex items-center gap-1.5 mb-3">
                              <CreditCard className="w-3.5 h-3.5 text-[#D5AE62]" /> POINTS & BALANCE REVIEW
                            </span>

                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[#78847D] font-medium">Total Balance Before Redemption:</span>
                                <span className="font-bold text-xs sm:text-sm text-[#123C32]">
                                  ₹{totalBalance.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[#D9534F] font-medium">Deduction for Reward:</span>
                                <span className="font-bold text-xs sm:text-sm text-[#D9534F]">
                                  - ₹{claim.requiredAmount.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs pt-1">
                                <span className="font-bold text-[#123C32]">Remaining Balance After Deduction:</span>
                                <span className="font-extrabold text-sm sm:text-base text-[#21865A]">
                                  ₹{remainingBalance.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E9E3] text-xs">
                            {remainingBalance >= 0 ? (
                              <span className="text-[#21865A] font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#21865A] shrink-0" />
                                Sufficient wallet balance for full settlement.
                              </span>
                            ) : (
                              <span className="text-[#D9534F] font-semibold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-[#D9534F] shrink-0" />
                                Warning: Manager wallet balance is below required amount.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* DISBURSEMENT TABLE LAYOUT VIEW */
        <div className="space-y-5 animate-in fade-in duration-150">

          {/* Main Page Heading */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
                <Gift className="w-6 h-6 text-[#1B6B50]" /> Reward Claims
              </h1>
            </div>
          </div>

          {/* Controls Bar: Manager vs Referral Management Filter Chips (Pending chip is elevated to top header on mobile) */}
          <div className="flex items-center justify-between gap-3">
            {/* Filter Chips: Manager vs Referral Management */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTableFilter('manager');
                  setSearch('');
                }}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tableFilter === 'manager'
                    ? 'bg-[#123C32] text-white shadow-xs'
                    : 'bg-white border border-[#E2E9E3] text-[#78847D] hover:text-[#123C32] hover:border-[#123C32]'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Manager</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTableFilter('referral');
                  setSearch('');
                }}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tableFilter === 'referral'
                    ? 'bg-[#123C32] text-white shadow-xs'
                    : 'bg-white border border-[#E2E9E3] text-[#78847D] hover:text-[#123C32] hover:border-[#123C32]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Referral Management</span>
              </button>
            </div>

            {/* Standalone Compact Pending Chip (Desktop only: hidden on mobile where it is placed in top header row alongside Reward Claims) */}
            <button
              type="button"
              onClick={() => {
                setViewMode('pending-view');
                setSelectedClaim(null);
                setActionType(null);
              }}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E9E3] hover:border-[#123C32] text-[#123C32] hover:bg-[#F7F5EF] shadow-xs transition-colors shrink-0 whitespace-nowrap"
              title="Review pending claims awaiting admin action"
            >
              <Gift className="w-3.5 h-3.5 text-[#1B6B50] shrink-0" />
              <span>Pending</span>
              {pendingClaims.length > 0 && (
                <span className="text-[10px] bg-[#D9534F] text-white px-1.5 py-0.5 rounded-full font-bold shrink-0 min-w-[18px] text-center leading-none">
                  {pendingClaims.length}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-[#78847D] shrink-0" />
            </button>
          </div>

          {/* Table Container Card (Disbursement Table Layout) */}
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl shadow-subtle relative">

            {/* Controls Row: Search bar, Calendar Popover trigger, and Compact Export button */}
            <div className="p-4 border-b border-[#E2E9E3] flex items-center gap-2.5 sm:gap-3 bg-[#FFFFFF] rounded-t-2xl">
              {/* Search Input */}
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    tableFilter === 'manager'
                      ? 'Search by manager name, selected reward, or claim ID...'
                      : 'Search by beneficiary manager, referred manager, or reference...'
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E2E9E3] bg-[#F7F5EF]/60 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#123C32] transition-colors text-[#202B27]"
                />
              </div>

              {/* Active Filter Pill with Quick Clear */}
              {hasActiveDateFilter && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E3B2E]/10 border border-[#0E3B2E]/20 text-xs text-[#0E3B2E] font-medium shrink-0 animate-in fade-in">
                  <Calendar className="w-3.5 h-3.5 text-[#0E3B2E]" />
                  <span className="text-[11px] font-semibold">
                    {appliedFromDate} {appliedToDate ? `→ ${appliedToDate}` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetDateFilter}
                    className="p-0.5 rounded-full hover:bg-[#0E3B2E]/20 transition-colors ml-0.5"
                    title="Clear date filter"
                  >
                    <X className="w-3 h-3 text-[#0E3B2E]" />
                  </button>
                </div>
              )}

              {/* Compact Calendar Icon Trigger Button */}
              <div className={`relative shrink-0 ${isPopoverOpen ? 'z-50' : ''}`} ref={popoverRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPopoverOpen) {
                      setFromDate(appliedFromDate);
                      setToDate(appliedToDate);
                      if (appliedFromDate) {
                        const [y, m] = appliedFromDate.split('-').map(Number);
                        if (!isNaN(y) && !isNaN(m)) {
                          setViewYear(y);
                          setViewMonth(m - 1);
                        }
                      }
                    }
                    setIsPopoverOpen(!isPopoverOpen);
                  }}
                  className={`relative p-2.5 rounded-xl border transition-all flex items-center justify-center ${hasActiveDateFilter
                    ? 'bg-[#0E3B2E] text-[#F7F5EF] border-[#0E3B2E] shadow-sm'
                    : 'bg-[#F7F5EF]/70 text-[#0E3B2E] border-[#E2E9E3] hover:bg-[#F7F5EF] hover:border-[#1B6B50]'
                    }`}
                  title={hasActiveDateFilter ? `Active Date Filter: ${appliedFromDate} to ${appliedToDate}` : "Filter by Date Range"}
                  aria-label="Filter by Date Range"
                >
                  <Calendar className={`w-4 h-4 ${hasActiveDateFilter ? 'text-[#F7F5EF]' : 'text-[#0E3B2E]'}`} />
                  {hasActiveDateFilter && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D5AE62] rounded-full border-2 border-white" />
                  )}
                </button>

                {/* Custom Visual Calendar Popover */}
                {isPopoverOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-[#202B27]/20 sm:hidden"
                      onClick={() => setIsPopoverOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-[280px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-1.5 sm:translate-x-0 sm:translate-y-0 sm:w-[280px] sm:max-w-none bg-[#FCFBF7] border border-[#E2E9E3] rounded-2xl shadow-2xl p-3 sm:p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                      role="dialog"
                      aria-label="Visual date range picker"
                    >
                      {/* Header: Month/Year navigation and Close button */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E9E3]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 rounded-md text-[#0E3B2E] hover:bg-[#E2E9E3]/70 transition-colors"
                            title="Previous Month"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-[#0E3B2E] min-w-[100px] text-center">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 rounded-md text-[#0E3B2E] hover:bg-[#E2E9E3]/70 transition-colors"
                            title="Next Month"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsPopoverOpen(false)}
                          className="p-1 rounded-md text-[#78847D] hover:text-[#0E3B2E] hover:bg-[#E2E9E3]/50 transition-colors"
                          aria-label="Close"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Range Display Banner */}
                      <div className="bg-[#F7F5EF] border border-[#E2E9E3] rounded-xl px-2.5 py-1.5 mb-2 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-[9px] uppercase font-bold text-[#78847D] block leading-tight">
                            Selected Range
                          </span>
                          <div className="font-semibold text-[11px] text-[#0E3B2E] flex items-center gap-1.5 mt-0.5">
                            <span>{fromDate || 'Select start'}</span>
                            <span className="text-[#78847D]">→</span>
                            <span>{toDate || (fromDate ? 'Select end' : '...')}</span>
                          </div>
                        </div>
                        {(fromDate || toDate) && (
                          <button
                            type="button"
                            onClick={() => {
                              setFromDate('');
                              setToDate('');
                              setHoverDate('');
                            }}
                            className="text-[10px] font-semibold text-[#78847D] hover:text-[#0E3B2E] underline ml-1.5"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      {/* 7-Day Column Headers (Sun-Sat) */}
                      <div className="grid grid-cols-7 gap-y-0.5 text-center mb-0.5">
                        {DAYS_OF_WEEK.map(day => (
                          <div key={day} className="text-[9px] font-bold text-[#78847D] uppercase tracking-wider py-0.5">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid Days */}
                      <div
                        className="grid grid-cols-7 gap-y-0.5 text-center select-none"
                        onMouseLeave={() => setHoverDate('')}
                      >
                        {calendarDays.map(({ dateStr, day, isCurrentMonth }) => {
                          const activeStart = fromDate;
                          const activeEnd = toDate || (fromDate && hoverDate && hoverDate >= fromDate ? hoverDate : '');

                          const isStart = dateStr === fromDate;
                          const isEnd = Boolean(
                            (toDate && dateStr === toDate) ||
                            (!toDate && hoverDate && hoverDate >= fromDate && dateStr === hoverDate)
                          );
                          const isBetween = Boolean(
                            activeStart && activeEnd && dateStr > activeStart && dateStr < activeEnd
                          );

                          return (
                            <div
                              key={dateStr}
                              className={`relative flex items-center justify-center h-7 ${isBetween ? 'bg-[#1B6B50]/15' : ''
                                } ${isStart && activeEnd && activeEnd > activeStart ? 'rounded-l-full bg-gradient-to-r from-transparent to-[#1B6B50]/15' : ''
                                } ${isEnd && activeStart && activeEnd > activeStart ? 'rounded-r-full bg-gradient-to-l from-transparent to-[#1B6B50]/15' : ''
                                }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleDateClick(dateStr)}
                                onMouseEnter={() => handleDateHover(dateStr)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-colors ${isStart || isEnd
                                  ? 'bg-[#0E3B2E] text-white font-bold shadow-xs ring-1 ring-[#0E3B2E]'
                                  : isBetween
                                    ? 'text-[#0E3B2E] font-semibold'
                                    : isCurrentMonth
                                      ? 'text-[#202B27] hover:bg-[#E2E9E3]/70 font-medium'
                                      : 'text-[#B5BFB9] hover:bg-[#E2E9E3]/50'
                                  }`}
                                title={dateStr}
                              >
                                {day}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Popover Footer Controls */}
                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#E2E9E3]">
                        <button
                          type="button"
                          onClick={handleResetDateFilter}
                          className="text-[11px] font-semibold text-[#78847D] hover:text-[#0E3B2E] px-2 py-1 rounded-md hover:bg-[#E2E9E3]/40 transition-colors"
                        >
                          Clear Filter
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyDateFilter}
                          disabled={!fromDate}
                          className="text-[11px] font-bold text-[#FFFFFF] bg-[#0E3B2E] hover:bg-[#1B6B50] disabled:opacity-40 disabled:cursor-not-allowed px-3.5 py-1 rounded-md shadow-xs transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Compact Export CSV Icon Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-2.5 rounded-xl border border-[#E2E9E3] bg-[#F7F5EF]/70 hover:bg-[#F7F5EF] text-[#123C32] hover:border-[#1B6B50] transition-all flex items-center justify-center shadow-xs shrink-0"
                title={tableFilter === 'manager' ? "Export Reward Claims (CSV)" : "Export Referral Bonus Payouts (CSV)"}
                aria-label={tableFilter === 'manager' ? "Export Reward Claims (CSV)" : "Export Referral Bonus Payouts (CSV)"}
              >
                <Download className="w-4 h-4 text-[#123C32]" />
              </button>
            </div>

            {/* TAB 1: MANAGER CLAIMS & DISBURSEMENTS TABLE */}
            {tableFilter === 'manager' && (
              <div className="overflow-x-auto rounded-b-2xl">
                <table className="w-full min-w-[820px] text-left text-xs">
                  <thead>
                    <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-left whitespace-nowrap min-w-[140px]">Manager</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[105px]">Payout Date</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-right whitespace-nowrap min-w-[110px]">Prev. Balance</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-left min-w-[190px] sm:min-w-[240px]">Selected Reward</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-right whitespace-nowrap min-w-[105px]">Reward Value</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-right whitespace-nowrap min-w-[105px]">Left Balance</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[95px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E9E3]">
                    {filteredClaims.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#78847D] text-xs">
                          <p>No reward claims found matching your filters.</p>
                          {(search || hasActiveDateFilter) && (
                            <button
                              onClick={() => {
                                setSearch('');
                                handleResetDateFilter();
                              }}
                              className="mt-2 inline-block text-xs font-semibold text-[#0E3B2E] hover:underline"
                            >
                              Reset search & date filters
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredClaims.map(claim => {
                        const { totalBalance, remainingBalance } = getClaimBalances(claim);
                        const manager = allManagers.find(m => m.id === claim.managerId);
                        const managerCode = manager?.referralCode || '1001';

                        return (
                          <tr key={claim.id} className="border-b border-[#E2E9E3] hover:bg-[#F7F5EF] transition-colors">
                            {/* 1. Manager (left-aligned, single line name) */}
                            <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-left whitespace-nowrap min-w-[140px]">
                              <div className="font-bold text-[#123C32] whitespace-nowrap">{claim.managerName}</div>
                              <div className="text-[11px] text-[#78847D] mt-0.5 whitespace-nowrap">
                                Code: <span className="font-mono font-semibold text-[#1B6B50]">{managerCode}</span>
                              </div>
                            </td>

                            {/* 2. Payout Date (center-aligned, single line) */}
                            <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[105px]">
                              <span className="font-mono text-xs text-[#202B27] font-medium">{claim.claimedDate}</span>
                            </td>

                            {/* 3. Prev. Balance (right-aligned, clean numeric currency) */}
                            <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-right whitespace-nowrap min-w-[110px]">
                              <span className="font-bold text-[#123C32] text-sm">
                                ₹{totalBalance.toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* 4. Selected Reward (left-aligned, readable width, clean line wrapping) */}
                            <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-left min-w-[190px] sm:min-w-[240px]">
                              <div className="font-semibold text-[#202B27] leading-snug break-words">
                                {claim.rewardTitle}
                              </div>
                            </td>

                            {/* 5. Reward Value (right-aligned, clean numeric currency) */}
                            <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-right whitespace-nowrap min-w-[105px]">
                              <span className="font-bold text-[#1B6B50] text-sm">
                                ₹{claim.requiredAmount.toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* 6. Left Balance (right-aligned, clean numeric currency) */}
                            <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-right whitespace-nowrap min-w-[105px]">
                              <span className="font-extrabold text-[#21865A] text-sm">
                                ₹{remainingBalance.toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* 7. Status (center-aligned) */}
                            <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[95px]">
                              <span className="inline-flex items-center text-[11px] font-bold bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-2.5 py-1 rounded-full">
                                Completed
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: REFERRAL MANAGEMENT (FIRST-REFERRAL BONUS PAYOUTS TABLE) */}
            {tableFilter === 'referral' && (
              <div className="overflow-x-auto rounded-b-2xl">
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead>
                    <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-left whitespace-nowrap min-w-[150px]">Beneficiary Manager</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[105px]">Payout Date</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-left min-w-[150px]">Referred Manager</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[110px]">Bonus Amount</th>
                      <th className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[100px]">Payout Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E9E3]">
                    {filteredReferralRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#78847D] text-xs">
                          <p>No referral bonus payout records found matching your filters.</p>
                          {(search || hasActiveDateFilter) && (
                            <button
                              onClick={() => {
                                setSearch('');
                                handleResetDateFilter();
                              }}
                              className="mt-2 inline-block text-xs font-semibold text-[#0E3B2E] hover:underline"
                            >
                              Reset search & date filters
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredReferralRecords.map(rec => (
                        <tr key={rec.id} className="border-b border-[#E2E9E3] hover:bg-[#F7F5EF] transition-colors">
                          {/* 1. Beneficiary Manager (left-aligned, single line name) */}
                          <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-left whitespace-nowrap min-w-[150px]">
                            <div className="font-bold text-[#123C32] whitespace-nowrap">{rec.beneficiaryName}</div>
                            <div className="text-[11px] text-[#78847D] mt-0.5 whitespace-nowrap">
                              Code: <span className="font-mono font-semibold text-[#1B6B50]">{rec.beneficiaryCode}</span>
                            </div>
                          </td>

                          {/* 2. Payout Date (center-aligned) */}
                          <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[105px]">
                            <span className="font-mono text-xs text-[#202B27] font-medium">{rec.payoutDate}</span>
                          </td>

                          {/* 3. Referred Manager (left-aligned) */}
                          <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-left min-w-[150px]">
                            <div className="font-semibold text-[#202B27]">{rec.referredName}</div>
                            <div className="text-[11px] text-[#78847D] mt-0.5">
                              Code: <span className="font-mono text-[#D5AE62] font-semibold">{rec.referredCode}</span>
                            </div>
                          </td>

                          {/* 4. Bonus Amount (center-aligned) */}
                          <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[110px]">
                            <span className="font-extrabold text-[#D5AE62] text-sm">
                              ₹{rec.bonusAmount.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* 5. Payout Status (center-aligned) */}
                          <td className="py-3.5 px-4 sm:py-4 sm:px-5 text-center whitespace-nowrap min-w-[100px]">
                            <span className="inline-flex items-center text-[11px] font-bold bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-2.5 py-1 rounded-full">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

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
