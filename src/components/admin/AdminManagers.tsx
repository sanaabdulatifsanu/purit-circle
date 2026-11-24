import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminManagers: React.FC = () => {
  const { allManagers, toggleManagerStatus } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredManagers = allManagers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.referralCode.toLowerCase().includes(search.toLowerCase()) ||
                          m.mobile.includes(search);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1B6B50]" /> Manager Management
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Oversee all registered managers, referral relationships, account statuses, and performance.
          </p>
        </div>

        <div className="text-xs text-[#78847D] bg-[#F7F5EF] px-3.5 py-1.5 rounded-xl border border-[#E2E9E3]">
          Initial System Manager Code: <span className="font-mono font-bold text-[#123C32]">1001</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search manager by name, mobile, or referral code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#78847D]" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-[#FFFFFF] border border-[#E2E9E3] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#123C32]"
          >
            <option value="all">All Statuses ({allManagers.length})</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Managers Table */}
      <div className="purity-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Manager Name</th>
                <th className="py-3 px-4">Unique Code</th>
                <th className="py-3 px-4">Referred By</th>
                <th className="py-3 px-4">Referred Restaurants</th>
                <th className="py-3 px-4 text-right">Generated Sales</th>
                <th className="py-3 px-4 text-right">Wallet Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filteredManagers.map(mgr => (
                <tr key={mgr.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#123C32]">{mgr.name}</div>
                    <div className="text-[10px] text-[#78847D]">{mgr.mobile} • {mgr.email}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded">
                      {mgr.referralCode}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-[#202B27]">{mgr.referredByName || 'Root System'}</span>
                    <span className="text-[10px] font-mono text-[#78847D] block">({mgr.referredByCode || '1001'})</span>
                  </td>

                  <td className="py-3 px-4 font-medium text-[#202B27]">
                    {mgr.referredRestaurantsCount} outlets
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-[#123C32]">
                    ₹{mgr.totalSalesGenerated.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-[#D5AE62]">
                    ₹{mgr.walletBalance.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <Badge status={mgr.status} size="sm" />
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleManagerStatus(mgr.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                        mgr.status === 'active' 
                          ? 'border-[#D9534F]/30 text-[#D9534F] hover:bg-[#D9534F]/10' 
                          : 'border-[#21865A]/30 text-[#21865A] hover:bg-[#21865A]/10'
                      }`}
                    >
                      {mgr.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
