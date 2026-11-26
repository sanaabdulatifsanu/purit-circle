import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Download, 
  Users, 
  Store, 
  Gift, 
  CheckCircle2, 
  Check, 
  TrendingUp,
  Wallet
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { allManagers, restaurants, salesTransactions, rewardClaims } = useApp();
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`${filename}.csv generated and downloaded successfully!`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleExportManagers = () => {
    const headers = [
      'Manager ID', 
      'Manager Name', 
      'Referral Code', 
      'Mobile', 
      'Email', 
      'Referred By Code', 
      'Status', 
      'Referred Restaurants Count', 
      'Total Sales Generated (INR)', 
      'Wallet Balance (INR)', 
      'Total Rewards Earned (INR)'
    ];
    const rows = allManagers.map(m => [
      m.id,
      m.name,
      m.referralCode,
      m.mobile,
      m.email,
      m.referredByCode || 'N/A',
      m.status,
      m.referredRestaurantsCount,
      m.totalSalesGenerated,
      m.walletBalance,
      m.totalRewardsEarned
    ]);
    downloadCSV('Managers_Master_Report', headers, rows);
  };

  const handleExportRestaurantsSales = () => {
    const headers = [
      'Restaurant ID',
      'Restaurant Name',
      'Owner / Contact',
      'Mobile',
      'City',
      'Category',
      'Referring Manager Name',
      'Referring Manager Code',
      'Mapped Purity Customer ID',
      'Status',
      'Monthly Sales (INR)',
      'Total Lifetime Sales (INR)',
      'Total Rewards Generated (INR)',
      'Submission Date'
    ];
    const rows = restaurants.map(r => [
      r.id,
      r.restaurantName,
      r.ownerName || r.contactPerson,
      r.mobile,
      r.city,
      r.category,
      r.managerName,
      r.managerReferralCode || '1001',
      r.mappedPurityId || 'Unmapped',
      r.status,
      r.monthlySales,
      r.totalSales,
      r.totalRewardsGenerated,
      r.submissionDate
    ]);
    downloadCSV('Restaurants_Sales_Sync_Report', headers, rows);
  };

  const handleExportRewardsPayouts = () => {
    const headers = [
      'Claim ID',
      'Disbursement Reference',
      'Manager Name',
      'Manager Mobile',
      'Redemption Reward Item',
      'Category',
      'Disbursed Amount (INR)',
      'Settlement Date',
      'Status',
      'Banking / Shipping Notes'
    ];
    const rows = rewardClaims.map(c => [
      c.id,
      c.payoutReference || 'Pending UTR',
      c.managerName,
      c.managerMobile,
      c.rewardTitle,
      c.rewardCategory,
      c.requiredAmount,
      c.claimedDate,
      c.status,
      c.notes || ''
    ]);
    downloadCSV('Rewards_Payouts_Settlement_Report', headers, rows);
  };

  const reportCards = [
    {
      id: 'managers',
      title: 'Managers Master Report',
      category: 'Partner Network',
      description: 'Comprehensive directory of all registered managers, referral links, account status, and wallet balances.',
      metric: `${allManagers.length} Registered Managers`,
      icon: Users,
      iconColor: 'text-[#1B6B50]',
      bgColor: 'bg-[#1B6B50]/10',
      action: handleExportManagers
    },
    {
      id: 'restaurants-sales',
      title: 'Restaurants & Sales Report',
      category: 'Outlets & Orders',
      description: 'Complete breakdown of referred outlets, external Purity customer IDs, active statuses, and synchronized sales order volumes.',
      metric: `${restaurants.length} Outlets Recorded`,
      icon: Store,
      iconColor: 'text-[#123C32]',
      bgColor: 'bg-[#123C32]/10',
      action: handleExportRestaurantsSales
    },
    {
      id: 'rewards-payouts',
      title: 'Rewards & Payouts Report',
      category: 'Ledger & Disbursements',
      description: 'Detailed records of redeemed rewards, cash NEFT disbursements, UTR settlement reference IDs, and processing statuses.',
      metric: `${rewardClaims.length} Claims & Settlements`,
      icon: Gift,
      iconColor: 'text-[#D5AE62]',
      bgColor: 'bg-[#D5AE62]/20',
      action: handleExportRewardsPayouts
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#1B6B50]" /> Administrative Analytics & Reports
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Export operational, financial, and synchronization reports in standard CSV format.
          </p>
        </div>

        <button 
          onClick={handleExportRestaurantsSales}
          className="btn-primary text-xs flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-[#D5AE62]" /> Export Master CSV Summary
        </button>
      </div>

      {/* Download Feedback Notification */}
      {downloadToast && (
        <div className="bg-[#21865A]/10 border border-[#21865A]/30 text-[#21865A] p-4 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#21865A] shrink-0" />
          <span className="font-semibold">{downloadToast}</span>
        </div>
      )}

      {/* 3 Clean Report Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reportCards.map((rep) => {
          const Icon = rep.icon;
          return (
            <div 
              key={rep.id} 
              className="purity-card p-5 flex flex-col justify-between hover:border-[#1B6B50] hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${rep.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${rep.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2.5 py-0.5 rounded-full">
                    {rep.metric}
                  </span>
                </div>

                <div className="text-[10px] uppercase font-bold tracking-wider text-[#78847D] mb-1">
                  {rep.category}
                </div>
                <h3 className="text-sm font-bold text-[#123C32]">{rep.title}</h3>
                <p className="text-xs text-[#78847D] mt-1.5 leading-relaxed">{rep.description}</p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#E2E9E3] flex items-center justify-between">
                <span className="text-[11px] text-[#78847D] font-medium">Format: .CSV</span>
                <button 
                  onClick={rep.action}
                  className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
                >
                  <Download className="w-3.5 h-3.5 text-[#123C32]" />
                  Download CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
