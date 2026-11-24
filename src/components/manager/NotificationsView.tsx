import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { role, notifications, markNotificationRead } = useApp();

  const roleNotifs = notifications.filter(n => n.recipientRole === role);

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFFFF] border border-[#E2E9E3] rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#123C32] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#1B6B50]" /> Activity & System Notifications
          </h1>
          <p className="text-xs text-[#78847D] mt-1">
            Real-time alerts for restaurant approvals, Purity sales syncs, and reward deposits.
          </p>
        </div>

        <button
          onClick={() => roleNotifs.forEach(n => markNotificationRead(n.id))}
          className="btn-secondary text-xs"
        >
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="purity-card divide-y divide-[#E2E9E3] overflow-hidden">
        {roleNotifs.length === 0 ? (
          <div className="p-8 text-center text-[#78847D] text-xs">
            No notifications available.
          </div>
        ) : (
          roleNotifs.map(notif => (
            <div 
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 flex items-start gap-4 transition-colors cursor-pointer ${notif.isRead ? 'bg-white hover:bg-[#F7F5EF]' : 'bg-[#F7F5EF]/70 hover:bg-[#F7F5EF]'}`}
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

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold ${notif.isRead ? 'text-[#202B27]' : 'text-[#123C32]'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#78847D]">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-[#78847D] mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#D5AE62] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
