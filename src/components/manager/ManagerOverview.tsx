import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  PlusCircle, 
  Gift, 
  User
} from 'lucide-react';
import { RestaurantReferral, Manager } from '../../types';

export const ManagerOverview: React.FC = () => {
  const { 
    currentManager, 
    restaurants, 
    allManagers,
    setManagerSubView,
    setIsAddRestaurantModalOpen 
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'restaurants' | 'people'>('all');

  // Filter manager's own restaurants
  const userRestaurants = restaurants.filter(r => r.managerId === currentManager.id);
  
  // Filter people referred by this manager's unique referral code
  const userReferredPeople = allManagers.filter(
    m => m.referredByCode?.toUpperCase() === currentManager.referralCode?.toUpperCase()
  );

  // If newly registered manager has no records yet, provide rich demonstration records
  // demonstrating Active restaurant, Inactive restaurant, and Referred Person with ₹2,000 bonus
  const sampleRestaurants: RestaurantReferral[] = [
    {
      id: 'demo_rest_1',
      restaurantName: 'Emerald Spice Haven',
      ownerName: 'Farhan Ali',
      contactPerson: 'Farhan Ali',
      mobile: '9847123987',
      email: 'contact@emeraldspice.com',
      city: 'Calicut',
      state: 'Kerala',
      pinCode: '673001',
      category: 'Casual Dining',
      address: 'Beach Road, Calicut',
      managerId: currentManager.id,
      managerName: currentManager.name,
      status: 'active',
      monthlySales: 85000,
      totalSales: 170000,
      totalRewardsGenerated: 17000,
      submissionDate: '2026-11-02',
      mappedPurityId: 'PUR-CC-108'
    },
    {
      id: 'demo_rest_2',
      restaurantName: 'The Royal Treat Dine',
      ownerName: 'Kavita Nair',
      contactPerson: 'Kavita Nair',
      mobile: '9847654321',
      email: 'info@royaltreat.com',
      city: 'Kochi',
      state: 'Kerala',
      pinCode: '682001',
      category: 'Fine Dining',
      address: 'MG Road, Ernakulam',
      managerId: currentManager.id,
      managerName: currentManager.name,
      status: 'inactive',
      monthlySales: 0,
      totalSales: 0,
      totalRewardsGenerated: 0,
      submissionDate: '2026-11-10',
      mappedPurityId: 'PUR-KC-092'
    }
  ];

  const sampleReferredPeople: Manager[] = [
    {
      id: 'demo_mgr_1',
      name: 'Aditya Menon',
      mobile: '9895012345',
      email: 'aditya.menon@puritycircle.in',
      referralCode: 'A4421',
      referredByCode: currentManager.referralCode,
      referredByName: currentManager.name,
      registeredDate: '2026-11-05',
      status: 'active',
      referredRestaurantsCount: 1,
      totalSalesGenerated: 42000,
      walletBalance: 2000,
      totalRewardsEarned: 2000
    }
  ];

  const effectiveRestaurants = userRestaurants.length > 0 ? userRestaurants : sampleRestaurants;
  const effectiveReferredPeople = userReferredPeople.length > 0 ? userReferredPeople : sampleReferredPeople;

  const activeCount = effectiveRestaurants.filter(r => r.status === 'active').length;
  const totalMonthlySales = effectiveRestaurants.reduce((acc, curr) => acc + curr.monthlySales, 0);
  const totalRewardsEarned = Math.round(totalMonthlySales * 0.1) + (effectiveReferredPeople.length * 2000);

  // Map unified table items
  const restaurantItems = effectiveRestaurants.map(r => ({
    id: r.id,
    kind: 'restaurant' as const,
    name: r.restaurantName,
    subtext: `${r.city} • ${r.mappedPurityId || 'Mapping Pending'}`,
    status: r.status,
    salesText: r.status === 'active' && r.monthlySales > 0 
      ? `₹${r.monthlySales.toLocaleString('en-IN')}` 
      : '₹0 (No active orders)',
    pointsText: r.status === 'active' && r.monthlySales > 0
      ? `+${Math.round(r.monthlySales * 0.1).toLocaleString('en-IN')} pts`
      : '0 pts',
    rewardCashText: r.status === 'active' && r.monthlySales > 0
      ? `₹${Math.round(r.monthlySales * 0.1).toLocaleString('en-IN')}`
      : '₹0',
    date: r.submissionDate
  }));

  const peopleItems = effectiveReferredPeople.map(p => ({
    id: p.id,
    kind: 'person' as const,
    name: p.name,
    subtext: `Manager Code: ${p.referralCode} • Mobile: ${p.mobile}`,
    status: 'qualified' as const,
    salesText: 'Qualifying Restaurant Sales Verified',
    pointsText: '+2,000 pts',
    rewardCashText: '₹2,000 Direct Bonus',
    date: p.registeredDate
  }));

  const allItems = [...restaurantItems, ...peopleItems];

  const displayedItems = filterTab === 'restaurants' 
    ? restaurantItems 
    : filterTab === 'people' 
      ? peopleItems 
      : allItems;

  return (
    <div className="space-y-6">
      
      {/* 4 KPI Metric Boxes: 2x2 Grid on Mobile, 4-Column Row on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Total Referred Restaurants */}
        <div className="purity-card p-3 sm:p-4 hover:border-[#1B6B50] transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1.5 text-[#78847D] mb-1.5 sm:mb-2 min-h-[30px] sm:min-h-[32px]">
              <span className="text-[11px] sm:text-xs font-semibold leading-tight">Total Referred Restaurants</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-[#123C32]/10 flex items-center justify-center text-[#123C32]">
                <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#123C32]">
              {effectiveRestaurants.length}
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#78847D] mt-1.5 sm:mt-2 leading-tight">
            <span>{activeCount} active outlets</span>
          </div>
        </div>

        {/* Active Restaurants */}
        <div className="purity-card p-3 sm:p-4 hover:border-[#21865A] transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1.5 text-[#78847D] mb-1.5 sm:mb-2 min-h-[30px] sm:min-h-[32px]">
              <span className="text-[11px] sm:text-xs font-semibold leading-tight">Active Restaurants</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-[#21865A]/10 flex items-center justify-center text-[#21865A]">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#21865A]">
              {activeCount}
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#78847D] mt-1.5 sm:mt-2 leading-tight">
            Generating rewards
          </div>
        </div>

        {/* Total Rewards Earned */}
        <div className="purity-card p-3 sm:p-4 hover:border-[#D5AE62] transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1.5 text-[#78847D] mb-1.5 sm:mb-2 min-h-[30px] sm:min-h-[32px]">
              <span className="text-[11px] sm:text-xs font-semibold leading-tight">Total Rewards Earned</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-[#D5AE62]/20 flex items-center justify-center text-[#123C32]">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D5AE62]" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#123C32]">
              ₹{totalRewardsEarned.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#78847D] mt-1.5 sm:mt-2 leading-tight">
            Sales + Referral bonus
          </div>
        </div>

        {/* Pending Claims */}
        <div className="purity-card p-3 sm:p-4 hover:border-[#D99A32] transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1.5 text-[#78847D] mb-1.5 sm:mb-2 min-h-[30px] sm:min-h-[32px]">
              <span className="text-[11px] sm:text-xs font-semibold leading-tight">Pending Claims</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-lg bg-[#D99A32]/10 flex items-center justify-center text-[#D99A32]">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#D99A32]">
              ₹0
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#78847D] mt-1.5 sm:mt-2 leading-tight">
            No claims awaiting
          </div>
        </div>

      </div>

      {/* Quick Action Buttons Below Cards */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        <button 
          onClick={() => {
            setIsAddRestaurantModalOpen(true);
          }}
          className="btn-primary text-xs flex items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 shadow-xs w-full sm:w-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Add Restaurant</span>
        </button>
        
        <button 
          onClick={() => setManagerSubView('claim')}
          className="btn-accent text-xs flex items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 shadow-xs w-full sm:w-auto"
        >
          <Gift className="w-4 h-4 text-[#123C32] shrink-0" />
          <span>Claim Rewards</span>
        </button>
      </div>

      {/* SINGLE UNIFIED TABLE (Referred Restaurants & Referred People) */}
      <div className="purity-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E2E9E3]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#123C32]">
              Referral Directory & Rewards Tracker
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F7F5EF] p-1 rounded-xl border border-[#E2E9E3] text-xs self-start sm:self-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterTab === 'all' 
                  ? 'bg-[#123C32] text-white shadow-xs' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              All ({allItems.length})
            </button>
            <button
              onClick={() => setFilterTab('restaurants')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterTab === 'restaurants' 
                  ? 'bg-[#123C32] text-white shadow-xs' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              Restaurants ({restaurantItems.length})
            </button>
            <button
              onClick={() => setFilterTab('people')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterTab === 'people' 
                  ? 'bg-[#123C32] text-white shadow-xs' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              Referred People ({peopleItems.length})
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[#F7F5EF]/80 text-[11px] font-bold text-[#78847D] uppercase tracking-wider border-b border-[#E2E9E3]">
                <th className="py-3 px-4">Referral Details</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Sales / Qualification</th>
                <th className="py-3 px-4 text-right">Reward Points / Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3] text-xs">
              {displayedItems.map(item => (
                <tr key={item.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                  {/* Referral Name & Subtext */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        item.kind === 'restaurant' 
                          ? 'bg-[#123C32] text-white shadow-2xs' 
                          : 'bg-[#D5AE62] text-[#123C32] shadow-2xs'
                      }`}>
                        {item.kind === 'restaurant' ? (
                          <Store className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4 text-[#123C32]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[#202B27]">{item.name}</div>
                        <div className="text-[11px] text-[#78847D] mt-0.5">{item.subtext}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {item.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#21865A] animate-pulse"></span>
                        Active
                      </span>
                    ) : item.status === 'inactive' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9534F]"></span>
                        Inactive
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#21865A]" />
                        Bonus Credited
                      </span>
                    )}
                  </td>

                  {/* Sales / Qualification */}
                  <td className="py-3.5 px-4 font-medium text-[#202B27]">
                    {item.salesText}
                  </td>

                  {/* Reward Points / Bonus */}
                  <td className="py-3.5 px-4 text-right">
                    {item.kind === 'restaurant' ? (
                      item.status === 'active' ? (
                        <div>
                          <div className="font-bold text-[#1B6B50] text-sm">
                            {item.rewardCashText}
                          </div>
                          <div className="text-[10px] text-[#78847D] font-medium">
                            {item.pointsText} (10% sales reward)
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[#78847D] font-semibold text-xs">0 pts</span>
                          <span className="text-[10px] text-[#D9534F] block">Inactive (no points)</span>
                        </div>
                      )
                    ) : (
                      <div>
                        <div className="inline-flex items-center gap-1 bg-[#D5AE62]/20 border border-[#D5AE62]/50 text-[#123C32] px-2.5 py-1 rounded-lg font-black text-sm shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-[#D5AE62]" />
                          ₹2,000
                        </div>
                        <span className="text-[10px] text-[#1B6B50] font-bold block mt-0.5">Direct Bonus Received</span>
                      </div>
                    )}
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
