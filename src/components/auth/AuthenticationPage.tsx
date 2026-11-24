import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Phone, 
  Lock, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Copy,
  Check
} from 'lucide-react';

export const AuthenticationPage: React.FC = () => {
  const { 
    loginAsManager, 
    loginAsAdmin, 
    registerManager, 
  } = useApp();

  // Exactly 2 options: 'signin' and 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form State
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');

  // Sign Up Form State
  const [name, setName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('1001'); // Initial code 1001 prefilled

  // Forgot Password Pop-up State
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Discreet Admin Modal State (for code risasi123)
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');

  // Status/Feedback Messages
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanPhone = phone.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();

    // If admin enters risasi123 as phone or password, route directly to Admin dashboard
    if (cleanPhone === 'risasi123' || cleanPass === 'risasi123') {
      loginAsAdmin('risasi123');
      return;
    }

    if (!phone.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your phone number.' });
      return;
    }

    if (!password.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your password.' });
      return;
    }

    const res = loginAsManager(phone.trim());
    setFeedback({ type: 'success', message: res.message });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your full name.' });
      return;
    }

    if (!signupPhone.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your phone number.' });
      return;
    }

    if (!signupPassword) {
      setFeedback({ type: 'error', message: 'Please enter a password.' });
      return;
    }

    if (signupPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (!referralCode.trim()) {
      setFeedback({ 
        type: 'error', 
        message: 'Referral code is mandatory. Registration cannot be completed without a valid referral code.' 
      });
      return;
    }

    const res = registerManager({
      name: name.trim(),
      mobile: signupPhone.trim(),
      referralCode: referralCode.trim()
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAsAdmin(adminPasscode.trim());
    if (res.success) {
      setShowAdminModal(false);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleCopySupportNumber = () => {
    navigator.clipboard.writeText('9633231212');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-between selection:bg-[#D5AE62]/20 selection:text-[#123C32]">
      
      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-[#E2E9E3] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123C32] text-[#D5AE62] flex items-center justify-center font-black text-lg shadow-sm">
            PC
          </div>
          <div>
            <span className="font-bold text-base tracking-wide text-[#123C32] block">
              PURITY CIRCLE
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1B6B50]">
              Manager Referral & Rewards Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#21865A] animate-pulse" />
          <span className="text-[#1B6B50] font-medium hidden sm:inline">Purity Sync: Connected</span>
        </div>
      </header>

      {/* Main Centered Auth Card */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-6 flex items-center justify-center my-6">
        <div className="w-full bg-white border border-[#E2E9E3] rounded-3xl p-6 sm:p-8 shadow-card">
          
          {/* Centered Brand Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123C32] to-[#1B6B50] text-[#D5AE62] flex items-center justify-center font-black text-2xl mx-auto shadow-md mb-3">
              PC
            </div>
            <h1 className="text-xl font-bold text-[#123C32]">PURITY CIRCLE</h1>
            <p className="text-xs text-[#78847D] mt-1">
              {activeTab === 'signin' ? 'Sign in to access your manager dashboard' : 'Create your manager referral account'}
            </p>
          </div>

          {/* EXACTLY 2 OPTIONS: Sign In & Sign Up */}
          <div className="flex bg-[#F7F5EF] p-1.5 rounded-2xl border border-[#E2E9E3] mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl transition-all font-bold ${
                activeTab === 'signin' 
                  ? 'bg-[#123C32] text-white shadow-sm' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setFeedback(null); }}
              className={`flex-1 py-2.5 rounded-xl transition-all font-bold ${
                activeTab === 'signup' 
                  ? 'bg-[#123C32] text-white shadow-sm' 
                  : 'text-[#78847D] hover:text-[#123C32]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div className={`p-3.5 rounded-xl mb-5 text-xs flex items-center gap-2.5 ${
              feedback.type === 'success' 
                ? 'bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30 font-medium' 
                : 'bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/30 font-medium'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#21865A]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-[#D9534F]" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM (Phone number, Password, Forgot Password) */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#78847D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    required
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={e => {
                      const val = e.target.value;
                      setPhone(val);
                      if (val.trim().toLowerCase() === 'risasi123') {
                        loginAsAdmin('risasi123');
                      }
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none text-xs bg-[#F7F5EF]/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#202B27] block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#78847D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none text-xs bg-[#F7F5EF]/30"
                  />
                </div>
              </div>

              {/* Forgot Password Button (Triggers Pop-up) */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs font-semibold text-[#1B6B50] hover:text-[#123C32] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary py-3 text-xs font-bold shadow-sm"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-[#78847D] pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setFeedback(null); }}
                  className="text-[#1B6B50] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGN UP FORM (Name, Phone number, Password, Confirm password, Referral code) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#202B27] block mb-1.5">
                  Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#78847D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none text-xs bg-[#F7F5EF]/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#202B27] block mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#78847D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit phone number"
                    value={signupPhone}
                    onChange={e => setSignupPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none text-xs bg-[#F7F5EF]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-[#202B27] block mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none text-xs bg-[#F7F5EF]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#202B27] block mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78847D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none text-xs bg-[#F7F5EF]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Referral Code Field */}
              <div className="p-3 bg-[#F7F5EF] border border-[#D5AE62]/50 rounded-2xl space-y-1">
                <label className="font-bold text-[#123C32] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D5AE62]" /> Referral Code *
                  </span>
                  <span className="text-[10px] text-[#78847D] font-normal">Initial: 1001</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 1001 or A1001"
                  value={referralCode}
                  onChange={e => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none uppercase font-mono font-bold text-xs text-[#123C32] bg-white"
                />
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary py-3 text-xs font-bold shadow-sm mt-1"
              >
                Sign Up & Generate Code
              </button>

              <div className="text-center text-xs text-[#78847D] pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setFeedback(null); }}
                  className="text-[#1B6B50] font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* FORGOT PASSWORD POP-UP MODAL (Message: "contact 9633231212") */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2E9E3] rounded-3xl max-w-sm w-full p-6 shadow-elevated relative text-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#D5AE62]/20 border border-[#D5AE62]/40 text-[#123C32] flex items-center justify-center mx-auto mb-4">
              <PhoneCall className="w-7 h-7 text-[#123C32]" />
            </div>

            <h3 className="text-base font-bold text-[#123C32] mb-1">
              Password Reset Assistance
            </h3>
            
            <p className="text-xs text-[#78847D] mb-4">
              To reset your password, please contact support:
            </p>

            {/* Exactly the requested message */}
            <div className="p-4 bg-[#F7F5EF] border-2 border-[#123C32] rounded-2xl mb-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78847D] block">
                Support Helpline
              </span>
              <div className="text-xl font-mono font-extrabold text-[#123C32] tracking-wider">
                contact 9633231212
              </div>
            </div>

            {/* Actions: Call or Copy */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:9633231212"
                className="btn-primary py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Now
              </a>

              <button
                type="button"
                onClick={handleCopySupportNumber}
                className="btn-secondary py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-[#21865A]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPhone ? 'Copied!' : 'Copy Number'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(false)}
              className="mt-4 text-xs text-[#78847D] hover:text-[#123C32] underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DISCREET ADMIN MODAL (Preserves risasi123 Admin Access without cluttering main tabs) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-[#202B27]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2E9E3] rounded-3xl max-w-sm w-full p-6 shadow-elevated relative text-center">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF]"
            >
              <X className="w-5 h-5" />
            </button>

            <ShieldCheck className="w-10 h-10 text-[#123C32] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#123C32] mb-1">Administrator Access</h3>
            <p className="text-xs text-[#78847D] mb-4">Enter security passcode to unlock Admin Console.</p>

            <form onSubmit={handleAdminLogin} className="space-y-3 text-xs">
              <input 
                type="password"
                required
                placeholder="Enter passcode (risasi123)"
                value={adminPasscode}
                onChange={e => setAdminPasscode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none font-mono text-center"
              />
              <button type="submit" className="w-full btn-primary py-2.5 font-bold">
                Unlock Admin Console
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer with Discreet Admin Link */}
      <footer className="py-4 px-6 text-center text-xs text-[#78847D] border-t border-[#E2E9E3] bg-white flex items-center justify-between">
        <span>Purity Circle © 2026 • Connected to Purity Core</span>
        <button 
          onClick={() => setShowAdminModal(true)}
          className="text-[11px] text-[#78847D] hover:text-[#123C32] flex items-center gap-1 font-medium hover:underline"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#D5AE62]" /> Admin Access
        </button>
      </footer>

    </div>
  );
};
