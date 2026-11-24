import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Download, FileText, Calendar, Filter } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { allManagers, restaurants, salesTransactions } = useApp();

  const reportTypes = [
    {
      title: 'Restaurant-Wise Sales Sync Report',
      desc: 'All mapped restaurants, synced invoice dates, Purity external IDs, and order values.',
      records: `${restaurants.length} Outlets`,
    },
    {
      title: 'Manager Commission & Earnings Report',
      desc: 'Itemized sales rewards, direct referral ₹2,000 bonuses, and current wallet balances.',
      records: `${allManagers.length} Managers`,
    },
    {
      title: 'TDS & Payout Compliance Statement',
      desc: 'Tax deducted at source on cash redemptions and gross payout audit records.',
      records: 'FY 2026-27',
    },
    {
      title: 'Purity API Synchronization Audit Log',
      desc: 'Hourly sync logs, delta change receipts, and webhook status payloads.',
      records: '100% Success Rate',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#1B6B50]" /> Administrative Analytics & Reports
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Export comprehensive financial, operational, and Purity synchronization reports (PRD Section 17).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((rep, idx) => (
          <div key={idx} className="purity-card p-5 flex flex-col justify-between hover:border-[#123C32] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded">
                  {rep.records}
                </span>
                <FileText className="w-4 h-4 text-[#78847D]" />
              </div>
              <h3 className="text-sm font-bold text-[#123C32]">{rep.title}</h3>
              <p className="text-xs text-[#78847D] mt-1.5 leading-relaxed">{rep.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E9E3] flex justify-end">
              <button 
                onClick={() => alert(`Exporting ${rep.title} (CSV)...`)}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#123C32]" />
                Download Report (.CSV)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
