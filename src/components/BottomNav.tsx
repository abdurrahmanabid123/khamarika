import React from 'react';
import { Home, Stethoscope, Layers, Calendar, UserCheck } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'home' as TabType, label: 'হোম', icon: Home },
    { id: 'diseases' as TabType, label: 'রোগ ও চিকিৎসা', icon: Stethoscope },
    { id: 'cattle' as TabType, label: 'আমার গরু', icon: Layers },
    { id: 'care' as TabType, label: 'যত্ন ও রুটিন', icon: Calendar },
    { id: 'profile' as TabType, label: 'প্রোফাইল ও হিসাব', icon: UserCheck }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E5EAE4] shadow-md">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center transition-colors relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#287447] ${
                isActive ? 'text-[#1E5635] font-semibold' : 'text-[#6B756D] hover:text-[#202820]'
              }`}
              type="button"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#287447] rounded-b-full" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#EAF4EC] scale-105' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#287447]' : 'text-[#6B756D]'}`} />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5 truncate max-w-full px-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
