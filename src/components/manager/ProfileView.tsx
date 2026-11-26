import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck, Phone, Mail, Hash, Calendar, Building2, Check, Pencil } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ProfileView: React.FC = () => {
  const { currentManager } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [bankInfo, setBankInfo] = useState({
    accountHolder: currentManager.name,
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50100491029041',
    ifscCode: 'HDFC0000128',
    panNumber: 'ABCDE1234F',
    upiId: 'rajesh.kumar@okhdfcbank'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#123C32] text-white flex items-center justify-center font-bold text-xl shadow-sm">
            {currentManager.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#123C32]">{currentManager.name}</h1>
              <Badge status={currentManager.status} size="sm" />
            </div>
            <p className="text-xs text-[#78847D] mt-0.5">
              Manager Referral Code: <span className="font-mono font-bold text-[#D5AE62]">{currentManager.referralCode}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#78847D]">Registered On</span>
          <span className="text-xs font-semibold text-[#123C32] block">{currentManager.registeredDate}</span>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal & Contact Profile */}
        <div className="purity-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#123C32] pb-2 border-b border-[#E2E9E3]">
            Manager Credentials
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#78847D] block">Full Name:</span>
              <span className="font-semibold text-[#202B27]">{currentManager.name}</span>
            </div>

            <div>
              <span className="text-[#78847D] block">Mobile Phone:</span>
              <span className="font-semibold text-[#202B27]">+91 {currentManager.mobile}</span>
            </div>

            <div>
              <span className="text-[#78847D] block">Registered Email:</span>
              <span className="font-semibold text-[#202B27]">{currentManager.email}</span>
            </div>

            <div>
              <span className="text-[#78847D] block">Referred By:</span>
              <span className="font-semibold text-[#1B6B50]">
                {currentManager.referredByName} ({currentManager.referredByCode || '1001'})
              </span>
            </div>
          </div>
        </div>

        {/* Payout & Banking Details Form */}
        <div className="purity-card p-5">
          <h3 className="text-sm font-bold text-[#123C32] pb-2 border-b border-[#E2E9E3]">
            Bank Details for Reward Payouts
          </h3>

          {isSaved && (
            <div className="p-2.5 my-3 bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 rounded-xl text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Banking details updated successfully.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-3 mt-3 text-xs">
            <div>
              <label className="text-[#78847D] block mb-1">Account Holder Name</label>
              <input 
                type="text" 
                value={bankInfo.accountHolder}
                disabled={!isEditing}
                onChange={e => setBankInfo({...bankInfo, accountHolder: e.target.value})}
                className={`w-full px-3 py-1.5 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none ${!isEditing ? 'bg-[#F7F5EF] text-[#78847D] cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[#78847D] block mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={bankInfo.bankName}
                  disabled={!isEditing}
                  onChange={e => setBankInfo({...bankInfo, bankName: e.target.value})}
                  className={`w-full px-3 py-1.5 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none ${!isEditing ? 'bg-[#F7F5EF] text-[#78847D] cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="text-[#78847D] block mb-1">IFSC Code</label>
                <input 
                  type="text" 
                  value={bankInfo.ifscCode}
                  disabled={!isEditing}
                  onChange={e => setBankInfo({...bankInfo, ifscCode: e.target.value.toUpperCase()})}
                  className={`w-full px-3 py-1.5 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none uppercase font-mono ${!isEditing ? 'bg-[#F7F5EF] text-[#78847D] cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div>
              <label className="text-[#78847D] block mb-1">Bank Account Number</label>
              <input 
                type="text" 
                value={bankInfo.accountNumber}
                disabled={!isEditing}
                onChange={e => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                className={`w-full px-3 py-1.5 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-mono ${!isEditing ? 'bg-[#F7F5EF] text-[#78847D] cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[#78847D] block mb-1">PAN Card Number</label>
                <input 
                  type="text" 
                  value={bankInfo.panNumber}
                  disabled={!isEditing}
                  onChange={e => setBankInfo({...bankInfo, panNumber: e.target.value.toUpperCase()})}
                  className={`w-full px-3 py-1.5 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none uppercase font-mono ${!isEditing ? 'bg-[#F7F5EF] text-[#78847D] cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="text-[#78847D] block mb-1">UPI ID</label>
                <input 
                  type="text" 
                  value={bankInfo.upiId}
                  disabled={!isEditing}
                  onChange={e => setBankInfo({...bankInfo, upiId: e.target.value})}
                  className={`w-full px-3 py-1.5 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none ${!isEditing ? 'bg-[#F7F5EF] text-[#78847D] cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
                title="Edit Payout Details"
                aria-label="Edit Payout Details"
                className={`p-2 rounded-xl border transition-colors ${
                  isEditing
                    ? 'border-[#123C32]/20 bg-[#123C32]/10 text-[#123C32] cursor-default'
                    : 'border-[#E2E9E3] text-[#123C32] hover:bg-[#F7F5EF] hover:border-[#123C32]'
                }`}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!isEditing}
                className={`btn-primary text-xs ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Save Payout Details
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
