import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Search, 
  MapPin,
  Filter,
  Check
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AdminReferredRestaurants: React.FC = () => {
  const { restaurants } = useApp();

  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const mobileFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileFilterOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (mobileFilterRef.current && !mobileFilterRef.current.contains(event.target as Node)) {
        setIsMobileFilterOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileFilterOpen]);

  const filterTabs = [
    { id: 'all', label: `All (${restaurants.length})` },
    { id: 'pending', label: `Pending Approvals (${restaurants.filter(r => r.status === 'pending').length})` },
    { id: 'approved', label: 'Approved & Mapped' },
    { id: 'rejected', label: 'Rejected' },
  ] as const;

  const filtered = restaurants.filter(r => {
    const matchesSearch = r.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
                          r.managerName.toLowerCase().includes(search.toLowerCase()) ||
                          r.city.toLowerCase().includes(search.toLowerCase()) ||
                          (r.mappedPurityId && r.mappedPurityId.toLowerCase().includes(search.toLowerCase()));
    const matchesTab = tabFilter === 'all' || 
                       (tabFilter === 'pending' && r.status === 'pending') ||
                       (tabFilter === 'approved' && (r.status === 'active' || r.status === 'inactive')) ||
                       (tabFilter === 'rejected' && r.status === 'rejected');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
          <span className="hidden md:inline-flex shrink-0">
            <Store className="w-6 h-6 text-[#1B6B50]" />
          </span>
          <span className="md:hidden">Referred Restaurants</span>
          <span className="hidden md:inline">Referred Restaurants Directory &amp; Mapping</span>
        </h1>

        <div className="hidden md:flex items-center gap-2">
          <span className="hidden md:inline-flex text-xs text-[#78847D] bg-[#FFFFFF] px-3 py-1.5 rounded-xl border border-[#E2E9E3] shadow-xs">
            {restaurants.length} Total Referred Outlets
          </span>
        </div>
      </div>

      {/* Unified Search/Filter & Table Card */}
      <div className="rounded-2xl border border-[#E2E9E3] bg-white shadow-subtle">
        {/* Search & Tabs */}
        <div className="flex flex-row items-center justify-between gap-2 md:gap-3 px-4 py-3 border-b border-[#E2E9E3]">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search restaurant or manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]/50"
            />
          </div>

          {/* Mobile Filter Icon Dropdown */}
          <div ref={mobileFilterRef} className="relative md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(prev => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isMobileFilterOpen}
              aria-label="Filter referred restaurants"
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#113D2E]/25 ${
                tabFilter !== 'all'
                  ? 'bg-[#113D2E] border-[#113D2E] text-[#FFFEFA] shadow-subtle'
                  : isMobileFilterOpen
                  ? 'bg-[#F7F5EF] border-[#113D2E]/40 text-[#113D2E] shadow-card'
                  : 'bg-[#FFFEFA] hover:bg-[#F7F5EF] border-[#113D2E]/15 text-[#113D2E] shadow-subtle'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            <div
              role="listbox"
              aria-label="Filter referred restaurants"
              aria-hidden={!isMobileFilterOpen}
              className={`absolute right-0 mt-2 w-52 p-1.5 rounded-xl bg-[#FFFEFA] border border-[#113D2E]/15 shadow-elevated z-50 origin-top-right transition-all duration-150 ease-out ${
                isMobileFilterOpen
                  ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-1 invisible pointer-events-none'
              }`}
            >
              <div className="space-y-0.5">
                {filterTabs.map(tab => {
                  const isSelected = tabFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={isMobileFilterOpen ? 0 : -1}
                      onClick={() => {
                        setTabFilter(tab.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors duration-150 focus:outline-none ${
                        isSelected
                          ? 'bg-[#113D2E] text-[#FFFEFA] font-semibold shadow-subtle'
                          : 'text-[#202B27] hover:bg-[#113D2E]/10 hover:text-[#113D2E] font-medium'
                      }`}
                    >
                      <span className="truncate">{tab.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FFFEFA] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="hidden md:flex flex-wrap items-center gap-1 bg-[#F7F5EF] p-1 rounded-lg border border-[#E2E9E3] text-xs shrink-0">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  tabFilter === tab.id 
                    ? 'bg-[#123C32] text-white shadow-xs font-semibold' 
                    : 'text-[#78847D] hover:text-[#123C32]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-b-2xl">
          <table className="w-full min-w-[680px] table-fixed text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-[40%]">Restaurant Details</th>
                <th className="py-3.5 px-4 w-[24%]">Referring Manager</th>
                <th className="py-3.5 px-4 w-[16%] text-right">Lifetime Sales</th>
                <th className="py-3.5 px-4 w-[20%] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filtered.map(rest => (
                <tr key={rest.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#123C32]">{rest.restaurantName}</div>
                    <div className="text-[11px] text-[#78847D] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#1B6B50] shrink-0" />
                      <span className="truncate">{rest.address}, {rest.city}</span>
                    </div>
                    <div className="text-[10px] text-[#78847D] truncate">
                      {rest.mobile}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#123C32] block truncate">{rest.managerName}</span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-[#123C32]">
                    ₹{rest.totalSales.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Badge status={rest.status} size="sm" />
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#78847D]">
                    <p className="font-medium text-sm">No referred restaurants found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or filter selection.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
