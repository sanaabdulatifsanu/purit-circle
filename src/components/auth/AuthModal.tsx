import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Phone, 
  User, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    setRole, 
    verifyAdminCode, 
    registerManager, 
    allManagers 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>('login');
  
  // Login State
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('1001'); // default to initial code 1001

  // Admin Access Code State (PRD Section 5: risasi123)
  const [adminCodeInput, setAdminCodeInput] = useState('');

  // Feedback State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleManagerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: 'success', message: 'Logged in successfully as Manager!' });
    setTimeout(() => {
      setRole('manager');
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const handleManagerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (!regReferralCode.trim()) {
      setFeedback({ type: 'error', message: 'Referral code is mandatory for registration.' });
      return;
    }

    const result = registerManager({
      name: regName,
      mobile: regMobile,
      referralCode: regReferralCode.trim()
    });

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (verifyAdminCode(adminCodeInput.trim())) {
      setFeedback({ type: 'success', message: 'Admin access code verified! Opening Super Admin console...' });
      setTimeout(() => {
        setRole('admin');
        setFeedback(null);
        onClose();
      }, 1000);
    } else {
      setFeedback({ 
        type: 'error', 
        message: 'Invalid Admin Access Code. Please enter the authorized passcode (e.g. risasi123).' 
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#202B27]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-3xl max-w-md w-full p-6 shadow-elevated relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#123C32] to-[#1B6B50] text-[#D5AE62] flex items-center justify-center font-black text-xl mx-auto shadow-md mb-2">
            PC
          </div>
          <h2 className="text-lg font-bold text-[#123C32]">PURITY CIRCLE</h2>
          <p className="text-xs text-[#78847D] mt-0.5">Manager Referral & Rewards Platform</p>
        </div>

        {/* Tab Switcher (PRD Section 4 & 5) */}
        <div className="flex bg-[#F7F5EF] p-1 rounded-xl border border-[#E2E9E3] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setFeedback(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${activeTab === 'login' ? 'bg-[#123C32] text-white shadow-xs' : 'text-[#78847D] hover:text-[#123C32]'}`}
          >
            Manager Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setFeedback(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${activeTab === 'register' ? 'bg-[#123C32] text-white shadow-xs' : 'text-[#78847D] hover:text-[#123C32]'}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setFeedback(null); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === 'admin' ? 'bg-[#D5AE62] text-[#123C32] shadow-xs' : 'text-[#78847D] hover:text-[#123C32]'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${feedback.type === 'success' ? 'bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30' : 'bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/30'}`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 1. MANAGER LOGIN (PRD Section 4) */}
        {activeTab === 'login' && (
          <form onSubmit={handleManagerLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#202B27] block mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel"
                  required
                  placeholder="Enter 10-digit registered mobile"
                  value={loginMobile}
                  onChange={e => setLoginMobile(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#202B27] block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#78847D]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-[#E2E9E3] accent-[#123C32]" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-[#1B6B50] hover:underline font-medium">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold">
              Sign In to Manager Dashboard
            </button>
          </form>
        )}

        {/* 2. MANAGER REGISTRATION (PRD Section 4: Mandatory Referral Code) */}
        {activeTab === 'register' && (
          <form onSubmit={handleManagerRegister} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-[#202B27] block mb-1">Full Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Anand Mahindra"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#202B27] block mb-1">Mobile Number *</label>
              <input 
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={regMobile}
                onChange={e => setRegMobile(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
              />
            </div>

            <div className="p-3 bg-[#F7F5EF] border border-[#D5AE62]/50 rounded-xl space-y-1">
              <label className="font-bold text-[#123C32] block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D5AE62]" /> Mandatory Referral Code *
              </label>
              <input 
                type="text"
                required
                placeholder="Enter referral code (e.g. 1001 or A1001)"
                value={regReferralCode}
                onChange={e => setRegReferralCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none uppercase font-mono font-bold text-[#123C32] bg-white"
              />
              <span className="text-[10px] text-[#78847D] block">
                Initial Manager code <span className="font-mono font-bold text-[#123C32]">1001</span> or any active manager code is accepted.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1">Password *</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202B27] block mb-1">Confirm Password *</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold mt-2">
              Register & Generate Unique Code
            </button>
          </form>
        )}

        {/* 3. ADMIN ACCESS GATEWAY (PRD Section 5: risasi123) */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminAccess} className="space-y-4 text-xs">
            <div className="p-4 bg-[#123C32]/5 border border-[#123C32]/15 rounded-2xl text-center space-y-1">
              <ShieldCheck className="w-8 h-8 text-[#123C32] mx-auto" />
              <h4 className="font-bold text-[#123C32] text-sm">Protected Admin Area</h4>
              <p className="text-[11px] text-[#78847D] leading-relaxed">
                Enter the system admin access code to manage managers, restaurant approvals, and wallet claims.
              </p>
            </div>

            <div>
              <label className="font-semibold text-[#202B27] block mb-1">
                Admin Access Code (PRD Section 5):
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password"
                  required
                  placeholder="Enter admin code (risasi123)"
                  value={adminCodeInput}
                  onChange={e => setAdminCodeInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-mono"
                />
              </div>
              <span className="text-[10px] text-[#78847D] mt-1 block">
                Authorized passcode: <code className="font-bold text-[#123C32]">risasi123</code>
              </span>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#D5AE62] text-[#123C32] hover:bg-[#c79e50] py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#123C32]" />
              Unlock Admin Console
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
