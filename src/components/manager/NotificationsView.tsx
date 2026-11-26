import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Check, 
  X, 
  Store, 
  User, 
  Phone, 
  MapPin, 
  Tag, 
  XCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    role, 
    notifications, 
    markNotificationRead, 
    setAdminSubView,
    setClaimsViewMode,
    restaurants, 
    allManagers, 
    approveRestaurant, 
    rejectRestaurant 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'verifications' | 'system'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const roleNotifs = notifications.filter(n => n.recipientRole === role);

  const verificationNotifs = roleNotifs.filter(n => n.restaurantId || n.verificationData);
  const systemNotifs = roleNotifs.filter(n => !n.restaurantId && !n.verificationData);

  const displayedNotifs = activeTab === 'all' 
    ? roleNotifs 
    : activeTab === 'verifications' 
      ? verificationNotifs 
      : systemNotifs;

  const handleApprove = (restaurantId: string, restaurantName: string) => {
    approveRestaurant(restaurantId);
    setActionFeedback(`"${restaurantName}" has been approved! Linked sales activated and added to Active Restaurants.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleReject = (restaurantId: string, restaurantName: string) => {
    rejectRestaurant(restaurantId, 'Declined by Admin verification');
    setActionFeedback(`"${restaurantName}" has been rejected.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header (rendered inline with menu toggle below lg) */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
          <Bell className="hidden sm:block w-6 h-6 text-[#1B6B50]" /> 
          {role === 'admin' ? 'Admin Notifications & Verifications' : 'Activity & System Notifications'}
        </h1>
      </div>

      {/* Success / Action Feedback Banner */}
      {actionFeedback && (
        <div className="bg-[#21865A]/10 border border-[#21865A]/30 text-[#21865A] p-4 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#21865A]" />
            <span className="font-semibold">{actionFeedback}</span>
          </div>
          <button 
            onClick={() => setActionFeedback(null)}
            className="text-[#21865A] hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Tab Filters */}
      {role === 'admin' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Alerts (${roleNotifs.length})` },
            { id: 'verifications', label: `Verification Requests (${verificationNotifs.length})` },
            { id: 'system', label: `System Activity (${systemNotifs.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#123C32] text-white shadow-sm' 
                  : 'bg-white border border-[#E2E9E3] text-[#78847D] hover:text-[#123C32] hover:border-[#123C32]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Notifications List / Cards Container */}
      <div className="space-y-4">
        {displayedNotifs.length === 0 ? (
          <div className="purity-card p-12 text-center text-[#78847D] text-xs">
            <Bell className="w-8 h-8 text-[#78847D]/40 mx-auto mb-2" />
            No notifications available in this view.
          </div>
        ) : (
          displayedNotifs.map(notif => {
            // Check if this is an Admin Verification Request
            const isVerification = role === 'admin' && (notif.restaurantId || notif.verificationData);
            
            if (isVerification) {
              const linkedRestaurant = restaurants.find(r => r.id === notif.restaurantId);
              
              const restName = linkedRestaurant?.restaurantName || notif.verificationData?.restaurantName || 'Restaurant Outlet';
              const owner = linkedRestaurant?.ownerName || notif.verificationData?.ownerName || 'N/A';
              const contactPerson = linkedRestaurant?.contactPerson || notif.verificationData?.contactPerson || owner;
              const phone = linkedRestaurant?.mobile || notif.verificationData?.phone || 'N/A';
              const email = linkedRestaurant?.email || notif.verificationData?.email || 'N/A';
              const address = linkedRestaurant?.address || notif.verificationData?.address || 'N/A';
              const city = linkedRestaurant?.city || notif.verificationData?.city || 'Bengaluru';
              const state = linkedRestaurant?.state || notif.verificationData?.state || 'Karnataka';
              const pinCode = linkedRestaurant?.pinCode || notif.verificationData?.pinCode || 'N/A';
              const gstNumber = linkedRestaurant?.gstNumber || notif.verificationData?.gstNumber || 'Not Provided';
              const category = linkedRestaurant?.category || notif.verificationData?.category || 'Casual Dining';
              const remarks = linkedRestaurant?.remarks || notif.verificationData?.remarks;
              const mgrName = linkedRestaurant?.managerName || notif.verificationData?.managerName || 'Manager';
              const mgrCode = linkedRestaurant?.managerReferralCode || 
                              notif.verificationData?.managerReferralCode || 
                              allManagers.find(m => m.id === linkedRestaurant?.managerId)?.referralCode || 
                              'A1001';

              const currentStatus = linkedRestaurant?.status || 'pending';
              const isApproved = currentStatus === 'active' || currentStatus === 'approved';
              const isRejected = currentStatus === 'rejected';
              const isExpanded = Boolean(expandedIds[notif.id]);
              const isUnread = !notif.isRead;

              const handleToggleCard = () => {
                if (isUnread) {
                  markNotificationRead(notif.id);
                }
                toggleExpand(notif.id);
              };

              return (
                <div 
                  key={notif.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                    isUnread
                      ? 'bg-[#FFFFFF] border-[#0E3B2E]/30 border-l-4 border-l-[#0E3B2E] hover:border-[#0E3B2E]/60 hover:border-l-[#0E3B2E] shadow-subtle'
                      : 'bg-[#EAE5D9] border-[#C8C2B4] text-[#111827]'
                  }`}
                >
                  {/* Collapsed / Clickable Card Header Row */}
                  <div
                    onClick={handleToggleCard}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#123C32]/10 text-[#123C32] flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-[#1B6B50]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-sm ${isUnread ? 'font-bold text-[#123C32]' : 'font-normal text-[#111827]'}`}>
                            {mgrName}
                          </h3>
                          {!isApproved && !isRejected && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D99A32]/10 text-[#D99A32] border border-[#D99A32]/30 px-2 py-0.5 rounded-full shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" />
                              Pending
                            </span>
                          )}
                          <span className="text-[10px] font-semibold bg-[#1B6B50]/10 text-[#1B6B50] px-2 py-0.5 rounded-md">
                            Referring Manager • Code: {mgrCode}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 flex items-center gap-1 ${isUnread ? 'text-[#78847D]' : 'text-[#111827]'}`}>
                          <Clock className={`w-3.5 h-3.5 ${isUnread ? 'text-[#78847D]' : 'text-[#111827]'}`} />
                          Submitted {notif.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* Status / Action Buttons + Dropdown Chevron */}
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      {isApproved ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#21865A]/15 text-[#21865A] border border-[#21865A]/30">
                          <CheckCircle2 className="w-4 h-4 text-[#21865A]" />
                          <span>Approved</span>
                        </div>
                      ) : isRejected ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#D9534F]/15 text-[#D9534F] border border-[#D9534F]/30">
                          <XCircle className="w-4 h-4 text-[#D9534F]" />
                          <span>Rejected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isUnread) markNotificationRead(notif.id);
                              if (linkedRestaurant) {
                                handleApprove(linkedRestaurant.id, restName);
                              }
                            }}
                            className="px-3.5 py-1.5 bg-[#21865A] hover:bg-[#1B6B50] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isUnread) markNotificationRead(notif.id);
                              if (linkedRestaurant) {
                                handleReject(linkedRestaurant.id, restName);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#D9534F]/40 text-[#D9534F] hover:bg-[#D9534F]/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCard();
                        }}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? `Collapse verification details for ${restName}` : `Expand verification details for ${restName}`}
                        className="p-1.5 rounded-lg text-[#78847D] hover:text-[#123C32] hover:bg-[#F7F5EF] transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Panel */}
                  <div
                    aria-hidden={!isExpanded}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-[#E2E9E3] items-stretch">
                    
                    {/* Restaurant Profile & Commercial Details */}
                    <div className="h-full bg-[#F7F5EF] p-5 rounded-xl border border-[#E2E9E3] flex flex-col">
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E9E3]">
                        <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#1B6B50]" /> Restaurant Profile
                        </span>
                        <span className="text-[10px] font-semibold bg-[#123C32]/10 text-[#123C32] px-2 py-0.5 rounded uppercase">
                          {category}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between gap-3 pt-3.5 text-xs">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[#78847D]">Restaurant Name:</span>
                          <span className="font-bold text-[#123C32] text-right">{restName}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[#78847D]">Owner Name:</span>
                          <span className="font-semibold text-[#202B27] text-right">{owner}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[#78847D]">Contact Person:</span>
                          <span className="font-medium text-[#202B27] text-right">{contactPerson}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[#78847D]">Phone:</span>
                          <span className="font-mono font-medium text-[#123C32] text-right">{phone}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[#78847D]">Email Address:</span>
                          <span className="font-mono text-[#202B27] text-right">{email}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[#78847D]">GST Number:</span>
                          <span className="font-mono font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded text-[11px]">
                            {gstNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Outlet Location & Referring Manager Details */}
                    <div className="h-full bg-[#F7F5EF] p-5 rounded-xl border border-[#E2E9E3] flex flex-col justify-between gap-3">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E9E3] mb-3">
                            <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#1B6B50]" /> Outlet Location
                            </span>
                          </div>

                          <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[#78847D] shrink-0">Full Street Address:</span>
                              <span className="font-medium text-[#202B27] text-right">{address}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[#78847D]">City:</span>
                              <span className="font-medium text-[#202B27] text-right">{city}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[#78847D]">State:</span>
                              <span className="font-medium text-[#202B27] text-right">{state}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[#78847D]">PIN Code:</span>
                              <span className="font-mono font-medium text-[#202B27] text-right">{pinCode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-[#E2E9E3] pt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-[#D5AE62]" /> Referring Manager
                            </span>
                            <span className="font-mono font-bold text-[#1B6B50] bg-[#1B6B50]/10 px-2 py-0.5 rounded text-[11px]">
                              {mgrCode}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs gap-2">
                            <span className="text-[#78847D]">Manager Name:</span>
                            <span className="font-bold text-[#123C32] text-right">{mgrName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Manager Note */}
                      <div className="pt-3 border-t border-[#E2E9E3]">
                        <span className="text-[10px] text-[#78847D] uppercase font-bold tracking-wider block mb-1.5">
                          Manager Note:
                        </span>
                        <p className="text-[11px] text-[#202B27] bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E2E9E3] italic">
                          "{remarks || 'No additional notes provided by manager.'}"
                        </p>
                      </div>
                    </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Standard System / Activity Notification Row (including Reward Claim Alerts)
            const isUnread = !notif.isRead;
            const isRewardClaimNotif =
              role === 'admin' &&
              (notif.linkAction === 'claims' ||
                notif.title.toLowerCase().includes('reward claim') ||
                notif.title.toLowerCase().includes('reward redemption'));

            const handleStandardCardClick = () => {
              if (isUnread) {
                markNotificationRead(notif.id);
              }
              if (isRewardClaimNotif) {
                setClaimsViewMode('pending-view');
                setAdminSubView('claims');
              }
            };

            return (
              <div 
                key={notif.id}
                role="button"
                tabIndex={0}
                onClick={handleStandardCardClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStandardCardClick();
                  }
                }}
                className={`group p-4 rounded-2xl border flex items-start gap-4 transition-all cursor-pointer ${
                  isUnread
                    ? 'bg-[#FFFFFF] border-[#0E3B2E]/30 border-l-4 border-l-[#0E3B2E] hover:border-[#0E3B2E]/60 hover:border-l-[#0E3B2E] shadow-subtle'
                    : 'bg-[#EAE5D9] border-[#C8C2B4] text-[#111827]'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'success' ? 'bg-[#21865A]/10 text-[#21865A]' :
                  notif.type === 'warning' ? 'bg-[#D99A32]/10 text-[#D99A32]' :
                  'bg-[#123C32]/10 text-[#123C32]'
                }`}>
                  {notif.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                  {notif.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                  {notif.type === 'info' && <Info className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <h4 className={`text-xs truncate ${isUnread ? 'font-bold text-[#123C32]' : 'font-normal text-[#111827]'}`}>
                        {notif.title}
                      </h4>
                      {isRewardClaimNotif && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D99A32]/10 text-[#D99A32] border border-[#D99A32]/30 px-2 py-0.5 rounded-full shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" />
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] ${isUnread ? 'text-[#78847D]' : 'text-[#111827]'}`}>{notif.timestamp}</span>
                      {isRewardClaimNotif && (
                        <ChevronRight className={`w-4 h-4 group-hover:text-[#0E3B2E] group-hover:translate-x-0.5 transition-all ${isUnread ? 'text-[#78847D]' : 'text-[#111827]'}`} />
                      )}
                    </div>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${isUnread ? 'text-[#78847D]' : 'text-[#111827]'}`}>
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
