import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Link as LinkIcon, 
  MapPin, 
  X,
  AlertTriangle,
  RefreshCw,
  Menu
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { RestaurantReferral } from '../../types';

interface AdminReferredRestaurantsProps {
  onToggleSidebar?: () => void;
}

export const AdminReferredRestaurants: React.FC<AdminReferredRestaurantsProps> = ({ onToggleSidebar }) => {
  const { 
    restaurants, 
    approveRestaurant, 
    rejectRestaurant, 
    toggleRestaurantStatus 
  } = useApp();

  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Mapping modal state
  const [mappingTarget, setMappingTarget] = useState<RestaurantReferral | null>(null);
  const [purityCustomerId, setPurityCustomerId] = useState('');

  // Rejection modal state
  const [rejectTarget, setRejectTarget] = useState<RestaurantReferral | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

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

  const handleApproveAndMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mappingTarget) return;

    approveRestaurant(mappingTarget.id, purityCustomerId || mappingTarget.existingPurityCustomerId || 'PUR-MAN-1092');
    setMappingTarget(null);
    setPurityCustomerId('');
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget) return;

    rejectRestaurant(rejectTarget.id, rejectionReason || 'Duplicate or non-qualifying business.');
    setRejectTarget(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-4 sm:p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar} 
              className="lg:hidden p-2 text-[#78847D] hover:text-[#123C32] bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl hover:bg-[#F7F5EF] transition-colors shadow-xs shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
              <Store className="w-6 h-6 text-[#1B6B50]" />
              <span className="md:hidden">Referred Restaurants</span>
              <span className="hidden md:inline">Referred Restaurants Directory & Mapping</span>
            </h1>
            <p className="text-xs text-[#78847D] mt-1">
              Review manager submissions, verify duplicate records, and map approved restaurants to Purity Website IDs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#78847D] bg-[#F7F5EF] px-3 py-1.5 rounded-xl border border-[#E2E9E3]">
            {restaurants.length} Total Referred Outlets
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl p-3 shadow-xs">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#F7F5EF] p-1 rounded-lg border border-[#E2E9E3] text-xs">
          {[
            { id: 'all', label: `All (${restaurants.length})` },
            { id: 'pending', label: `Pending Approvals (${restaurants.filter(r => r.status === 'pending').length})` },
            { id: 'approved', label: 'Approved & Mapped' },
            { id: 'rejected', label: 'Rejected' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id as any)}
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

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search restaurant or manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Verification Notice Banner if pending items exist */}
      {restaurants.filter(r => r.status === 'pending').length > 0 && tabFilter !== 'pending' && (
        <div className="bg-[#D99A32]/10 border border-[#D99A32]/30 rounded-xl p-3 flex items-center justify-between text-xs text-[#123C32]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D99A32] shrink-0" />
            <span>
              <strong>{restaurants.filter(r => r.status === 'pending').length} restaurant leads</strong> require admin verification & mapping to official Purity IDs.
            </span>
          </div>
          <button 
            onClick={() => setTabFilter('pending')}
            className="text-[11px] font-bold text-[#1B6B50] hover:underline shrink-0"
          >
            Review Pending →
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Restaurant Details</th>
                <th className="py-3 px-4">Referring Manager</th>
                <th className="py-3 px-4">Purity Customer ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Lifetime Sales</th>
                <th className="py-3 px-4 text-center">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filtered.map(rest => (
                <tr key={rest.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#123C32]">{rest.restaurantName}</div>
                    <div className="text-[11px] text-[#78847D] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#1B6B50] shrink-0" />
                      <span>{rest.address}, {rest.city}</span>
                    </div>
                    <div className="text-[10px] text-[#78847D] mt-0.5">
                      Contact: {rest.contactPerson} ({rest.mobile}) • Submitted {rest.submissionDate}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#123C32] block">{rest.managerName}</span>
                    <span className="text-[10px] font-mono text-[#1B6B50] font-semibold bg-[#1B6B50]/10 px-1.5 py-0.5 rounded">
                      Code: {rest.managerReferralCode || 'A1001'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {rest.mappedPurityId ? (
                      <span className="font-mono font-semibold text-[#123C32] bg-[#123C32]/5 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-[#1B6B50]" />
                        {rest.mappedPurityId}
                      </span>
                    ) : (
                      <span className="text-[#D99A32] italic font-medium">Unmapped</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <Badge status={rest.status} size="sm" />
                    {rest.status === 'rejected' && rest.rejectionReason && (
                      <span className="text-[10px] text-[#D9534F] block mt-0.5 truncate max-w-xs">
                        {rest.rejectionReason}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="font-bold text-[#123C32]">₹{rest.totalSales.toLocaleString('en-IN')}</div>
                    {rest.status === 'active' && (
                      <span className="text-[10px] text-[#21865A] font-medium block">Active Sales Sync</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {rest.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setMappingTarget(rest);
                            setPurityCustomerId(rest.existingPurityCustomerId || '');
                          }}
                          className="px-2.5 py-1 rounded bg-[#21865A] hover:bg-[#1B6B50] text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                          title="Verify lead and map to official Purity Customer Account"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve &amp; Map
                        </button>
                        <button
                          onClick={() => {
                            setRejectTarget(rest);
                            setRejectionReason('');
                          }}
                          className="p-1 rounded bg-[#D9534F]/10 hover:bg-[#D9534F]/20 text-[#D9534F] text-[11px] transition-colors"
                          title="Reject duplicate or invalid referral"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : rest.status === 'active' || rest.status === 'inactive' ? (
                      <div className="flex items-center justify-center gap-2">
                        {!rest.mappedPurityId && (
                          <button
                            onClick={() => {
                              setMappingTarget(rest);
                              setPurityCustomerId(rest.existingPurityCustomerId || '');
                            }}
                            className="text-[11px] text-[#1B6B50] hover:underline font-semibold flex items-center gap-1"
                          >
                            <LinkIcon className="w-3 h-3" /> Map to Core
                          </button>
                        )}
                        <button
                          onClick={() => toggleRestaurantStatus(rest.id)}
                          className="text-[11px] text-[#78847D] hover:text-[#123C32] flex items-center gap-1"
                          title="Toggle active / suspended order sync"
                        >
                          <RefreshCw className="w-3 h-3" />
                          {rest.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#78847D] italic">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVAL & PURITY MAPPING MODAL (PRD Section 7 & 8) */}
      {mappingTarget && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-md w-full p-6 shadow-elevated relative">
            <button 
              onClick={() => setMappingTarget(null)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#123C32] mb-1">
              Approve &amp; Map to Purity Core
            </h3>
            <p className="text-xs text-[#78847D] mb-4">
              Connecting <span className="font-bold text-[#123C32]">{mappingTarget.restaurantName}</span> with official Purity Customer Account.
            </p>

            <form onSubmit={handleApproveAndMap} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1">
                  Purity Customer ID / External Key:
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. PUR-BLR-0492"
                  value={purityCustomerId}
                  onChange={e => setPurityCustomerId(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none uppercase font-mono"
                />
                <span className="text-[10px] text-[#78847D] mt-1 block">
                  Once mapped, incoming orders for this Customer ID will attribute rewards to {mappingTarget.managerName}.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E9E3]">
                <button 
                  type="button" 
                  onClick={() => setMappingTarget(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs"
                >
                  Confirm Approval &amp; Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-md w-full p-6 shadow-elevated relative">
            <button 
              onClick={() => setRejectTarget(null)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#D9534F] mb-1">
              Decline Restaurant Referral
            </h3>
            <p className="text-xs text-[#78847D] mb-4">
              State the reason for rejecting <span className="font-bold text-[#123C32]">{rejectTarget.restaurantName}</span>.
            </p>

            <form onSubmit={handleReject} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1">
                  Rejection Reason:
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="e.g. Duplicate registration detected; direct corporate account already established."
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E9E3]">
                <button 
                  type="button" 
                  onClick={() => setRejectTarget(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#D9534F] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#c94541] transition-colors"
                >
                  Decline Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
