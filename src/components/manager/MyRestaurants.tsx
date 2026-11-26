import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PlusCircle, 
  Plus,
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  MoreVertical, 
  FileText, 
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Package,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { RestaurantReferral } from '../../types';

export const MyRestaurants: React.FC = () => {
  const { 
    currentManager, 
    restaurants, 
    salesTransactions, 
    setIsAddRestaurantModalOpen 
  } = useApp();

  // Scoped strictly to current manager
  const myRestaurants = restaurants.filter(r => r.managerId === currentManager.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending' | 'rejected'>('all');
  
  // Modals
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantReferral | null>(null);

  const filteredRestaurants = myRestaurants.filter(r => {
    const matchesSearch = r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.mappedPurityId && r.mappedPurityId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Find sales transactions for selected restaurant drill-down
  const restaurantSales = selectedRestaurant
    ? salesTransactions.filter(tx => tx.restaurantId === selectedRestaurant.id)
    : [];

  // Aggregated product purchase breakdown for selected restaurant
  const productSummary = React.useMemo(() => {
    if (!selectedRestaurant) return [];
    
    const summaryMap: { [name: string]: {
      productId: string;
      productName: string;
      category: string;
      totalUnits: number;
      unitPrice: number;
      totalAmount: number;
      rewardEarned: number;
      lastDate: string;
    }} = {};

    restaurantSales.forEach(tx => {
      tx.items.forEach(item => {
        if (!summaryMap[item.productName]) {
          summaryMap[item.productName] = {
            productId: item.productId,
            productName: item.productName,
            category: item.category,
            totalUnits: 0,
            unitPrice: item.unitPrice,
            totalAmount: 0,
            rewardEarned: 0,
            lastDate: tx.date
          };
        }
        summaryMap[item.productName].totalUnits += item.unitsSold;
        summaryMap[item.productName].totalAmount += item.totalAmount;
        summaryMap[item.productName].rewardEarned += Math.round(item.totalAmount * 0.1);
        if (new Date(tx.date) > new Date(summaryMap[item.productName].lastDate)) {
          summaryMap[item.productName].lastDate = tx.date;
        }
      });
    });

    return Object.values(summaryMap).sort((a, b) => b.totalUnits - a.totalUnits);
  }, [selectedRestaurant, restaurantSales]);

  // Specific unit counts for the 3 key requested products
  const handWashUnits = productSummary
    .filter(p => p.productName.toLowerCase().includes('hand wash') && !p.productName.toLowerCase().includes('foam'))
    .reduce((sum, p) => sum + p.totalUnits, 0);

  const foamWashUnits = productSummary
    .filter(p => p.productName.toLowerCase().includes('foam'))
    .reduce((sum, p) => sum + p.totalUnits, 0);

  const hrtRollUnits = productSummary
    .filter(p => p.productName.toLowerCase().includes('hrt') || p.productName.toLowerCase().includes('ht roll'))
    .reduce((sum, p) => sum + p.totalUnits, 0);

  const totalUnitsPurchased = productSummary.reduce((sum, p) => sum + p.totalUnits, 0);

  return (
    <div className="space-y-6">
      
      {/* Stationary Floating Action Button (Stationary Bottom-Right Corner with Only Plus Icon) */}
      <button 
        onClick={() => setIsAddRestaurantModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#123C32] text-white shadow-2xl flex items-center justify-center hover:bg-[#1B6B50] active:scale-90 transition-all border-2 border-[#D5AE62] ring-4 ring-[#F7F5EF] focus:outline-none"
        aria-label="Add Restaurant"
        title="Add Restaurant"
      >
        <Plus className="w-7 h-7 text-white stroke-[2.5]" />
      </button>

      {/* Unified Restaurants Table & Search Box Model */}
      <div className="purity-card overflow-hidden">
        
        {/* Integrated Filter and Search Toolbar */}
        <div className="p-3 sm:p-4 border-b border-[#E2E9E3] bg-[#FFFFFF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by restaurant name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E2E9E3] focus:outline-none focus:border-[#123C32] bg-[#F7F5EF]/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#78847D]" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-[#FFFFFF] border border-[#E2E9E3] rounded-lg px-3 py-2 focus:outline-none focus:border-[#123C32] text-[#202B27]"
            >
              <option value="all">All Statuses ({myRestaurants.length})</option>
              <option value="active">Active</option>
              <option value="pending">Pending Review</option>
              <option value="inactive">Inactive</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Restaurant Info</th>
                <th className="py-3 px-4">Category & City</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Monthly Sales</th>
                <th className="py-3 px-4 text-right">Total Rewards</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#78847D]">
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

                    <td className="py-3 px-4 text-right font-bold text-[#21865A]">
                      ₹{rest.totalRewardsGenerated.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRestaurant(rest);
                        }}
                        className="p-1.5 rounded-lg text-[#78847D] hover:text-[#123C32] hover:bg-[#123C32]/10 transition-colors"
                        title="View Restaurant Details"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESTAURANT SALES DRILL-DOWN MODAL - FULLY REDESIGNED PRODUCT BREAKDOWN */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-elevated relative overflow-hidden">
            
            {/* Header */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#E2E9E3] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#123C32]">{selectedRestaurant.restaurantName}</h2>
                <Badge status={selectedRestaurant.status} size="sm" />
              </div>
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF] transition-colors shrink-0 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs">
              
              {/* Financial Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="bg-[#F7F5EF] p-3 rounded-xl border border-[#E2E9E3] text-center">
                  <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider">Monthly Sales</span>
                  <span className="text-base sm:text-lg font-black text-[#123C32] block mt-1">
                    ₹{selectedRestaurant.monthlySales.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-[#D5AE62]/15 p-3 rounded-xl border border-[#D5AE62]/40 text-center">
                  <span className="text-[10px] text-[#123C32] uppercase font-bold tracking-wider">Earned Rewards (10%)</span>
                  <span className="text-base sm:text-lg font-black text-[#123C32] block mt-1">
                    ₹{selectedRestaurant.totalRewardsGenerated.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-[#123C32]/5 p-3 rounded-xl border border-[#123C32]/20 text-center">
                  <span className="text-[10px] text-[#123C32] uppercase font-bold tracking-wider">Total Units Purchased</span>
                  <span className="text-base sm:text-lg font-black text-[#123C32] block mt-1">
                    {totalUnitsPurchased} <span className="text-xs font-semibold text-[#78847D]">Units</span>
                  </span>
                </div>
              </div>

              {/* Core 3 Product Highlights: Hand Wash, Foam Wash, HRT Roll in Same Horizontal Line */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                
                {/* 1. Hand Wash */}
                <div className="purity-card p-2 sm:p-3.5 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-2 border-[#1B6B50]/30 hover:border-[#1B6B50] transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[#78847D] mb-1">
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1B6B50]/10 text-[#1B6B50] truncate">
                        🧴 Hand Wash
                      </span>
                      <span className="hidden sm:inline text-xs font-mono font-semibold text-[#78847D]">5L Cans</span>
                    </div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#123C32] tracking-tight mt-1">
                      {handWashUnits} <span className="text-[10px] sm:text-xs font-bold text-[#78847D]">Cans</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-[#E2E9E3] flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-[11px]">
                    <span className="text-[#78847D] text-[9px] sm:text-[11px]">Total Purchased</span>
                    <span className="font-bold text-[#1B6B50]">₹{(handWashUnits * 600).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 2. Foam Wash */}
                <div className="purity-card p-2 sm:p-3.5 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-2 border-[#D5AE62]/50 hover:border-[#D5AE62] transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[#78847D] mb-1">
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#D5AE62]/25 text-[#123C32] truncate">
                        🧼 Foam Wash
                      </span>
                      <span className="hidden sm:inline text-xs font-mono font-semibold text-[#78847D]">5L Cans</span>
                    </div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#123C32] tracking-tight mt-1">
                      {foamWashUnits} <span className="text-[10px] sm:text-xs font-bold text-[#78847D]">Cans</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-[#E2E9E3] flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-[11px]">
                    <span className="text-[#78847D] text-[9px] sm:text-[11px]">Total Purchased</span>
                    <span className="font-bold text-[#1B6B50]">₹{(foamWashUnits * 700).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 3. HRT Roll */}
                <div className="purity-card p-2 sm:p-3.5 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-2 border-[#21865A]/40 hover:border-[#21865A] transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[#78847D] mb-1">
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#21865A]/15 text-[#21865A] truncate">
                        🧻 HRT Roll
                      </span>
                      <span className="hidden sm:inline text-xs font-mono font-semibold text-[#78847D]">Kitchen Towels</span>
                    </div>
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-[#123C32] tracking-tight mt-1">
                      {hrtRollUnits} <span className="text-[10px] sm:text-xs font-bold text-[#78847D]">Rolls</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-[#E2E9E3] flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-[11px]">
                    <span className="text-[#78847D] text-[9px] sm:text-[11px]">Total Purchased</span>
                    <span className="font-bold text-[#1B6B50]">₹{(hrtRollUnits * 240).toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>

              {/* Product Purchase Breakdown */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3 border-b border-[#E2E9E3] pb-2">
                  <Package className="w-4 h-4 text-[#1B6B50]" />
                  <h3 className="text-xs font-bold text-[#123C32]">Product Purchase Summary</h3>
                  <span className="text-[10px] bg-[#E2E9E3] text-[#123C32] px-2 py-0.5 rounded-full font-bold">
                    {productSummary.length} Products
                  </span>
                </div>

                <div className="space-y-2">
                  {productSummary.length === 0 ? (
                    <div className="p-4 bg-[#F7F5EF] rounded-xl text-center text-xs text-[#78847D]">
                      No product purchases found.
                    </div>
                  ) : (
                    <div className="border border-[#E2E9E3] rounded-xl overflow-hidden bg-white shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[10px] font-bold uppercase tracking-wider">
                              <th className="py-2.5 px-3">Product Name</th>
                              <th className="py-2.5 px-3 text-center">Category</th>
                              <th className="py-2.5 px-3 text-right">Units Purchased</th>
                              <th className="py-2.5 px-3 text-right">Unit Price</th>
                              <th className="py-2.5 px-3 text-right">Total Value</th>
                              <th className="py-2.5 px-3 text-right">Reward (10%)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E9E3]">
                            {productSummary.map((prod, idx) => {
                              const isKeyProduct = 
                                prod.productName.toLowerCase().includes('hand wash') || 
                                prod.productName.toLowerCase().includes('foam') || 
                                prod.productName.toLowerCase().includes('hrt') ||
                                prod.productName.toLowerCase().includes('ht roll');

                              return (
                                <tr key={idx} className={`hover:bg-[#F7F5EF] transition-colors ${isKeyProduct ? 'bg-[#F7F5EF]/30 font-medium' : ''}`}>
                                  <td className="py-2.5 px-3">
                                    <div className="font-semibold text-[#123C32] flex items-center gap-1.5">
                                      {prod.productName.toLowerCase().includes('foam') ? '🧼' :
                                       prod.productName.toLowerCase().includes('hand wash') ? '🧴' :
                                       prod.productName.toLowerCase().includes('roll') ? '🧻' : '📦'}
                                      <span>{prod.productName}</span>
                                    </div>
                                    <span className="text-[10px] text-[#78847D] block">Last ordered: {prod.lastDate}</span>
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2E9E3]/70 text-[#202B27]">
                                      {prod.category}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <span className="inline-block font-black text-xs px-2.5 py-1 rounded-lg bg-[#123C32] text-white">
                                      {prod.totalUnits} {prod.productName.toLowerCase().includes('roll') ? 'rolls' : prod.productName.toLowerCase().includes('wash') ? 'cans' : 'units'}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-mono text-[#78847D]">
                                    ₹{prod.unitPrice}
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#123C32]">
                                    ₹{prod.totalAmount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#21865A]">
                                    +₹{prod.rewardEarned.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#F7F5EF] border-t border-[#E2E9E3] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#78847D] hidden sm:inline">
                Live synchronization with Purity outlet procurement ledger
              </span>
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="btn-secondary text-xs w-full sm:w-auto px-4 py-2 cursor-pointer"
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
