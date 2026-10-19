import React, { useState, useMemo } from 'react';
import { Search, X, Filter, Stethoscope, Pill, AlertTriangle, BookOpen, Layers, ArrowRight, Check } from 'lucide-react';
import { DISEASES_DATA, MEDICINES_DATA, SYMPTOMS_LIST, CARE_GUIDE_ARTICLES } from '../data/seedData';
import { Disease, MedicineEntry, CareGuideArticle, SymptomItem, CattleRecord } from '../types';

export type SearchFilterType = 'all' | 'disease' | 'symptom' | 'medicine' | 'guide' | 'cattle';

interface FilteringSearchProps {
  onSelectDisease: (disease: Disease) => void;
  onSelectMedicine: (medicine: MedicineEntry) => void;
  onSelectArticle: (article: CareGuideArticle) => void;
  onSelectSymptom: (symptom: SymptomItem) => void;
  onSelectCattle?: (cattle: CattleRecord) => void;
  cattleList?: CattleRecord[];
  isInline?: boolean; // if true, rendered as embedded widget on page
}

export const FilteringSearch: React.FC<FilteringSearchProps> = ({
  onSelectDisease,
  onSelectMedicine,
  onSelectArticle,
  onSelectSymptom,
  onSelectCattle,
  cattleList = [],
  isInline = false
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>('all');
  const [urgencyOnly, setUrgencyOnly] = useState(false);

  // Multi-dimensional filtering logic
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Diseases
    const diseases = (activeFilter === 'all' || activeFilter === 'disease')
      ? DISEASES_DATA.filter((d) => {
          const matchQuery = !q ||
            d.nameBn.toLowerCase().includes(q) ||
            d.nameEn.toLowerCase().includes(q) ||
            d.summary.toLowerCase().includes(q) ||
            d.commonSymptoms.some((s) => s.toLowerCase().includes(q));
          const matchUrgency = !urgencyOnly || d.urgency === 'urgent';
          return matchQuery && matchUrgency;
        })
      : [];

    // 2. Symptoms
    const symptoms = (activeFilter === 'all' || activeFilter === 'symptom')
      ? SYMPTOMS_LIST.filter((s) => {
          const matchQuery = !q ||
            s.nameBn.toLowerCase().includes(q) ||
            s.nameEn.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q);
          const matchUrgency = !urgencyOnly || s.isUrgentFlag;
          return matchQuery && matchUrgency;
        })
      : [];

    // 3. Medicines
    const medicines = (activeFilter === 'all' || activeFilter === 'medicine')
      ? MEDICINES_DATA.filter((m) => {
          const matchQuery = !q ||
            m.genericName.toLowerCase().includes(q) ||
            m.genericNameBn.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q) ||
            (m.commonBrands && m.commonBrands.toLowerCase().includes(q)) ||
            (m.targetDiseases && m.targetDiseases.some((td) => td.toLowerCase().includes(q))) ||
            (m.whenToUse && m.whenToUse.toLowerCase().includes(q)) ||
            (m.howToUse && m.howToUse.toLowerCase().includes(q)) ||
            m.intendedUses.some((u) => u.toLowerCase().includes(q));
          return matchQuery;
        })
      : [];

    // 4. Care Guides
    const guides = (activeFilter === 'all' || activeFilter === 'guide')
      ? CARE_GUIDE_ARTICLES.filter((a) => {
          const matchQuery = !q ||
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q);
          return matchQuery;
        })
      : [];

    // 5. Cattle
    const cattle = (activeFilter === 'all' || activeFilter === 'cattle')
      ? cattleList.filter((c) => {
          const matchQuery = !q ||
            c.name.toLowerCase().includes(q) ||
            c.tagId.toLowerCase().includes(q) ||
            c.breed.toLowerCase().includes(q) ||
            c.purpose.toLowerCase().includes(q);
          const matchUrgency = !urgencyOnly || c.status === 'চিকিৎসাধীন';
          return matchQuery && matchUrgency;
        })
      : [];

    const totalCount =
      diseases.length + symptoms.length + medicines.length + guides.length + cattle.length;

    return {
      diseases,
      symptoms,
      medicines,
      guides,
      cattle,
      totalCount
    };
  }, [query, activeFilter, urgencyOnly, cattleList]);

  const filterChips: { id: SearchFilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'সকল' },
    { id: 'disease', label: 'রোগ', count: DISEASES_DATA.length },
    { id: 'symptom', label: 'লক্ষণ', count: SYMPTOMS_LIST.length },
    { id: 'medicine', label: 'ওষুধ', count: MEDICINES_DATA.length },
    { id: 'guide', label: 'পালন গাইড', count: CARE_GUIDE_ARTICLES.length },
    { id: 'cattle', label: 'আমার গরু', count: cattleList.length }
  ];

  return (
    <div className={`bg-white rounded-2xl border border-[#E5EAE4] shadow-2xs overflow-hidden ${isInline ? 'p-3.5 sm:p-4' : 'p-4'}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-[#287447] absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="রোগ, লক্ষণ, ওষুধ, গরু বা খামার গাইড খুঁজুন…"
          className="w-full pl-11 pr-10 py-3 bg-[#F7F7F2] border border-[#E5EAE4] rounded-xl text-xs sm:text-sm text-[#202820] placeholder-[#6B756D] outline-none focus:border-[#287447] focus:bg-white transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 p-1 rounded-full text-[#6B756D] hover:bg-slate-200"
            title="মুছে ফেলুন"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs / Chips */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[#6B756D] font-semibold text-[11px] shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#287447]" />
          ফিল্টার:
        </span>
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all min-h-[34px] flex items-center gap-1 ${
                isActive
                  ? 'bg-[#287447] text-white shadow-xs'
                  : 'bg-[#F7F7F2] border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820] hover:bg-slate-100'
              }`}
            >
              <span>{chip.label}</span>
              {chip.count !== undefined && (
                <span className={`text-[10px] px-1 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'text-[#6B756D]'}`}>
                  {chip.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Urgency toggle */}
        <button
          onClick={() => setUrgencyOnly(!urgencyOnly)}
          className={`px-2.5 py-1.5 rounded-lg shrink-0 text-xs font-semibold border transition-all min-h-[34px] ml-auto flex items-center gap-1 ${
            urgencyOnly
              ? 'bg-[#FEE4E2] border-[#FECDCA] text-[#B42318]'
              : 'bg-white border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#B42318]" />
          <span>শুধুমাত্র জরুরি</span>
        </button>
      </div>

      {/* Live Results Preview Area (only when user has typed query or clicked a specific filter) */}
      {(query || activeFilter !== 'all' || urgencyOnly) && (
        <div className="mt-4 pt-3 border-t border-[#E5EAE4] max-h-96 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6B756D] px-1">
            <span>
              ফিল্টারকৃত ফলাফল: <b className="text-[#1E5635]">{results.totalCount} টি</b>
            </span>
            {(query || activeFilter !== 'all' || urgencyOnly) && (
              <button
                onClick={() => {
                  setQuery('');
                  setActiveFilter('all');
                  setUrgencyOnly(false);
                }}
                className="text-[11px] text-[#287447] hover:underline"
              >
                ফিল্টার মুছুন
              </button>
            )}
          </div>

          {results.totalCount === 0 ? (
            <div className="py-6 text-center text-xs text-[#6B756D]">
              <p className="font-semibold text-[#202820]">কোনো ফলাফল মেলেনি</p>
              <p className="text-[11px] text-[#6B756D] mt-0.5">
                অন্য কোনো শব্দ বা অন্য ফিল্টার নির্বাচন করে চেষ্টা করুন।
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Diseases results */}
              {results.diseases.map((dis) => (
                <div
                  key={dis.id}
                  onClick={() => onSelectDisease(dis)}
                  className="p-3 rounded-xl border border-[#E5EAE4] bg-[#F7F7F2]/60 hover:bg-[#EAF4EC]/50 hover:border-[#287447]/40 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#287447] bg-[#EAF4EC] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        রোগ
                      </span>
                      {dis.urgency === 'urgent' && (
                        <span className="text-[10px] font-bold text-[#B42318] bg-[#FEE4E2] px-1.5 py-0.5 rounded">
                          জরুরি
                        </span>
                      )}
                      <span className="font-bold text-xs sm:text-sm text-[#1E5635] group-hover:text-[#287447]">
                        {dis.nameBn}
                      </span>
                      <span className="text-[11px] text-[#6B756D] font-mono hidden sm:inline">
                        ({dis.nameEn})
                      </span>
                    </div>
                    <p className="text-xs text-[#6B756D] truncate mt-1">
                      {dis.summary}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B756D] group-hover:text-[#287447] shrink-0" />
                </div>
              ))}

              {/* Symptoms results */}
              {results.symptoms.map((sym) => (
                <div
                  key={sym.id}
                  onClick={() => onSelectSymptom(sym)}
                  className="p-2.5 rounded-xl border border-[#E5EAE4] bg-[#FFF9EE]/50 hover:bg-[#FFF9EE] hover:border-[#FADBA8] transition-all cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#B7791F] bg-[#FFF3DC] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        লক্ষণ
                      </span>
                      <span className="font-bold text-xs text-[#202820]">
                        {sym.nameBn}
                      </span>
                      <span className="text-[11px] text-[#6B756D] font-mono">
                        ({sym.nameEn})
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#B7791F] font-semibold bg-white px-2 py-0.5 rounded border border-[#FADBA8]">
                    যাচাই করুন
                  </span>
                </div>
              ))}

              {/* Medicines results */}
              {results.medicines.map((med) => (
                <div
                  key={med.id}
                  onClick={() => onSelectMedicine(med)}
                  className="p-3 rounded-xl border border-[#E5EAE4] bg-[#F7F7F2]/60 hover:bg-[#EAF4EC]/50 hover:border-[#287447]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {med.imageUrl ? (
                      <img
                        src={med.imageUrl}
                        alt={med.genericNameBn}
                        className="w-12 h-12 rounded-lg object-cover border border-[#E5EAE4] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#EAF4EC] border border-[#287447]/20 flex items-center justify-center text-[#287447] shrink-0">
                        <Pill className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-[#1E5635] bg-[#EAF4EC] px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Pill className="w-3 h-3" />
                          ওষুধ
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-[#1E5635] truncate">
                          {med.genericNameBn}
                        </span>
                        {med.commonBrands && (
                          <span className="text-[10px] text-[#287447] font-semibold bg-white px-1.5 py-0.5 rounded border border-[#E5EAE4]">
                            {med.commonBrands.split(',')[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B756D] truncate mt-0.5">
                        {med.speciesAndIndication} · রুট: {med.routeOfAdministration.split('(')[0]}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B756D] group-hover:text-[#287447] shrink-0" />
                </div>
              ))}

              {/* Guides results */}
              {results.guides.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="p-3 rounded-xl border border-[#E5EAE4] bg-[#F7F7F2]/60 hover:bg-[#EAF4EC]/50 hover:border-[#287447]/40 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#287447] bg-[#EAF4EC] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        গাইড
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-[#1E5635]">
                        {art.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B756D] truncate mt-0.5">
                      {art.category} · {art.summary}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B756D] group-hover:text-[#287447] shrink-0" />
                </div>
              ))}

              {/* Cattle results */}
              {results.cattle.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onSelectCattle && onSelectCattle(cat)}
                  className="p-3 rounded-xl border border-[#E5EAE4] bg-[#F7F7F2]/60 hover:bg-[#EAF4EC]/50 hover:border-[#287447]/40 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#1E5635] bg-[#EAF4EC] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        গরু
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-[#1E5635]">
                        {cat.name} ({cat.tagId})
                      </span>
                      <span className="text-[10px] text-[#6B756D]">
                        {cat.breed} · {cat.status}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B756D] group-hover:text-[#287447] shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
