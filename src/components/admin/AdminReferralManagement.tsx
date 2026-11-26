import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { FilterSelect } from '../common/FilterSelect';
import { Badge } from '../common/Badge';
import { Manager } from '../../types';

interface ReferrerGroup {
  referrerCode: string;
  referrerName: string;
  referrerManagerId?: string;
  referredManagers: Manager[];
}

interface AdminReferralManagementProps {
  onSelectProfileManagerId?: (managerId: string) => void;
}

export const AdminReferralManagement: React.FC<AdminReferralManagementProps> = ({
  onSelectProfileManagerId
}) => {
  const { allManagers, restaurants } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Helper to fetch outlets mapped to a manager
  const getOutletsForManager = (mgrId: string, mgrName: string) => {
    return restaurants.filter(
      r => r.managerId === mgrId || (r.managerName && r.managerName.toLowerCase() === mgrName.toLowerCase())
    );
  };

  // All referred managers (nodes that have a referring upline)
  const allReferredManagers = useMemo(() => {
    return allManagers.filter(m => Boolean(m.referredByCode));
  }, [allManagers]);

  // Counts for status filter options
  const activeCount = useMemo(() => {
    return allReferredManagers.filter(m => m.status === 'active').length;
  }, [allReferredManagers]);

  const inactiveCount = useMemo(() => {
    return allReferredManagers.filter(m => m.status === 'inactive').length;
  }, [allReferredManagers]);

  // Group all referred managers by unique referrer
  const groupedReferrals = useMemo(() => {
    const groupsMap = new Map<string, ReferrerGroup>();

    allManagers.forEach(mgr => {
      if (!mgr.referredByCode) return;

      const refCode = mgr.referredByCode;
      const uplineMgr = allManagers.find(
        m => m.referralCode === refCode || 
        (mgr.referredByName && m.name.toLowerCase() === mgr.referredByName.toLowerCase())
      );
      const refName = mgr.referredByName || uplineMgr?.name || (refCode === '1001' ? 'Initial Manager (Founder Node)' : 'System Manager');

      const isFounderNode = refCode === '1001' || refName.toLowerCase().includes('founder node');
      const referrerManagerId = !isFounderNode && uplineMgr ? uplineMgr.id : undefined;

      if (!groupsMap.has(refCode)) {
        groupsMap.set(refCode, {
          referrerCode: refCode,
          referrerName: refName,
          referrerManagerId,
          referredManagers: []
        });
      }

      groupsMap.get(refCode)!.referredManagers.push(mgr);
    });

    return Array.from(groupsMap.values());
  }, [allManagers]);

  // Filtered groups based on search and status dropdown
  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return groupedReferrals
      .map(group => {
        // Filter referred managers by status
        let matchingManagers = group.referredManagers;
        if (statusFilter !== 'all') {
          matchingManagers = matchingManagers.filter(m => m.status === statusFilter);
        }

        // Filter by search query
        if (query) {
          const referrerMatches = 
            group.referrerName.toLowerCase().includes(query) ||
            group.referrerCode.toLowerCase().includes(query);

          if (!referrerMatches) {
            matchingManagers = matchingManagers.filter(m => {
              const matchesBasic = 
                m.name.toLowerCase().includes(query) ||
                m.referralCode.toLowerCase().includes(query);
              if (matchesBasic) return true;
              const outlets = getOutletsForManager(m.id, m.name);
              return outlets.some(o => o.restaurantName.toLowerCase().includes(query));
            });
          }
        }

        return {
          ...group,
          referredManagers: matchingManagers
        };
      })
      .filter(group => group.referredManagers.length > 0);
  }, [groupedReferrals, search, statusFilter, restaurants]);

  return (
    <div className="rounded-2xl border border-[#E2E9E3] bg-white overflow-hidden shadow-subtle">
      {/* Search Bar & Status Filter Header */}
      <div className="flex flex-row items-center justify-between gap-2 md:gap-3 px-4 py-3 border-b border-[#E2E9E3]">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by manager, referrer, code, or outlet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]/50"
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          icon={<Filter className="w-3.5 h-3.5" />}
          ariaLabel="Filter referrals by status"
          className="shrink-0"
          compactMobile
          options={[
            { value: 'all', label: `All Statuses (${allReferredManagers.length})` },
            { value: 'active', label: `Active Only (${activeCount})` },
            { value: 'inactive', label: `Inactive Only (${inactiveCount})` },
          ]}
        />
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-[25%] min-w-[190px]">Referred By (Referrer)</th>
              <th className="py-3.5 px-4 w-[25%] min-w-[180px]">Referred Manager</th>
              <th className="py-3.5 px-4 w-[38%] min-w-[250px]">Referred Outlets</th>
              <th className="py-3.5 px-4 w-[12%] min-w-[100px] text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E9E3]">
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-[#78847D]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-8 h-8 text-[#78847D]/30" />
                    <span className="text-sm font-semibold text-[#123C32]">No referral records found</span>
                    <span className="text-xs text-[#78847D]">
                      Try adjusting your search terms or filter selection.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredGroups.map(group => (
                group.referredManagers.map((mgr, idx) => {
                  const outlets = getOutletsForManager(mgr.id, mgr.name);
                  const isFirst = idx === 0;

                  return (
                    <tr 
                      key={mgr.id} 
                      className="hover:bg-[#F7F5EF]/60 transition-colors"
                    >
                      {/* 1. REFERRED BY (REFERRER) - Spans all referred managers in this group */}
                      {isFirst && (
                        <td 
                          rowSpan={group.referredManagers.length} 
                          className="py-3.5 px-4 align-top border-r border-[#E2E9E3]/40 bg-white"
                        >
                          <div className="font-bold text-[#123C32] flex items-center gap-1.5 flex-wrap">
                            {group.referrerManagerId && onSelectProfileManagerId ? (
                              <button
                                type="button"
                                onClick={() => onSelectProfileManagerId(group.referrerManagerId!)}
                                className="group/name text-left font-bold text-[#123C32] hover:text-[#1B6B50] flex items-center gap-1 transition-colors focus:outline-none"
                                title={`Click to view full manager profile for ${group.referrerName}`}
                              >
                                <span className="group-hover/name:underline underline-offset-2 decoration-[#1B6B50]">
                                  {group.referrerName}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#78847D] opacity-40 group-hover/name:opacity-100 group-hover/name:translate-x-0.5 group-hover/name:text-[#1B6B50] transition-all shrink-0" />
                              </button>
                            ) : (
                              <span>{group.referrerName}</span>
                            )}
                            <span className="font-mono text-[10px] font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-1.5 py-0.5 rounded">
                              ({group.referrerCode})
                            </span>
                          </div>
                        </td>
                      )}

                      {/* 2. REFERRED MANAGER */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-1.5 min-h-[24px] flex-wrap">
                          <span className="font-bold text-[#123C32]">{mgr.name}</span>
                          <span className="font-mono text-[10px] font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-1.5 py-0.5 rounded">
                            ({mgr.referralCode})
                          </span>
                        </div>
                      </td>

                      {/* 3. REFERRED OUTLETS */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center min-h-[24px]">
                          {outlets.length > 0 ? (
                            <span className="text-[#202B27] font-medium text-xs">
                              {outlets[0].restaurantName}
                            </span>
                          ) : (
                            <span className="text-xs text-[#78847D] italic">
                              No restaurant names listed
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. STATUS */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <div className="flex items-center justify-center min-h-[24px]">
                          <Badge status={mgr.status} size="sm" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
