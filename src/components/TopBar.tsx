import React from 'react';
import { Search, Bell, ShieldAlert } from 'lucide-react';
import { toBengaliNumber } from '../utils/storage';
import { FarmProfile } from '../types';

interface TopBarProps {
  profile: FarmProfile;
  pendingTasksCount: number;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenDisclaimer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  pendingTasksCount,
  onOpenSearch,
  onOpenNotifications,
  onOpenDisclaimer
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E5EAE4] px-4 py-2.5 transition-shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity: logo and name only (no subtitles, greetings or other clutter on left) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#287447] to-[#1E5635] text-white flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 5c0-1.5 1.3-3 3-3h4c1.7 0 3 1.5 3 3v2H7V5z" />
              <path d="M5 8c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4h1c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2H5z" />
              <circle cx="9" cy="12.5" r="1" fill="currentColor" />
              <circle cx="15" cy="12.5" r="1" fill="currentColor" />
              <path d="M10.5 16.5c.8.6 2.2.6 3 0" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#1E5635] tracking-tight whitespace-nowrap">
            খামারিকা
          </span>
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            type="button"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#202820] hover:bg-[#F7F7F2] transition-colors"
            title="অনুসন্ধান করুন"
            aria-label="অনুসন্ধান করুন"
          >
            <Search className="w-5 h-5 text-[#287447]" />
          </button>

          {/* Notifications Button with Badge */}
          <button
            onClick={onOpenNotifications}
            type="button"
            className="min-h-[44px] min-w-[44px] relative flex items-center justify-center rounded-lg text-[#202820] hover:bg-[#F7F7F2] transition-colors"
            title="রিমাইন্ডার ও নোটিফিকেশন"
            aria-label="রিমাইন্ডার"
          >
            <Bell className="w-5 h-5 text-[#287447]" />
            {pendingTasksCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#B42318] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                {toBengaliNumber(pendingTasksCount)}
              </span>
            )}
          </button>

          {/* Veterinary Disclaimer Quick Icon */}
          <button
            onClick={onOpenDisclaimer}
            type="button"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#B7791F] hover:bg-[#FFF9EE] transition-colors"
            title="চিকিৎসা সতর্কতা"
            aria-label="চিকিৎসা সতর্কতা"
          >
            <ShieldAlert className="w-5 h-5 text-[#B7791F]" />
          </button>
        </div>
      </div>
    </header>
  );
};
