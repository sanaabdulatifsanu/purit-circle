import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, Download, Search, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RewardClaim } from '../../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AdminPayouts: React.FC = () => {
  const { rewardClaims, allManagers } = useApp();
  const [search, setSearch] = useState('');

  // Date Range Popover & Filter States
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [hoverDate, setHoverDate] = useState('');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // Calendar view navigation (defaults to November 2026 where dataset records exist)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10); // 10 = November (0-indexed)

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
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

  // Generate calendar days for current viewMonth and viewYear
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

    // Trailing days from previous month
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

    // Days in current month
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

    // Leading days from next month to complete the row
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
      // Pick start date
      setFromDate(dateStr);
      setToDate('');
      setHoverDate('');
    } else if (fromDate && !toDate) {
      if (dateStr < fromDate) {
        // Earlier date clicked, reset start
        setFromDate(dateStr);
        setToDate('');
        setHoverDate('');
      } else {
        // End date selected
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

  const hasActiveDateFilter = Boolean(appliedFromDate || appliedToDate);

  const handleApplyDateFilter = () => {
    if (!fromDate) return;
    const finalStart = fromDate;
    const finalEnd = toDate || fromDate;
    setAppliedFromDate(finalStart);
    setAppliedToDate(finalEnd);
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

  const filteredPayouts = rewardClaims.filter(claim => {
    const matchesSearch = 
      claim.managerName.toLowerCase().includes(search.toLowerCase()) ||
      claim.rewardTitle.toLowerCase().includes(search.toLowerCase()) ||
      (claim.payoutReference && claim.payoutReference.toLowerCase().includes(search.toLowerCase()));

    const claimDate = claim.claimedDate.trim().split(' ')[0];
    const matchesFrom = !appliedFromDate || claimDate >= appliedFromDate;
    const matchesTo = !appliedToDate || claimDate <= appliedToDate;
    const matchesDate = matchesFrom && matchesTo;

    return matchesSearch && matchesDate;
  });

  const handleExportCSV = () => {
    const headers = [
      'Manager Name',
      'Manager Code',
      'Total Balance Before Redemption (INR)',
      'Selected Reward',
      'Reward Value (INR)',
      'Date',
      'Remaining Balance (INR)',
      'Status'
    ];
    const rows = filteredPayouts.map(claim => {
      const { totalBalance, remainingBalance } = getClaimBalances(claim);
      const manager = allManagers.find(m => m.id === claim.managerId);
      return [
        claim.managerName,
        manager?.referralCode || '1001',
        totalBalance,
        claim.rewardTitle,
        claim.requiredAmount,
        claim.claimedDate,
        remainingBalance,
        claim.status
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
    link.setAttribute('download', `Payout_Disbursement_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header (sitting directly on cream page background; rendered inline with menu toggle below lg) */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
          <FileCheck2 className="hidden sm:block w-6 h-6 text-[#1B6B50]" /> Payout & Disbursement Records
        </h1>
      </div>

      {/* Unified Card Container: Search & Filter Controls + Payouts Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl shadow-subtle relative">
        {/* Controls Row: Search bar, Calendar Popover trigger, and Compact Export button at top of card */}
        <div className="p-4 border-b border-[#E2E9E3] flex items-center gap-2.5 sm:gap-3 bg-[#FFFFFF] rounded-t-2xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by manager name, selected reward, or UTR..."
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

          {/* Compact Calendar Icon Trigger Button (No Extra Text) */}
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
              className={`relative p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                hasActiveDateFilter
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
                        className={`relative flex items-center justify-center h-7 ${
                          isBetween ? 'bg-[#1B6B50]/15' : ''
                        } ${
                          isStart && activeEnd && activeEnd > activeStart ? 'rounded-l-full bg-gradient-to-r from-transparent to-[#1B6B50]/15' : ''
                        } ${
                          isEnd && activeStart && activeEnd > activeStart ? 'rounded-r-full bg-gradient-to-l from-transparent to-[#1B6B50]/15' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleDateClick(dateStr)}
                          onMouseEnter={() => handleDateHover(dateStr)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-colors ${
                            isStart || isEnd
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

          {/* Compact Export Icon Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="p-2.5 rounded-xl border border-[#E2E9E3] bg-[#F7F5EF]/70 hover:bg-[#F7F5EF] text-[#123C32] hover:border-[#1B6B50] transition-all flex items-center justify-center shadow-xs shrink-0"
            title="Export Bank Payout File (CSV)"
            aria-label="Export Bank Payout File (CSV)"
          >
            <Download className="w-4 h-4 text-[#123C32]" />
          </button>
        </div>

        {/* 5-Column Payouts Table */}
        <div className="overflow-x-auto rounded-b-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-5">Manager</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Selected Reward</th>
                <th className="py-3.5 px-5 text-right">Total Balance</th>
                <th className="py-3.5 px-5 text-right">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#78847D] text-xs">
                    <p>No payout records found matching your filters.</p>
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
                filteredPayouts.map(claim => {
                  const { totalBalance, remainingBalance } = getClaimBalances(claim);
                  const manager = allManagers.find(m => m.id === claim.managerId);
                  const managerCode = manager?.referralCode || '1001';

                  return (
                    <tr key={claim.id} className="hover:bg-[#F7F5EF] transition-colors">
                      {/* 1. Manager */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#123C32]">{claim.managerName}</div>
                        <div className="text-[11px] text-[#78847D] mt-0.5">
                          Code: <span className="font-mono font-semibold text-[#1B6B50]">{managerCode}</span>
                        </div>
                      </td>

                      {/* 2. Date */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-xs text-[#202B27] font-medium">{claim.claimedDate}</span>
                      </td>

                      {/* 3. Selected Reward (chosen reward name and its ₹ value) */}
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-[#202B27] max-w-sm">{claim.rewardTitle}</div>
                        <div className="hidden sm:flex text-[11px] font-bold text-[#1B6B50] mt-0.5 items-center gap-1.5">
                          <span>₹{claim.requiredAmount.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] font-normal text-[#78847D]">value</span>
                        </div>
                      </td>

                      {/* 4. Total Balance (available before redemption) */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="font-bold text-[#123C32] text-sm">
                          ₹{totalBalance.toLocaleString('en-IN')}
                        </div>
                        <span className="hidden sm:block text-[10px] text-[#78847D]">Before Redemption</span>
                      </td>

                      {/* 5. Remaining Balance (remaining reward balance after deducting selected reward) */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="font-extrabold text-[#21865A] text-sm">
                          ₹{remainingBalance.toLocaleString('en-IN')}
                        </div>
                        <span className="hidden sm:block text-[10px] text-[#21865A]/80">After Deduction</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
