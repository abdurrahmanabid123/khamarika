import React, { useState } from 'react';
import { User, Wallet, Settings, Database, ShieldAlert, Plus, Download, Upload, Trash2, RotateCcw, ExternalLink, CheckCircle2, TrendingUp, TrendingDown, Camera } from 'lucide-react';
import { FarmProfile, FarmLedgerEntry } from '../types';
import { toBengaliNumber, formatTaka, exportBackupData, importBackupData, clearSampleDataAndReset, resetToDefaults } from '../utils/storage';
import { compressImageFile } from '../utils/imageHelper';

interface ProfileScreenProps {
  profile: FarmProfile;
  onUpdateProfile: (profile: FarmProfile) => void;
  ledger: FarmLedgerEntry[];
  onOpenAddTransaction: () => void;
  onDeleteTransaction: (id: string) => void;
  onRefreshData: () => void;
  onOpenDisclaimer: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  ledger,
  onOpenAddTransaction,
  onDeleteTransaction,
  onRefreshData,
  onOpenDisclaimer
}) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'settings' | 'data' | 'about'>('ledger');

  // Edit Profile States
  const [farmerName, setFarmerName] = useState(profile.farmerName);
  const [farmName, setFarmName] = useState(profile.farmName);
  const [district, setDistrict] = useState(profile.district);
  const [upazila, setUpazila] = useState(profile.upazila);
  const [primaryFocus, setPrimaryFocus] = useState(profile.primaryFocus);
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile.notificationsEnabled);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [isCompressing, setIsCompressing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Financial calculations
  const totalIncome = ledger
    .filter((l) => l.type === 'আয়')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = ledger
    .filter((l) => l.type === 'খরচ')
    .reduce((sum, item) => sum + item.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, 600, 600, 0.85);
      setAvatarUrl(compressed);
      // Auto-save immediately so user doesn't lose it
      onUpdateProfile({
        ...profile,
        avatarUrl: compressed
      });
    } catch (err: any) {
      alert(err.message || 'ছবি আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FarmProfile = {
      ...profile,
      farmerName: farmerName.trim(),
      farmName: farmName.trim(),
      district: district.trim(),
      upazila: upazila.trim(),
      primaryFocus: primaryFocus.trim(),
      notificationsEnabled,
      avatarUrl: avatarUrl.trim() || undefined
    };
    onUpdateProfile(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goru_sathi_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackupData(content);
        if (success) {
          alert('ব্যাকআপ ডেটা সফলভাবে পুনরুদ্ধার করা হয়েছে!');
          onRefreshData();
        } else {
          alert('ব্যাকআপ ফাইলটি সঠিক নয়। অনুগ্রহ করে সঠিক JSON ফাইল নির্বাচন করুন।');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearSampleData = () => {
    if (window.confirm('আপনি কি সমস্ত ডেমো রেকর্ড মুছে পরিষ্কার করতে চান?')) {
      clearSampleDataAndReset();
      onRefreshData();
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('আপনি কি পূর্বনির্ধারিত ডেমো রেকর্ড পুনরায় লোড করতে চান?')) {
      resetToDefaults();
      onRefreshData();
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <label className="relative group cursor-pointer shrink-0" title="প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.farmerName || 'খামারি'}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#287447]/30 shadow-xs group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#EAF4EC] border-2 border-[#287447]/20 flex items-center justify-center text-[#1E5635] text-xl font-bold group-hover:bg-[#d8eedb] transition-colors">
                {profile.farmerName ? profile.farmerName.slice(0, 2) : 'খা'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-[#287447] text-white p-1 rounded-full shadow-xs border-2 border-white">
              <Camera className="w-3 h-3" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E5635] tracking-tight">
              {profile.farmerName || 'খামারি ভাই'}
            </h2>
            <p className="text-xs text-[#6B756D]">
              {profile.farmName || 'আদর্শ ডেইরি ফার্ম'} · {profile.upazila || 'সদর'}, {profile.district || 'বাংলাদেশ'}
            </p>
            <span className="text-[10px] text-[#287447] font-semibold mt-0.5 inline-block">
              ✓ লোকাল স্টোরেজে সংরক্ষিত
            </span>
          </div>
        </div>

        {/* Action button */}
        {activeTab === 'ledger' && (
          <button
            onClick={onOpenAddTransaction}
            className="px-4 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm min-h-[44px] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>আয়-ব্যয় হিসাব যোগ</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm border-b border-[#E5EAE4]">
        {[
          { id: 'ledger', label: 'খামার লেজার ও হিসাব', icon: Wallet },
          { id: 'settings', label: 'খামার প্রোফাইল ও সেটিংস', icon: Settings },
          { id: 'data', label: 'ডেটা ব্যাকআপ ও রিসেট', icon: Database },
          { id: 'about', label: 'তথ্যসূত্র ও ঘোষণা', icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 font-semibold rounded-xl shrink-0 transition-all flex items-center gap-1.5 min-h-[40px] ${
                isActive
                  ? 'bg-[#287447] text-white shadow-xs'
                  : 'bg-white border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FARM FINANCIAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs">
              <span className="text-xs font-semibold text-[#6B756D] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#287447]" />
                মোট আয় (দুধ ও পশু বিক্রয়)
              </span>
              <p className="text-xl sm:text-2xl font-bold text-[#1E5635] tabular-nums mt-1">
                {formatTaka(totalIncome)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs">
              <span className="text-xs font-semibold text-[#6B756D] flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-[#B42318]" />
                মোট খরচ (খাদ্য, ওষুধ ও টিকা)
              </span>
              <p className="text-xl sm:text-2xl font-bold text-[#B42318] tabular-nums mt-1">
                {formatTaka(totalExpense)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] shadow-2xs">
              <span className="text-xs font-semibold text-[#6B756D]">
                নীট লাভ / উদ্বৃত্ত
              </span>
              <p
                className={`text-xl sm:text-2xl font-bold tabular-nums mt-1 ${
                  netBalance >= 0 ? 'text-[#287447]' : 'text-[#B42318]'
                }`}
              >
                {formatTaka(netBalance)}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1E5635]">
                সাম্প্রতিক আয়-ব্যয় লেনদেন ({toBengaliNumber(ledger.length)} টি)
              </h3>
            </div>

            {ledger.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6B756D]">
                কোনো খরচের হিসাব রেকর্ড নেই। নতুন হিসাব যোগ করুন।
              </div>
            ) : (
              <div className="space-y-2">
                {ledger.map((item) => {
                  const isIncome = item.type === 'আয়';
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-[#E5EAE4] flex items-center justify-between gap-2 hover:bg-[#F7F7F2] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isIncome
                                ? 'bg-[#EAF4EC] text-[#287447]'
                                : 'bg-[#FEE4E2] text-[#B42318]'
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="font-semibold text-xs sm:text-sm text-[#202820]">
                            {item.category}
                          </span>
                          {item.cattleName && (
                            <span className="text-[11px] text-[#6B756D]">
                              (গরু: {item.cattleName})
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-xs text-[#6B756D] mt-0.5 truncate">
                            {item.notes}
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          তারিখ: {item.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`font-bold text-sm tabular-nums ${
                            isIncome ? 'text-[#287447]' : 'text-[#B42318]'
                          }`}
                        >
                          {isIncome ? '+' : '-'} {formatTaka(item.amount)}
                        </span>
                        <button
                          onClick={() => onDeleteTransaction(item.id)}
                          className="p-1 text-slate-400 hover:text-[#B42318] transition-colors"
                          title="মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FARM PROFILE & SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-4 text-xs sm:text-sm">
          {saveSuccessMsg && (
            <div className="p-3 bg-[#EAF4EC] border border-[#287447]/30 text-[#1E5635] rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#287447]" />
              <span>প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          {/* Profile Photo Upload / Change Section */}
          <div className="bg-[#F7F7F2] p-4 rounded-2xl border border-[#E5EAE4]">
            <label className="font-semibold text-[#202820] block mb-2">
              আপনার প্রোফাইল ছবি (ফোন ক্যামেরা বা গ্যালারি থেকে)
            </label>
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <div className="relative group shrink-0">
                  <img
                    src={avatarUrl}
                    alt="Farmer profile preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#287447]/40 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl('');
                      onUpdateProfile({ ...profile, avatarUrl: undefined });
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-[#B42318] text-white p-1 rounded-full shadow-xs hover:bg-red-700 transition-colors"
                    title="ছবি মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-[#D2DDD0] flex flex-col items-center justify-center text-[#6B756D] shrink-0">
                  <Camera className="w-6 h-6 text-[#287447]" />
                  <span className="text-[10px] text-slate-400 mt-0.5">ছবি নেই</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E5EAE4] text-[#1E5635] font-semibold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors">
                  <Camera className="w-3.5 h-3.5 text-[#287447]" />
                  <span>{avatarUrl ? 'ছবি পরিবর্তন করুন' : 'ছবি যোগ করুন'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#6B756D] mt-1.5">
                  {isCompressing
                    ? 'ছবি প্রক্রিয়াজাত হচ্ছে...'
                    : 'ছবিটি সরাসরি আপনার ফোনের লোকাল স্টোরেজে সংরক্ষিত থাকবে।'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">খামারির নাম</label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">খামারের নাম</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">জেলা</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="যেমন: পাবনা, সিরাজগঞ্জ"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">উপজেলা</label>
              <input
                type="text"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                placeholder="যেমন: ঈশ্বরদী, শাহজাদপুর"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">খামারের মূল লক্ষ্য বা কার্যক্রম</label>
            <input
              type="text"
              value={primaryFocus}
              onChange={(e) => setPrimaryFocus(e.target.value)}
              placeholder="যেমন: উন্নত দুগ্ধ গাভী পালন ও বাছুর লালন-পালন"
              className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#E5EAE4]">
            <div>
              <span className="font-semibold block text-[#202820]">টিকা ও যত্নের রিমাইন্ডার সক্রিয় রাখুন</span>
              <span className="text-xs text-[#6B756D]">আসন্ন কার্যক্রম সম্পর্কে নিয়মিত নোটিফিকেশন প্রদর্শন</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#287447]"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white font-semibold rounded-xl text-xs sm:text-sm"
            >
              তথ্য সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DATA BACKUP & RESTORE */}
      {activeTab === 'data' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-5 text-xs sm:text-sm">
          <div>
            <h3 className="font-bold text-base text-[#1E5635] mb-1">
              সম্পূর্ণ অফলাইন সংরক্ষণাগার (Local Storage Persistence)
            </h3>
            <p className="text-xs text-[#6B756D] leading-relaxed">
              আপনার খামারের সকল তথ্য সম্পূর্ণ ব্যক্তিগতভাবে আপনার ডিভাইসের ব্রাউজার মেমোরিতে সংরক্ষিত আছে। ইন্টারনেট সংযোগ না থাকলেও আপনি সমস্ত তথ্য ব্যবহার করতে পারবেন।
            </p>
          </div>

          {/* Backup & Restore Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportBackup}
              className="p-4 rounded-xl border border-[#287447]/30 bg-[#EAF4EC]/40 hover:bg-[#EAF4EC] transition-all flex items-center gap-3 text-left"
            >
              <Download className="w-6 h-6 text-[#287447] shrink-0" />
              <div>
                <span className="font-bold text-[#1E5635] block">ব্যাকআপ ডাউনলোড করুন (JSON)</span>
                <span className="text-xs text-[#6B756D]">সকল গরু ও আর্থিক হিসাব ফাইলে সংরক্ষণ করুন</span>
              </div>
            </button>

            <label className="p-4 rounded-xl border border-[#E5EAE4] hover:bg-[#F7F7F2] transition-all flex items-center gap-3 cursor-pointer">
              <Upload className="w-6 h-6 text-[#6B756D] shrink-0" />
              <div>
                <span className="font-bold text-[#202820] block">ব্যাকআপ ফাইল ইমপোর্ট করুন</span>
                <span className="text-xs text-[#6B756D]">পূর্বের সংরক্ষিত JSON ফাইল থেকে ডেটা আনুন</span>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Sample Data Management */}
          <div className="border-t border-[#E5EAE4] pt-4 space-y-3">
            <h4 className="font-bold text-[#202820]">ডেমো ডেটা রিসেট বা পরিষ্কার</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearSampleData}
                className="px-4 py-2 border border-[#FECDCA] text-[#B42318] hover:bg-[#FEE4E2] rounded-xl font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সব রেকর্ড মুছে পরিষ্কার খামার শুরু করুন</span>
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 border border-[#E5EAE4] text-[#6B756D] hover:bg-slate-100 rounded-xl font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>আদর্শ ডেমো ডেটা ফিরিয়ে আনুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ABOUT, SOURCES & DISCLAIMER */}
      {activeTab === 'about' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5EAE4] shadow-2xs space-y-5 text-xs sm:text-sm">
          {/* Medical Disclaimer */}
          <div className="bg-[#FFF9EE] border-2 border-[#E0A838]/50 p-4 rounded-xl text-xs text-[#7A4B00] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-[#B7791F]" />
              <span>জরুরি চিকিৎসা ও আইনি অস্বীকৃতি (Medical & Veterinary Disclaimer)</span>
            </div>
            <p className="text-[#5C3800] leading-relaxed">
              খামারিকা অ্যাপটিতে অন্তর্ভুক্ত সকল রোগ, লক্ষণ, ওষুধ ও পুষ্টি তথ্য শুধুমাত্র পশু মালিকদের প্রাথমিক সচেতনতা এবং খামার ব্যবস্থাপনার সুবিধার্থে প্রণীত। এটি কোনো অবস্থাতেই একজন রেজিস্টার্ড পশুচিকিৎসকের প্রত্যক্ষ পরীক্ষা বা প্রেসক্রিপশনের বিকল্প নয়। ওষুধের মাত্রা ও প্রয়োগের পূর্বে সর্বদা উপজেলা প্রাণিসম্পদ হাসপাতাল বা রেজিস্টার্ড চিকিৎসকের সাথে পরামর্শ করুন।
            </p>
          </div>

          {/* Authoritative Data Sources */}
          <div>
            <h3 className="font-bold text-sm text-[#1E5635] uppercase tracking-wider mb-2">
              প্রামাণ্য তথ্যসূত্র ও প্রাতিষ্ঠানিক রেফারেন্স
            </h3>
            <div className="space-y-2">
              {[
                {
                  org: 'Department of Livestock Services (DLS), Bangladesh',
                  title: 'প্রাণিসম্পদ অধিদপ্তর, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
                  url: 'https://dls.gov.bd/',
                  role: 'জাতীয় পশু চিকিৎসা নির্দেশিকা ও রোগ নজরদারি ম্যানুয়াল'
                },
                {
                  org: 'Food and Agriculture Organization (FAO)',
                  title: 'জাতিসংঘ খাদ্য ও কৃষি সংস্থা (এফএও)',
                  url: 'https://www.fao.org/',
                  role: 'গবাদিপশুর স্বাস্থ্যবিধি ও বাছুর লালন-পালন নির্দেশিকা'
                },
                {
                  org: 'World Organisation for Animal Health (WOAH)',
                  title: 'বিশ্ব প্রাণিস্বস্বাস্থ্য সংস্থা',
                  url: 'https://www.woah.org/',
                  role: 'আন্তর্জাতিক রোগ নিয়ন্ত্রণ ও জৈবনিরাপত্তা মানদণ্ড'
                }
              ].map((src, idx) => (
                <div key={idx} className="p-3 bg-[#F7F7F2] rounded-xl border border-[#E5EAE4] flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-[#202820] text-xs sm:text-sm">{src.title}</span>
                    <span className="text-[11px] text-[#6B756D] block">{src.role}</span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-2 text-[#287447] hover:bg-[#EAF4EC] rounded-lg transition-colors shrink-0"
                    title="ওয়েবসাইটে যান"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* App Version Info */}
          <div className="border-t border-[#E5EAE4] pt-4 text-xs text-[#6B756D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-[#202820]">খামারিকা (Khamarika)</span> — সংস্করণ ১.০.০
              <p className="text-[11px] text-slate-400">বাংলাদেশী খামারিদের জন্য নির্মিত স্মার্ট ক্যাটল কেয়ার অ্যাপ</p>
            </div>
            <span className="text-[11px] bg-[#EAF4EC] text-[#287447] px-2.5 py-1 rounded-md font-semibold">
              অফলাইন-ফার্স্ট
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
