import React from 'react';
import { Search, Stethoscope, HelpCircle, Plus, Calendar, BookOpen, Wallet, AlertTriangle, ArrowRight, ShieldCheck, HeartPulse, ChevronRight, Layers, Pill, Sparkles } from 'lucide-react';
import { CattleRecord, CareTask, FarmLedgerEntry, FarmProfile, CareGuideArticle, Disease, MedicineEntry, SymptomItem } from '../types';
import { CARE_GUIDE_ARTICLES, DISEASES_DATA, MEDICINES_DATA } from '../data/seedData';
import { toBengaliNumber, formatTaka } from '../utils/storage';
import { FilteringSearch } from './FilteringSearch';

interface HomeScreenProps {
  profile: FarmProfile;
  cattleList: CattleRecord[];
  tasks: CareTask[];
  ledger: FarmLedgerEntry[];
  onOpenSearch: () => void;
  onNavigateTab: (tab: 'diseases' | 'cattle' | 'care' | 'profile') => void;
  onOpenAddCattle: () => void;
  onOpenSymptomChecker: () => void;
  onSelectArticle: (article: CareGuideArticle) => void;
  onSelectDisease: (disease: Disease) => void;
  onSelectMedicine: (medicine: MedicineEntry) => void;
  onSelectSymptom: (symptom: SymptomItem) => void;
  onSelectCattle: (cattle: CattleRecord) => void;
  onOpenNotifications: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  cattleList,
  tasks,
  ledger,
  onOpenSearch,
  onNavigateTab,
  onOpenAddCattle,
  onOpenSymptomChecker,
  onSelectArticle,
  onSelectDisease,
  onSelectMedicine,
  onSelectSymptom,
  onSelectCattle,
  onOpenNotifications
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const activeCattle = cattleList.filter((c) => c.status !== 'সংরক্ষিত (Archived)');
  const sickCattle = activeCattle.filter((c) => c.status === 'চিকিৎসাধীন');

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const overdueTasks = pendingTasks.filter((t) => t.dueDate < todayStr);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  const totalExpense = ledger
    .filter((l) => l.type === 'খরচ')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5">
      {/* Interactive Filtering Search Widget */}
      <FilteringSearch
        isInline={true}
        cattleList={cattleList}
        onSelectDisease={onSelectDisease}
        onSelectMedicine={onSelectMedicine}
        onSelectArticle={onSelectArticle}
        onSelectSymptom={onSelectSymptom}
        onSelectCattle={onSelectCattle}
      />

      {/* Urgent Alerts Banner (if any overdue task or sick animal) */}
      {(overdueTasks.length > 0 || sickCattle.length > 0) && (
        <div className="space-y-2">
          {overdueTasks.length > 0 && (
            <div
              onClick={onOpenNotifications}
              className="bg-[#FFF9EE] border border-[#FADBA8] p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FFF3DC] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <AlertTriangle className="w-5 h-5 text-[#B7791F] shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-[#7A4B00] block">
                    {toBengaliNumber(overdueTasks.length)} টি কাজ বা টিকার তারিখ অতিক্রান্ত হয়েছে!
                  </span>
                  <span className="text-xs text-[#5C3800] truncate block">
                    প্রথম বকেয়া: {overdueTasks[0]?.title}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B7791F] shrink-0" />
            </div>
          )}

          {sickCattle.length > 0 && (
            <div
              onClick={() => onNavigateTab('cattle')}
              className="bg-[#FEE4E2] border border-[#FECDCA] p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FEE0DD] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <HeartPulse className="w-5 h-5 text-[#B42318] shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-[#B42318] block">
                    {toBengaliNumber(sickCattle.length)} টি গরু চিকিৎসাধীন রয়েছে
                  </span>
                  <span className="text-xs text-[#7A271A] truncate block">
                    পশুচিকিৎসকের নির্দেশিকা অনুযায়ী নিবিড় যত্ন নিন
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B42318] shrink-0" />
            </div>
          )}
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2.5 px-0.5">
          দ্রুত সেবা ও কার্যক্রম
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            {
              id: 'dis',
              label: 'রোগ খুঁজুন',
              icon: Stethoscope,
              action: () => onNavigateTab('diseases'),
              color: 'text-[#1E5635] bg-[#EAF4EC]'
            },
            {
              id: 'sym',
              label: 'লক্ষণ মেলান',
              icon: HelpCircle,
              action: onOpenSymptomChecker,
              color: 'text-[#B7791F] bg-[#FFF9EE]'
            },
            {
              id: 'add',
              label: 'গরু যোগ',
              icon: Plus,
              action: onOpenAddCattle,
              color: 'text-[#287447] bg-[#EAF4EC]'
            },
            {
              id: 'cal',
              label: 'টিকা ও রুটিন',
              icon: Calendar,
              action: () => onNavigateTab('care'),
              color: 'text-[#1E5635] bg-[#EAF4EC]'
            },
            {
              id: 'nut',
              label: 'খাবার ও পুষ্টি',
              icon: BookOpen,
              action: () => onNavigateTab('care'),
              color: 'text-[#1E5635] bg-[#EAF4EC]'
            },
            {
              id: 'acc',
              label: 'খামার হিসাব',
              icon: Wallet,
              action: () => onNavigateTab('profile'),
              color: 'text-[#287447] bg-[#EAF4EC]'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="bg-white border border-[#E5EAE4] hover:border-[#287447]/50 p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group min-h-[76px]"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#202820] leading-tight group-hover:text-[#1E5635]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* My Farm Summary Metrics */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h2 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider">
            আমার খামারের চিত্র
          </h2>
          <button
            onClick={() => onNavigateTab('cattle')}
            className="text-xs text-[#287447] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>গরুর তালিকা</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div
            onClick={() => onNavigateTab('cattle')}
            className="bg-white p-3.5 rounded-2xl border border-[#E5EAE4] shadow-2xs cursor-pointer hover:border-[#287447]/40 transition-all"
          >
            <span className="text-xs text-[#6B756D] block">মোট সক্রিয় গরু</span>
            <span className="text-2xl font-bold text-[#1E5635] tabular-nums mt-0.5 block">
              {toBengaliNumber(activeCattle.length)} টি
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block truncate">
              {profile.farmName || 'খামার'}
            </span>
          </div>

          <div
            onClick={() => onNavigateTab('care')}
            className="bg-white p-3.5 rounded-2xl border border-[#E5EAE4] shadow-2xs cursor-pointer hover:border-[#287447]/40 transition-all"
          >
            <span className="text-xs text-[#6B756D] block">আসন্ন রিমাইন্ডার</span>
            <span className="text-2xl font-bold text-[#287447] tabular-nums mt-0.5 block">
              {toBengaliNumber(pendingTasks.length)} টি
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">টিকা ও পরিচর্যা</span>
          </div>

          <div
            onClick={() => onNavigateTab('care')}
            className="bg-white p-3.5 rounded-2xl border border-[#E5EAE4] shadow-2xs cursor-pointer hover:border-[#287447]/40 transition-all"
          >
            <span className="text-xs text-[#6B756D] block">সম্পন্ন কাজ</span>
            <span className="text-2xl font-bold text-[#202820] tabular-nums mt-0.5 block">
              {toBengaliNumber(completedTasks.length)} টি
            </span>
            <span className="text-[10px] text-[#287447] font-semibold mt-1 block">নিয়মিত তদারকি</span>
          </div>

          <div
            onClick={() => onNavigateTab('profile')}
            className="bg-white p-3.5 rounded-2xl border border-[#E5EAE4] shadow-2xs cursor-pointer hover:border-[#287447]/40 transition-all"
          >
            <span className="text-xs text-[#6B756D] block">সাম্প্রতিক খরচ</span>
            <span className="text-xl sm:text-2xl font-bold text-[#B42318] tabular-nums mt-0.5 block truncate">
              {formatTaka(totalExpense)}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">খাদ্য ও চিকিৎসা</span>
          </div>
        </div>
      </div>

      {/* Featured Educational Articles Section with Real Photos */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h2 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider">
            খামারি শিক্ষা ও জরুরি নির্দেশিকা
          </h2>
          <button
            onClick={() => onNavigateTab('care')}
            className="text-xs text-[#287447] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>সবগুলো পড়ুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {CARE_GUIDE_ARTICLES.slice(0, 2).map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-white rounded-2xl border border-[#E5EAE4] overflow-hidden hover:border-[#287447]/50 transition-all shadow-2xs cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {article.imageUrl && (
                  <div className="h-40 overflow-hidden bg-slate-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-[10px] font-semibold text-[#1E5635] bg-[#EAF4EC] px-2 py-0.5 rounded">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-base text-[#1E5635] group-hover:text-[#287447] transition-colors mt-1.5 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#202820] line-clamp-2 mt-1 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs text-[#6B756D]">
                <span className="text-[11px] truncate max-w-[200px]">{article.reference}</span>
                <span className="text-[#287447] font-semibold flex items-center gap-0.5">
                  <span>বিস্তারিত</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Diseases to Know Right Now */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h2 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider">
            জরুরি সংক্রামক রোগ সতর্কতা
          </h2>
          <button
            onClick={() => onNavigateTab('diseases')}
            className="text-xs text-[#287447] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>রোগের তালিকা</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {DISEASES_DATA.slice(0, 3).map((dis) => (
            <div
              key={dis.id}
              onClick={() => onSelectDisease(dis)}
              className="bg-white p-3.5 rounded-2xl border border-[#E5EAE4] hover:border-[#287447]/50 transition-all shadow-2xs cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#B42318] bg-[#FEE4E2] px-1.5 py-0.5 rounded">
                  জরুরি প্রতিষেধক
                </span>
                <h3 className="font-bold text-sm text-[#1E5635] mt-1.5 leading-snug">
                  {dis.nameBn}
                </h3>
                <p className="text-[11px] text-[#6B756D] line-clamp-2 mt-1">
                  {dis.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{dis.nameEn.split(' ')[0]}</span>
                <span className="text-[#287447] font-semibold">লক্ষণ দেখুন →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Veterinary Medicines & Safe Guidelines */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div>
            <h2 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-[#287447]" />
              <span>প্রয়োজনীয় ভেটেরিনারি ওষুধ ভাণ্ডার</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('diseases')}
            className="text-xs text-[#287447] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>সকল ওষুধ ({MEDICINES_DATA.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MEDICINES_DATA.slice(0, 4).map((med) => (
            <div
              key={med.id}
              onClick={() => onSelectMedicine(med)}
              className="bg-white p-3.5 rounded-2xl border border-[#E5EAE4] hover:border-[#287447]/50 transition-all shadow-2xs cursor-pointer flex gap-3 group"
            >
              {med.imageUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-[#E5EAE4] shrink-0">
                  <img
                    src={med.imageUrl}
                    alt={med.genericNameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[9px] font-semibold text-[#1E5635] bg-[#EAF4EC] px-1.5 py-0.2 rounded">
                      {med.category.split('(')[0].trim()}
                    </span>
                    {med.professionalSupervisionRequired && (
                      <span className="text-[9px] text-[#B42318] bg-[#FEE4E2] px-1.5 py-0.2 rounded font-bold">
                        প্রেসক্রিপশন
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#1E5635] group-hover:text-[#287447] leading-snug truncate">
                    {med.genericNameBn}
                  </h3>
                  {med.commonBrands && (
                    <p className="text-[10px] text-[#287447] font-semibold truncate">
                      ব্র্যান্ড: {med.commonBrands.split(',').slice(0, 2).join(', ')}
                    </p>
                  )}
                  {med.whenToUse && (
                    <p className="text-[11px] text-[#6B756D] line-clamp-1 mt-1">
                      {med.whenToUse}
                    </p>
                  )}
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#6B756D] mt-1">
                  <span>রুট: {med.routeOfAdministration.split('(')[0].trim()}</span>
                  <span className="text-[#287447] font-semibold flex items-center gap-0.5">
                    <span>ব্যবহার বিধি</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
