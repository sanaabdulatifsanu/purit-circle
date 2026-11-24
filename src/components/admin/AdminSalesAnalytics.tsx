import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  BarChart3, 
  Download, 
  Filter, 
  Package, 
  Store,
  Layers
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
  Cell
} from 'recharts';

export const AdminSalesAnalytics: React.FC = () => {
  const { salesTransactions, restaurants } = useApp();

  const totalSalesAmount = salesTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRewardsAmount = salesTransactions.reduce((acc, curr) => acc + curr.rewardAmount, 0);

  const productAgg: Record<string, { name: string; units: number; amount: number; category: string }> = {};
  salesTransactions.forEach(tx => {
    tx.items.forEach(item => {
      if (!productAgg[item.productName]) {
        productAgg[item.productName] = { name: item.productName, units: 0, amount: 0, category: item.category };
      }
      productAgg[item.productName].units += item.unitsSold;
      productAgg[item.productName].amount += item.totalAmount;
    });
  });

  const productList = Object.values(productAgg);

  const citySalesData = [
    { city: 'Bengaluru', sales: 420000, color: '#123C32' },
    { city: 'Mumbai', sales: 380000, color: '#1B6B50' },
    { city: 'New Delhi', sales: 240000, color: '#D5AE62' },
    { city: 'Hyderabad', sales: 160000, color: '#21865A' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#1B6B50]" /> System-Wide Sales Analytics
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Aggregated metrics across all referred and mapped restaurant accounts in Purity Circle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-3 py-1.5 rounded-xl font-medium">
            Live Stream Connected
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="purity-card p-5">
          <span className="text-xs text-[#78847D] font-medium">Total Synchronized Sales</span>
          <div className="text-3xl font-extrabold text-[#123C32] mt-1">
            ₹{(totalSalesAmount + 1200000).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#21865A] font-semibold mt-1 block">
            Across 7 referred restaurants
          </span>
        </div>

        <div className="purity-card p-5">
          <span className="text-xs text-[#78847D] font-medium">Total Reward Liability Accrued</span>
          <div className="text-3xl font-extrabold text-[#21865A] mt-1">
            ₹{(totalRewardsAmount + 120000).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#78847D] mt-1 block">
            Manager commissions & direct referral incentives
          </span>
        </div>

        <div className="purity-card p-5 bg-gradient-to-br from-[#FFFFFF] to-[#F7F5EF] border-[#D5AE62]">
          <span className="text-xs text-[#123C32] font-bold">Total Hygiene Units Shipped</span>
          <div className="text-3xl font-extrabold text-[#123C32] mt-1">
            1,480 Units
          </div>
          <span className="text-[11px] text-[#D5AE62] font-semibold mt-1 block">
            Tissues, HT rolls, dispensers & bulk soaps
          </span>
        </div>
      </div>

      {/* Regional & Product Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* City Sales Distribution */}
        <div className="purity-card p-5">
          <h3 className="text-sm font-bold text-[#123C32] mb-1">
            City-Wise Sales Inflow
          </h3>
          <p className="text-xs text-[#78847D] mb-4">Referred restaurant regional share</p>

          <div className="space-y-3">
            {citySalesData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#202B27]">{item.city}</span>
                  <span className="text-[#123C32]">₹{item.sales.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2E9E3] overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${(item.sales / 1200000) * 100}%`,
                      backgroundColor: item.color 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Product Dispatches Table */}
        <div className="purity-card p-5 lg:col-span-2 overflow-hidden">
          <h3 className="text-sm font-bold text-[#123C32] mb-1">
            Purity SKU Sales Aggregate
          </h3>
          <p className="text-xs text-[#78847D] mb-4">Product volume across all referred dining accounts</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#123C32]/5 border-b border-[#E2E9E3] text-[#78847D] text-[11px] font-semibold uppercase">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Units Invoiced</th>
                  <th className="py-2.5 px-3 text-right">Invoiced Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E9E3]">
                {productList.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F5EF]">
                    <td className="py-2.5 px-3 font-semibold text-[#123C32] flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#1B6B50]" /> {p.name}
                    </td>
                    <td className="py-2.5 px-3 text-[#78847D]">{p.category}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-[#202B27]">{p.units} units</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#123C32]">₹{p.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
