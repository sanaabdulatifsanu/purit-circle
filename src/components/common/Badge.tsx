import React from 'react';

interface BadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'synced' | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-[#E2E9E3] text-[#78847D] border-[#E2E9E3]';

  if (normalized === 'active' || normalized === 'approved' || normalized === 'completed' || normalized === 'synced') {
    styles = 'bg-[#21865A]/10 text-[#21865A] border-[#21865A]/30';
  } else if (normalized === 'pending' || normalized === 'processing') {
    styles = 'bg-[#D99A32]/10 text-[#D99A32] border-[#D99A32]/30';
  } else if (normalized === 'inactive' || normalized === 'rejected' || normalized === 'error') {
    styles = 'bg-[#D9534F]/10 text-[#D9534F] border-[#D9534F]/30';
  } else if (normalized === 'gold' || normalized === 'premium') {
    styles = 'bg-[#D5AE62]/15 text-[#123C32] border-[#D5AE62]/40 font-semibold';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        normalized === 'active' || normalized === 'approved' || normalized === 'completed' ? 'bg-[#21865A]' :
        normalized === 'pending' || normalized === 'processing' ? 'bg-[#D99A32]' :
        normalized === 'inactive' || normalized === 'rejected' ? 'bg-[#D9534F]' : 'bg-[#D5AE62]'
      }`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};
