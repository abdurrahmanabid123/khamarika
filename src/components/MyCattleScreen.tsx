import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, ShieldAlert, ArrowRight, Layers, HeartPulse } from 'lucide-react';
import { CattleRecord } from '../types';
import { toBengaliNumber } from '../utils/storage';

interface MyCattleScreenProps {
  cattleList: CattleRecord[];
  onSelectCattle: (cattle: CattleRecord) => void;
  onOpenAddModal: () => void;
}

export const MyCattleScreen: React.FC<MyCattleScreenProps> = ({
  cattleList,
  onSelectCattle,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');

  const filteredList = useMemo(() => {
    return cattleList.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.tagId.toLowerCase().includes(q) ||
        c.breed.toLowerCase().includes(q);

      if (filterPurpose === 'sick') {
        return matchQuery && c.status === 'চিকিৎসাধীন';
      }
      if (filterPurpose === 'archived') {
        return matchQuery && c.status === 'সংরক্ষিত (Archived)';
      }
      if (filterPurpose === 'dairy') {
        return matchQuery && c.purpose.includes('দুধ');
      }
      if (filterPurpose === 'beef') {
        return matchQuery && c.purpose.includes('মোটাতাজা');
      }
      // default: show non-archived
      return matchQuery && c.status !== 'সংরক্ষিত (Archived)';
    });
  }, [cattleList, searchQuery, filterPurpose]);

  const totalActive = cattleList.filter((c) => c.status !== 'সংরক্ষিত (Archived)').length;
  const totalSick = cattleList.filter((c) => c.status === 'চিকিৎসাধীন').length;

  return (
    <div className="space-y-4">
      {/* Top Banner & Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1E5635] tracking-tight">
              আমার খামারের গরু
            </h2>
            <span className="text-xs font-semibold bg-[#EAF4EC] text-[#287447] px-2 py-0.5 rounded-full">
              মোট: {toBengaliNumber(totalActive)} টি
            </span>
            {totalSick > 0 && (
              <span className="text-xs font-semibold bg-[#FEE4E2] text-[#B42318] px-2 py-0.5 rounded-full flex items-center gap-1">
                <HeartPulse className="w-3 h-3" />
                {toBengaliNumber(totalSick)} টি অসুস্থ
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B756D] mt-0.5">
            প্রতিটি পশুর স্বাস্থ্য, টিকা, প্রজনন ও উৎপাদন ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-98 min-h-[44px] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গরু যোগ করুন</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="গরুর নাম, ট্যাগ নম্বর বা জাত দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5EAE4] rounded-xl text-xs sm:text-sm text-[#202820] placeholder-[#6B756D] focus:outline-none focus:border-[#287447] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[#6B756D] font-medium shrink-0 flex items-center gap-1 text-[11px] mr-1">
            <Filter className="w-3 h-3" />
            ফিল্টার:
          </span>
          {[
            { id: 'all', label: 'সক্রিয় গরু' },
            { id: 'dairy', label: 'দুগ্ধ গাভী' },
            { id: 'beef', label: 'মোটাতাজাকরণ' },
            { id: 'sick', label: 'চিকিৎসাধীন (অসুস্থ)' },
            { id: 'archived', label: 'আর্কাইভকৃত' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterPurpose(f.id)}
              className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all min-h-[36px] ${
                filterPurpose === f.id
                  ? 'bg-[#287447] text-white shadow-xs'
                  : 'bg-white border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cattle Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-[#E5EAE4] text-center text-[#6B756D] space-y-3">
          <Layers className="w-10 h-10 mx-auto text-[#287447] opacity-60" />
          <div>
            <p className="font-bold text-[#202820] text-base">কোনো গরুর তথ্য পাওয়া যায়নি</p>
            <p className="text-xs text-[#6B756D] mt-1">
              আপনার খামারের প্রথম গরুর তথ্য যোগ করে রেকর্ড সংরক্ষণ শুরু করুন।
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2 bg-[#287447] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>এখনই গরু যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredList.map((cattle) => {
            const isSick = cattle.status === 'চিকিৎসাধীন';
            return (
              <div
                key={cattle.id}
                onClick={() => onSelectCattle(cattle)}
                className="bg-white p-4 rounded-2xl border border-[#E5EAE4] hover:border-[#287447]/50 transition-all shadow-2xs cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-3">
                    {cattle.photoUrl ? (
                      <img
                        src={cattle.photoUrl}
                        alt={cattle.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5EAE4] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#EAF4EC] border border-[#287447]/20 flex items-center justify-center text-[#1E5635] text-lg font-bold shrink-0">
                        {cattle.name.slice(0, 2)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-mono font-semibold text-[#287447] bg-[#EAF4EC] px-1.5 py-0.5 rounded">
                          {cattle.tagId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSick
                              ? 'bg-[#FEE4E2] text-[#B42318]'
                              : 'bg-[#EAF4EC] text-[#287447]'
                          }`}
                        >
                          {cattle.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[#1E5635] group-hover:text-[#287447] transition-colors mt-0.5">
                        {cattle.name}
                      </h3>
                      <p className="text-xs text-[#6B756D]">
                        {cattle.breed} · {cattle.sex}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-[#6B756D]">
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-slate-400">বয়স</span>
                      <span className="font-semibold text-[#202820]">{cattle.dobOrAge}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-slate-400">ওজন</span>
                      <span className="font-semibold text-[#202820]">
                        {cattle.currentWeightKg ? `${toBengaliNumber(cattle.currentWeightKg)} কেজি` : 'অজানা'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-slate-400">উদ্দেশ্য</span>
                      <span className="font-semibold text-[#202820] truncate block">{cattle.purpose.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E5EAE4] flex items-center justify-between text-xs">
                  <span className="text-[#6B756D]">
                    টিকা: {toBengaliNumber(cattle.vaccinations?.length || 0)} টি রেকর্ড
                  </span>
                  <span className="text-[#287447] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>প্রোফাইল দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
