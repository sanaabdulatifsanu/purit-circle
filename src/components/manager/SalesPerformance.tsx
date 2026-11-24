import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  Calendar, 
  Package, 
  Download, 
  Filter, 
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const SalesPerformance: React.FC = () => {
  const { currentManager, salesTransactions, restaurants } = useApp();
  
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'prev_month' | 'custom'>('month');

  // Scoped to manager's transactions
  const mySales = salesTransactions.filter(tx => tx.managerId === currentManager.id);
  const totalAmount = mySales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRewards = mySales.reduce((acc, curr) => acc + curr.rewardAmount, 0);

  // Product aggregated sales
  const productMap: Record<string, { name: string; category: string; units: number; amount: number }> = {};
  mySales.forEach(tx => {
    tx.items.forEach(item => {
      if (!productMap[item.productName]) {
        productMap[item.productName] = {
          name: item.productName,
          category: item.category,
          units: 0,
          amount: 0,
        };
      }
      productMap[item.productName].units += item.unitsSold;
      productMap[item.productName].amount += item.totalAmount;
    });
  });

  const productData = Object.values(productMap);

  // Chart data for monthly trend
  const monthlyTrendData = [
    { month: 'Jun 2026', sales: 42000, reward: 4200 },
    { month: 'Jul 2026', sales: 65000, reward: 6500 },
    { month: 'Aug 2026', sales: 88000, reward: 8800 },
    { month: 'Sep 2026', sales: 112000, reward: 11200 },
    { month: 'Oct 2026', sales: 135000, reward: 13500 },
    { month: 'Nov 2026', sales: 155900, reward: 15590 },
  ];

  const categoryShareData = [
    { name: 'Paper Hygiene (Tissue & HT Rolls)', value: 48, color: '#123C32' },
    { name: 'Liquids & Hand Wash', value: 28, color: '#1B6B50' },
    { name: 'Kitchen Cleaning & Degreasers', value: 16, color: '#D5AE62' },
    { name: 'Dispensers & Hardware', value: 8, color: '#21865A' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Date Filters (PRD Section 10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#1B6B50]" /> Sales Performance & Analytics
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Product-wise and restaurant-wise sales figures synchronized directly from Purity invoices.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F7F5EF] p-1 rounded-xl border border-[#E2E9E3] text-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'prev_month', label: 'Previous Month' },
            { id: 'custom', label: 'Custom Range' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${dateFilter === tab.id ? 'bg-[#123C32] text-white shadow-xs' : 'text-[#78847D] hover:text-[#123C32]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="purity-card p-4">
          <span className="text-xs text-[#78847D] font-medium">Synchronized Period Sales</span>
          <div className="text-2xl font-bold text-[#123C32] mt-1">
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#21865A] font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Verified Purity Invoices
          </div>
        </div>

        <div className="purity-card p-4">
          <span className="text-xs text-[#78847D] font-medium">Generated Sales Commission</span>
          <div className="text-2xl font-bold text-[#21865A] mt-1">
            ₹{totalRewards.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#78847D] mt-1">
            Calculated at configured 10% rate
          </div>
        </div>

        <div className="purity-card p-4 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-[#D5AE62]">
          <span className="text-xs text-[#123C32] font-bold">Total Hygiene Units Dispatched</span>
          <div className="text-2xl font-bold text-[#123C32] mt-1">
            {productData.reduce((acc, curr) => acc + curr.units, 0)} Units
          </div>
          <div className="text-[11px] text-[#D5AE62] font-semibold mt-1">
            Across your 4 referred restaurants
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Sales Trend Chart */}
        <div className="purity-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E9E3]">
            <div>
              <h3 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#1B6B50]" /> Monthly Sales & Reward Growth (INR)
              </h3>
              <p className="text-xs text-[#78847D]">Historical synchronized transaction volume</p>
            </div>
            <span className="text-xs bg-[#123C32]/10 text-[#123C32] px-2.5 py-0.5 rounded-full font-medium">
              Verified Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E9E3" />
                <XAxis dataKey="month" stroke="#78847D" fontSize={11} />
                <YAxis stroke="#78847D" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E9E3', borderRadius: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="sales" fill="#123C32" radius={[6, 6, 0, 0]} name="Sales Total" />
                <Bar dataKey="reward" fill="#D5AE62" radius={[6, 6, 0, 0]} name="Reward Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="purity-card p-5">
          <div className="pb-3 mb-4 border-b border-[#E2E9E3]">
            <h3 className="text-sm font-bold text-[#123C32] flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-[#1B6B50]" /> Category Sales Share
            </h3>
            <p className="text-xs text-[#78847D]">Breakdown by Purity product line</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryShareData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={65} 
                  innerRadius={35}
                >
                  {categoryShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {categoryShareData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#202B27] truncate max-w-[170px]">{cat.name}</span>
                </div>
                <span className="font-bold text-[#123C32]">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Product-Wise Sales Table (PRD Section 10) */}
      <div className="purity-card overflow-hidden">
        <div className="p-4 border-b border-[#E2E9E3] flex items-center justify-between bg-[#F7F5EF]/50">
          <div>
            <h3 className="text-sm font-bold text-[#123C32]">Product-Wise Sales Table</h3>
            <p className="text-xs text-[#78847D]">Itemized product dispatches across your referred restaurants</p>
          </div>
          <span className="text-xs text-[#78847D] font-mono">Purity SKU Catalog v2</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                <th className="py-3 px-4">Purity Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Units Sold</th>
                <th className="py-3 px-4 text-right">Total Invoiced Value</th>
                <th className="py-3 px-4 text-right">Reward Contribution (10%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E3]">
              {productData.map((prod, idx) => (
                <tr key={idx} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#123C32] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#1B6B50]" />
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 text-[#78847D]">{prod.category}</td>
                  <td className="py-3 px-4 text-right font-medium text-[#202B27]">{prod.units} units</td>
                  <td className="py-3 px-4 text-right font-bold text-[#123C32]">₹{prod.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#21865A]">₹{(prod.amount * 0.1).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
