import React from 'react';
import { X, Bell, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CareTask } from '../types';
import { toBengaliNumber } from '../utils/storage';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: CareTask[];
  onToggleTaskComplete: (taskId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onToggleTaskComplete
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const overdueTasks = pendingTasks.filter((t) => t.dueDate < todayStr);
  const upcomingTasks = pendingTasks.filter((t) => t.dueDate >= todayStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF4EC] text-[#287447] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E5635]">
                খামার নোটিফিকেশন ও রিমাইন্ডার
              </h2>
              <p className="text-xs text-[#6B756D]">
                বকেয়া ও আসন্ন স্বাস্থ্য পরীক্ষা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-[#F7F7F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {overdueTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-[#B42318] mb-2 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>তারিখ অতিক্রান্ত কাজ ({toBengaliNumber(overdueTasks.length)})</span>
              </div>
              <div className="space-y-2">
                {overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-[#FFFBFB] border border-[#FECDCA] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[#202820]">{t.title}</div>
                      <div className="text-[11px] text-[#B42318] mt-0.5">
                        নির্ধারিত তারিখ ছিল: {t.dueDate} {t.cattleName ? `· গরু: ${t.cattleName}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleTaskComplete(t.id)}
                      className="px-2.5 py-1 bg-[#287447] text-white font-semibold text-xs rounded-lg shrink-0"
                    >
                      সম্পন্ন
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 font-bold text-[#1E5635] mb-2 text-xs">
              <Calendar className="w-4 h-4" />
              <span>আসন্ন সিডিউল ({toBengaliNumber(upcomingTasks.length)})</span>
            </div>
            {upcomingTasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#F7F7F2] text-center text-xs text-[#6B756D]">
                কোনো আসন্ন কাজ বাকি নেই।
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-white border border-[#E5EAE4] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[#202820]">{t.title}</div>
                      <div className="text-[11px] text-[#6B756D] mt-0.5">
                        তারিখ: <b>{t.dueDate}</b> {t.cattleName ? `· গরু: ${t.cattleName}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleTaskComplete(t.id)}
                      className="px-2.5 py-1 bg-[#EAF4EC] hover:bg-[#287447] text-[#287447] hover:text-white font-semibold text-xs rounded-lg shrink-0 transition-colors"
                    >
                      সম্পন্ন
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 border-t border-[#E5EAE4] bg-[#F7F7F2] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#287447] text-white"
          >
            বন্ধ
          </button>
        </div>
      </div>
    </div>
  );
};
