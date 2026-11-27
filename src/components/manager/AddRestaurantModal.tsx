import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { RestaurantReferral } from '../../types';

export const AddRestaurantModal: React.FC = () => {
  const { 
    isAddRestaurantModalOpen, 
    setIsAddRestaurantModalOpen, 
    addRestaurantReferral 
  } = useApp();

  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: 'Kerala',
    pinCode: '',
    gstNumber: '',
    category: 'Casual Dining' as RestaurantReferral['category'],
    existingPurityCustomerId: '',
    remarks: ''
  });

  if (!isAddRestaurantModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const result = addRestaurantReferral(formData);
    if (result.success) {
      setFormFeedback({ type: 'success', message: result.message });
      setTimeout(() => {
        setIsAddRestaurantModalOpen(false);
        setFormFeedback(null);
        setFormData({
          restaurantName: '',
          ownerName: '',
          contactPerson: '',
          mobile: '',
          email: '',
          address: '',
          city: '',
          state: 'Kerala',
          pinCode: '',
          gstNumber: '',
          category: 'Casual Dining',
          existingPurityCustomerId: '',
          remarks: ''
        });
      }, 1200);
    } else {
      setFormFeedback({ type: 'error', message: result.message });
    }
  };

  const handleClose = () => {
    setIsAddRestaurantModalOpen(false);
    setFormFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#202B27]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-elevated relative overflow-hidden">
        
        {/* Sticky / Fixed Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#E2E9E3] flex items-center justify-between bg-white shrink-0">
          <div className="pr-3">
            <h2 className="text-base sm:text-lg font-bold text-[#123C32] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#1B6B50] shrink-0" /> Submit Restaurant Referral
            </h2>
            <p className="text-[11px] sm:text-xs text-[#78847D] mt-0.5 line-clamp-1">
              Submit outlet details for Admin verification & automated Purity ID mapping.
            </p>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="p-1.5 text-[#78847D] hover:text-[#123C32] rounded-lg hover:bg-[#F7F5EF] transition-colors shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form wrapping scrollable body and fixed footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          
          {/* Scrollable Form Body */}
          <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-3 sm:space-y-4 text-xs">
            {formFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${formFeedback.type === 'success' ? 'bg-[#21865A]/10 text-[#21865A] border border-[#21865A]/30' : 'bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/30'}`}>
                {formFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{formFeedback.message}</span>
              </div>
            )}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <label className="font-semibold text-[#202B27] block mb-1">Restaurant Mobile Number (Duplicate Checked) *</label>
                <input 
                  type="tel" 
                  required 
                  maxLength={10}
                  placeholder="10-digit restaurant mobile number"
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202B27] block mb-1">Restaurant Email Address</label>
                <input 
                  type="email" 
                  placeholder="restaurant@email.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#202B27] block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as RestaurantReferral['category']})}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none bg-white"
              >
                <option value="Fine Dining">Fine Dining</option>
                <option value="Casual Dining">Casual Dining</option>
                <option value="Quick Service / Fast Food">Quick Service / Fast Food</option>
                <option value="Cafe & Bakery">Cafe & Bakery</option>
                <option value="Cloud Kitchen / Delivery Only">Cloud Kitchen / Delivery Only</option>
              </select>
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
                  placeholder="e.g. Kochi"
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
                  placeholder="e.g. 682001"
                  value={formData.pinCode}
                  onChange={e => setFormData({...formData, pinCode: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
                />
              </div>
            </div>

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
              <label className="font-semibold text-[#202B27] block mb-1">Remarks / Note for Admin</label>
              <textarea 
                rows={2}
                placeholder="Expected monthly tissue / hand wash order volume, special requirements..."
                value={formData.remarks}
                onChange={e => setFormData({...formData, remarks: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E9E3] focus:border-[#123C32] focus:outline-none"
              />
            </div>
          </div>

          {/* Fixed / Sticky Footer */}
          <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#F7F5EF] border-t border-[#E2E9E3] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 shrink-0">
            <button 
              type="button" 
              onClick={handleClose}
              className="btn-secondary text-xs w-full sm:w-auto py-2.5 px-4 justify-center cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary text-xs w-full sm:w-auto py-2.5 px-5 justify-center shadow-xs cursor-pointer"
            >
              Submit for Admin Verification
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
