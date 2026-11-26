import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const { 
    role, 
    notifications, 
    markNotificationRead,
    setManagerSubView,
    setAdminSubView 
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const roleNotifs = notifications.filter(n => n.recipientRole === role);
  const unreadCount = roleNotifs.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    if (showNotifDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifDropdown]);

  return (
    <div className="relative" ref={notifRef}>
      <button 
        onClick={() => setShowNotifDropdown(!showNotifDropdown)}
        className="relative p-2 text-[#78847D] hover:text-[#123C32] bg-[#FFFFFF] border border-[#E2E9E3] hover:border-[#123C32]/30 rounded-xl transition-colors shadow-xs"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D9534F] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl shadow-elevated z-50 p-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E9E3]">
            <h4 className="font-semibold text-sm text-[#123C32] flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#D5AE62]" /> Notifications ({unreadCount} unread)
            </h4>
            <button 
              onClick={() => roleNotifs.forEach(n => markNotificationRead(n.id))}
              className="text-xs text-[#1B6B50] hover:underline font-medium"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E9E3] mt-1">
            {roleNotifs.length === 0 ? (
              <p className="text-xs text-[#78847D] text-center py-6">No new notifications</p>
            ) : (
              roleNotifs.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer text-left ${notif.isRead ? 'opacity-70 hover:bg-[#F7F5EF]' : 'bg-[#F7F5EF]/60 hover:bg-[#F7F5EF]'}`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${notif.type === 'success' ? 'text-[#21865A]' : notif.type === 'warning' ? 'text-[#D99A32]' : 'text-[#123C32]'}`}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-[#78847D]">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#78847D] mt-1 line-clamp-2">{notif.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#E2E9E3] mt-1 text-center">
            <button 
              onClick={() => {
                setShowNotifDropdown(false);
                if (role === 'manager') {
                  setManagerSubView('notifications');
                } else {
                  setAdminSubView('notifications');
                }
              }}
              className="text-xs text-[#123C32] font-semibold hover:underline"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
