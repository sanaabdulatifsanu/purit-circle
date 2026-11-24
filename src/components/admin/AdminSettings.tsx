import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, RefreshCw, Key, Check, Database, Lock } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [syncInterval, setSyncInterval] = useState('60');
  const [adminAccessCode, setAdminAccessCode] = useState('risasi123');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.puritycore.in/v2/integration');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#1B6B50]" /> System & Integration Settings
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Configure Purity Website API sync parameters and backend Admin authentication gateway.
          </p>
        </div>

        {isSaved && (
          <div className="bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Settings updated successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="purity-card p-6 space-y-6 text-xs">
        
        {/* Admin Access Code (PRD Section 5) */}
        <div>
          <h3 className="text-sm font-bold text-[#123C32] mb-1 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#D5AE62]" /> Admin Access Security Code (PRD Section 5)
          </h3>
          <p className="text-xs text-[#78847D] mb-3">
            The secret access key that unlocks the administrative suite instead of manager registration.
          </p>

          <div className="max-w-md">
            <label className="font-semibold text-[#202B27] block mb-1">
              Active Admin Passcode:
            </label>
            <input 
              type="text"
              value={adminAccessCode}
              onChange={e => setAdminAccessCode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-mono font-bold text-[#123C32]"
            />
            <span className="text-[10px] text-[#78847D] mt-1 block">
              Default required code: <span className="font-mono font-bold">risasi123</span> (Validated on backend).
            </span>
          </div>
        </div>

        {/* Purity Website API Sync (PRD Section 8) */}
        <div className="pt-4 border-t border-[#E2E9E3]">
          <h3 className="text-sm font-bold text-[#123C32] mb-1 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#1B6B50]" /> Purity Website Data Synchronization Bridge
          </h3>
          <p className="text-xs text-[#78847D] mb-3">
            Read-only connection details for fetching restaurant statuses, product catalogs, and verified sales.
          </p>

          <div className="space-y-3">
            <div>
              <label className="font-semibold text-[#202B27] block mb-1">
                Purity Core API Endpoint URL:
              </label>
              <input 
                type="text"
                value={apiEndpoint}
                onChange={e => setApiEndpoint(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1">
                  Automatic Sync Polling Interval (Minutes):
                </label>
                <select 
                  value={syncInterval}
                  onChange={e => setSyncInterval(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none bg-white"
                >
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every 60 minutes (Hourly)</option>
                  <option value="360">Every 6 hours</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#202B27] block mb-1">
                  Sync Mode:
                </label>
                <div className="px-3 py-2 bg-[#F7F5EF] border border-[#E2E9E3] rounded-lg text-[#1B6B50] font-semibold">
                  Read-Only (Non-Mutating)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E9E3] flex justify-end">
          <button type="submit" className="btn-primary text-xs">
            Save System Configurations
          </button>
        </div>

      </form>
    </div>
  );
};
