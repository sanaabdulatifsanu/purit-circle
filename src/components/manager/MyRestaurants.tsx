import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  PlusCircle, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  FileText, 
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { RestaurantReferral } from '../../types';

export const MyRestaurants: React.FC = () => {
  const { currentManager, restaurants, salesTransactions, addRestaurantReferral } = useApp();

  // Scoped strictly to current manager
  const myRestaurants = restaurants.filter(r => r.managerId === currentManager.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending' | 'rejected'>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantReferral | null>(null);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '',
    gstNumber: '',
    category: 'Casual Dining' as RestaurantReferral['category'],
    existingPurityCustomerId: '',
    remarks: ''
  });

  const filteredRestaurants = myRestaurants.filter(r => {
    const matchesSearch = r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.mappedPurityId && r.mappedPurityId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const result = addRestaurantReferral(formData);
    if (result.success) {
      setFormFeedback({ type: 'success', message: result.message });
      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormFeedback(null);
        setFormData({
          restaurantName: '',
          ownerName: '',
          contactPerson: '',
          mobile: '',
          email: '',
          address: '',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '',
          gstNumber: '',
          category: 'Casual Dining',
          existingPurityCustomerId: '',
          remarks: ''
        });
      }, 1500);
    } else {
      setFormFeedback({ type: 'error', message: result.message });
    }
  };

  // Find sales transactions for selected restaurant drill-down
  const restaurantSales = selectedRestaurant
    ? salesTransactions.filter(tx => tx.restaurantId === selectedRestaurant.id)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Store className="w-6 h-6 text-[#1B6B50]" /> My Referred Restaurants
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Manage your submitted restaurant leads and track real-time sales synchronized with Purity Core.
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          + Add Restaurant
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E2E9E3] rounded-xl p-3 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by restaurant name, city, or Purity ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#78847D]" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-[#FFFFFF] border border-[#E2E9E3] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#123C32] text-[#202B27]"
          >
            <option value="all">All Statuses ({myRestaurants.length})</option>
            <option value="active">Active</option>
            <option value="pending">Pending Review</option>
            <option value="inactive">Inactive</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Restaurants Table / Grid */}
      <div className="purity-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Restaurant Info</th>
                <th className="py-3 px-4">Purity Customer ID</th>
                <th className="py-3 px-4">Category & City</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Monthly Sales</th>
                <th className="py-3 px-4 text-right">Total Lifetime Sales</th>
                <th className="py-3 px-4 text-right">Total Rewards</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#78847D]">
                    No restaurants match your search or filters. Click "+ Add Restaurant" to refer a new outlet.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map(rest => (
                  <tr 
                    key={rest.id} 
                    className="hover:bg-[#F7F5EF] transition-colors cursor-pointer"
                    onClick={() => setSelectedRestaurant(rest)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#123C32]">{rest.restaurantName}</div>
                      <div className="text-[11px] text-[#78847D] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#1B6B50]" /> {rest.address}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {rest.mappedPurityId ? (
                        <span className="font-mono font-semibold text-[#123C32] bg-[#123C32]/5 px-2 py-0.5 rounded text-[11px]">
                          {rest.mappedPurityId}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#D99A32] italic font-medium">
                          Pending Mapping
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-[#202B27]">{rest.category}</span>
                      <span className="text-[#78847D] block text-[11px]">{rest.city}, {rest.state}</span>
                    </td>

                    <td className="py-3 px-4">
                      <Badge status={rest.status} size="sm" />
                      {rest.status === 'rejected' && rest.rejectionReason && (
                        <span className="text-[10px] text-[#D9534F] block mt-0.5 truncate max-w-xs" title={rest.rejectionReason}>
                          {rest.rejectionReason}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-[#123C32]">
                      ₹{rest.monthlySales.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-[#202B27]">
                      ₹{rest.totalSales.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-[#21865A]">
                      ₹{rest.totalRewardsGenerated.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRestaurant(rest);
                        }}
                        className="p-1.5 rounded-lg text-[#1B6B50] hover:bg-[#1B6B50]/10 transition-colors"
                        title="View Sales Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD RESTAURANT MODAL (PRD Section 7) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-2xl w-full p-6 shadow-elevated my-8 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pb-3 border-b border-[#E2E9E3]">
              <h2 className="text-base font-bold text-[#123C32] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#1B6B50]" /> Submit Restaurant Referral
              </h2>
              <p className="text-xs text-[#78847D] mt-0.5">
                Submit outlet details for Admin verification and automated Purity Customer ID mapping.
              </p>
            </div>

            {formFeedback && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${formFeedback.type === 'success' ? 'bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30' : 'bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/30'}`}>
                {formFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">Restaurant Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Saffron Bistro"
                    value={formData.restaurantName}
                    onChange={e => setFormData({...formData, restaurantName: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">Restaurant Category *</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none bg-white"
                  >
                    <option value="Casual Dining">Casual Dining</option>
                    <option value="Fine Dining">Fine Dining</option>
                    <option value="Cafe">Cafe</option>
                    <option value="QSR">QSR (Quick Service Restaurant)</option>
                    <option value="Hotel">Hotel & Banquet</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">Owner Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Ramesh Patel"
                    value={formData.ownerName}
                    onChange={e => setFormData({...formData, ownerName: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">Contact Person *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Manoj Sharma (Manager)"
                    value={formData.contactPerson}
                    onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">Mobile Number (Duplicate Checked) *</label>
                  <input 
                    type="tel" 
                    required 
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={formData.mobile}
                    onChange={e => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="contact@restaurant.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#202B27] block mb-1">Full Street Address *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Plot/Shop number, Street, Landmark"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">City *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">State *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.state}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">PIN Code *</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    placeholder="e.g. 560001"
                    value={formData.pinCode}
                    onChange={e => setFormData({...formData, pinCode: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">GST Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={e => setFormData({...formData, gstNumber: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1">Existing Purity Customer ID (If known)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PUR-BLR-0492"
                    value={formData.existingPurityCustomerId}
                    onChange={e => setFormData({...formData, existingPurityCustomerId: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#202B27] block mb-1">Remarks / Note for Admin</label>
                <textarea 
                  rows={2}
                  placeholder="Expected monthly tissue / hand wash order volume, special requirements..."
                  value={formData.remarks}
                  onChange={e => setFormData({...formData, remarks: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E9E3]">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs"
                >
                  Submit for Admin Verification
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* RESTAURANT SALES DRILL-DOWN MODAL */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-2xl w-full p-6 shadow-elevated my-8 relative">
            <button 
              onClick={() => setSelectedRestaurant(null)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between pb-4 border-b border-[#E2E9E3]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#123C32]">{selectedRestaurant.restaurantName}</h2>
                  <Badge status={selectedRestaurant.status} size="sm" />
                </div>
                <p className="text-xs text-[#78847D] mt-1">
                  Mapped ID: <span className="font-mono font-semibold text-[#123C32]">{selectedRestaurant.mappedPurityId || 'Unmapped'}</span> • Category: {selectedRestaurant.category}
                </p>
                <p className="text-[11px] text-[#78847D]">
                  Location: {selectedRestaurant.address}, {selectedRestaurant.city}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-[#F7F5EF] p-3 rounded-xl border border-[#E2E9E3] text-center">
                <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider">Monthly Sales</span>
                <span className="text-base font-bold text-[#123C32] block mt-1">
                  ₹{selectedRestaurant.monthlySales.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-[#F7F5EF] p-3 rounded-xl border border-[#E2E9E3] text-center">
                <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider">Total Lifetime Sales</span>
                <span className="text-base font-bold text-[#123C32] block mt-1">
                  ₹{selectedRestaurant.totalSales.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-[#D5AE62]/15 p-3 rounded-xl border border-[#D5AE62]/40 text-center">
                <span className="text-[10px] text-[#123C32] uppercase font-bold tracking-wider">Earned Rewards</span>
                <span className="text-base font-bold text-[#123C32] block mt-1">
                  ₹{selectedRestaurant.totalRewardsGenerated.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Synced Sales Breakdown */}
            <div>
              <h3 className="text-xs font-bold text-[#123C32] mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#1B6B50]" /> Synchronized Sales Orders
              </h3>

              {restaurantSales.length === 0 ? (
                <div className="p-4 bg-[#F7F5EF] rounded-xl text-center text-xs text-[#78847D]">
                  No sales orders synchronized yet from Purity Website for this restaurant.
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {restaurantSales.map(tx => (
                    <div key={tx.id} className="p-3 bg-[#F7F5EF] rounded-xl border border-[#E2E9E3] text-xs">
                      <div className="flex items-center justify-between font-semibold pb-1.5 border-b border-[#E2E9E3]">
                        <span className="font-mono text-[#123C32]">{tx.id} ({tx.date})</span>
                        <span className="text-[#21865A] font-bold">₹{tx.amount.toLocaleString('en-IN')} (Reward: ₹{tx.rewardAmount})</span>
                      </div>
                      <div className="mt-2 space-y-1 text-[11px] text-[#78847D]">
                        {tx.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.productName} ({item.unitsSold} units)</span>
                            <span className="font-medium text-[#202B27]">₹{item.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2E9E3] text-right">
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
