import React, { useState, useMemo } from 'react';
import { Search, Stethoscope, Pill, HelpCircle, Bookmark, AlertCircle, ArrowUpRight, Filter, ShieldAlert, Sparkles, Tag } from 'lucide-react';
import { DISEASES_DATA, MEDICINES_DATA } from '../data/seedData';
import { Disease, MedicineEntry } from '../types';

interface DiseaseScreenProps {
  onSelectDisease: (disease: Disease) => void;
  onSelectMedicine: (medicine: MedicineEntry) => void;
  onOpenSymptomChecker: () => void;
  bookmarks: string[];
  onToggleBookmark: (diseaseId: string) => void;
}

export const DiseaseScreen: React.FC<DiseaseScreenProps> = ({
  onSelectDisease,
  onSelectMedicine,
  onOpenSymptomChecker,
  bookmarks,
  onToggleBookmark
}) => {
  const [activeTab, setActiveTab] = useState<'diseases' | 'medicines'>('diseases');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [medicineCategoryFilter, setMedicineCategoryFilter] = useState<string>('all');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);

  // Filtered diseases
  const filteredDiseases = useMemo(() => {
    return DISEASES_DATA.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        d.nameBn.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.commonSymptoms.some((s) => s.toLowerCase().includes(q));

      const matchCategory = categoryFilter === 'all' || d.category === categoryFilter;
      const matchUrgency = urgencyFilter === 'all' || d.urgency === urgencyFilter;
      const matchBookmark = !onlyBookmarks || bookmarks.includes(d.id);

      return matchQuery && matchCategory && matchUrgency && matchBookmark;
    });
  }, [searchQuery, categoryFilter, urgencyFilter, onlyBookmarks, bookmarks]);

  // Unique target diseases for filter chips
  const diseaseFilterOptions = [
    { id: 'all', label: 'সকল রোগ' },
    { id: 'খুরা রোগ', label: 'খুরা রোগ' },
    { id: 'ওলান', label: 'ওলান ফোলা / ম্যাস্টাইটিস' },
    { id: 'গলাফুলা', label: 'গলাফুলা (HS)' },
    { id: 'বাদলা', label: 'বাদলা রোগ (BQ)' },
    { id: 'লাম্পি', label: 'লাম্পি স্কিন' },
    { id: 'পেট ফাঁপা', label: 'পেট ফাঁপা / ব্লট' },
    { id: 'কৃমি', label: 'কৃমি সংক্রমণ' },
    { id: 'ডায়রিয়া', label: 'বাছুরের ডায়রিয়া' },
    { id: 'মিল্ক ফিভার', label: 'মিল্ক ফিভার' },
    { id: 'ক্ষত', label: 'ক্ষত ও পোকা' }
  ];

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return MEDICINES_DATA.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        m.genericName.toLowerCase().includes(q) ||
        m.genericNameBn.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.commonBrands && m.commonBrands.toLowerCase().includes(q)) ||
        (m.whenToUse && m.whenToUse.toLowerCase().includes(q)) ||
        (m.howToUse && m.howToUse.toLowerCase().includes(q)) ||
        (m.targetDiseases && m.targetDiseases.some((td) => td.toLowerCase().includes(q))) ||
        m.intendedUses.some((u) => u.toLowerCase().includes(q));

      const matchCategory =
        medicineCategoryFilter === 'all' ||
        (medicineCategoryFilter === 'antibiotic' && (m.category.includes('অ্যান্টিবায়োটিক') || m.category.includes('অ্যান্টিব্যাকটেরিয়াল') || m.category.includes('Antibiotic'))) ||
        (medicineCategoryFilter === 'nsaid' && (m.category.includes('জ্বরনাশক') || m.category.includes('প্রদাহনাশক') || m.category.includes('ব্যথানাশক') || m.category.includes('NSAID'))) ||
        (medicineCategoryFilter === 'dewormer' && (m.category.includes('কৃমিনাশক') || m.category.includes('পরজীবী') || m.category.includes('Anthelmintic'))) ||
        (medicineCategoryFilter === 'digestive' && (m.category.includes('গ্যাসনাশক') || m.category.includes('পরিপাক') || m.category.includes('ল্যাক্সেটিভ') || m.category.includes('বাফার'))) ||
        (medicineCategoryFilter === 'mastitis' && (m.category.includes('ইন্ট্রা-ম্যামারি') || m.category.includes('ওলান') || m.category.includes('ম্যাস্টাইটিস'))) ||
        (medicineCategoryFilter === 'vitamins' && (m.category.includes('ক্যালসিয়াম') || m.category.includes('ভিটামিন') || m.category.includes('মিনারেল') || m.category.includes('টনিক'))) ||
        (medicineCategoryFilter === 'topical' && (m.category.includes('ক্ষত') || m.category.includes('অ্যান্টিসেপটিক') || m.category.includes('স্প্রে') || m.category.includes('পোকা')));

      const matchDisease =
        selectedDiseaseFilter === 'all' ||
        (m.targetDiseases && m.targetDiseases.some((td) => td.toLowerCase().includes(selectedDiseaseFilter.toLowerCase())));

      return matchQuery && matchCategory && matchDisease;
    });
  }, [searchQuery, medicineCategoryFilter, selectedDiseaseFilter]);

  return (
    <div className="space-y-4">
      {/* Top Banner & Symptom Checker Action */}
      <div className="bg-[#1E5635] text-white p-4 sm:p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#86EFAC]" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                পশু স্বাস্থ্য, রোগ ও ভেটেরিনারি ওষুধ ভাণ্ডার
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#D1FAE5] mt-1 max-w-xl">
              প্রাণিসম্পদ অধিদপ্তর (DLS) ও বিশ্ব প্রাণিস্বাস্থ্য সংস্থা নির্দেশিত নির্ভরযোগ্য তথ্যভাণ্ডার
            </p>
          </div>

          <button
            onClick={onOpenSymptomChecker}
            className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F7F7F2] text-[#1E5635] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 shrink-0 min-h-[44px]"
          >
            <HelpCircle className="w-4 h-4 text-[#287447]" />
            <span>লক্ষণ মিলিয়ে দেখুন (Symptom Checker)</span>
          </button>
        </div>
      </div>

      {/* Segmented Controls for Sub-views */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E5EAE4] pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F2] rounded-xl border border-[#E5EAE4]">
          <button
            onClick={() => setActiveTab('diseases')}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[38px] ${
              activeTab === 'diseases'
                ? 'bg-[#FFFFFF] text-[#1E5635] shadow-xs'
                : 'text-[#6B756D] hover:text-[#202820]'
            }`}
          >
            রোগের তালিকা ({DISEASES_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[38px] ${
              activeTab === 'medicines'
                ? 'bg-[#FFFFFF] text-[#1E5635] shadow-xs'
                : 'text-[#6B756D] hover:text-[#202820]'
            }`}
          >
            ওষুধ তথ্য কেন্দ্র ({MEDICINES_DATA.length})
          </button>
        </div>

        {activeTab === 'diseases' && (
          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 min-h-[38px] ${
              onlyBookmarks
                ? 'bg-[#EAF4EC] border-[#287447] text-[#1E5635]'
                : 'bg-white border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarks ? 'text-[#287447] fill-[#287447]' : ''}`} />
            <span>সংরক্ষিত ({bookmarks.length})</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'diseases'
                ? 'রোগের বাংলা বা ইংরেজি নাম দিয়ে খুঁজুন (যেমন: খুরা রোগ, লাম্পি স্কিন, ওলান পাকা...)'
                : 'ওষুধের জেনেরিক নাম, ব্র্যান্ড (যেমন Fast Vet, Renamycin, Almex) বা রোগ খুঁজুন...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5EAE4] rounded-xl text-xs sm:text-sm text-[#202820] placeholder-[#6B756D] focus:outline-none focus:border-[#287447] shadow-2xs"
          />
        </div>

        {/* Diseases categories */}
        {activeTab === 'diseases' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#6B756D] font-medium shrink-0 flex items-center gap-1 text-[11px] mr-1">
              <Filter className="w-3 h-3" />
              ক্যাটাগরি:
            </span>
            {[
              { id: 'all', label: 'সকল রোগ' },
              { id: 'infectious', label: 'সংক্রামক রোগ' },
              { id: 'reproductive', label: 'দুগ্ধ ও প্রজনন' },
              { id: 'digestive', label: 'পরিপাকতন্ত্র' },
              { id: 'calf', label: 'বাছুরের রোগ' },
              { id: 'metabolic', label: 'বিপাকীয়' },
              { id: 'parasitic', label: 'পরজীবী' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-[#287447] text-white shadow-xs'
                    : 'bg-white border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Medicines filters: by category and by target disease */}
        {activeTab === 'medicines' && (
          <div className="space-y-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[#6B756D] font-medium shrink-0 flex items-center gap-1 text-[11px] mr-1">
                <Pill className="w-3 h-3 text-[#287447]" />
                ধরণ:
              </span>
              {[
                { id: 'all', label: 'সকল ওষুধ' },
                { id: 'antibiotic', label: 'অ্যান্টিবায়োটিক' },
                { id: 'nsaid', label: 'জ্বর ও ব্যথানাশক' },
                { id: 'dewormer', label: 'কৃমিনাশক' },
                { id: 'digestive', label: 'পরিপাক ও পেট ফাঁপা' },
                { id: 'mastitis', label: 'ওলান প্রদাহ' },
                { id: 'vitamins', label: 'ক্যালসিয়াম ও ভিটামিন' },
                { id: 'topical', label: 'ক্ষত ও স্প্রে' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMedicineCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all ${
                    medicineCategoryFilter === cat.id
                      ? 'bg-[#287447] text-white shadow-xs'
                      : 'bg-white border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Target Disease Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[#6B756D] font-medium shrink-0 flex items-center gap-1 text-[11px] mr-1">
                <Tag className="w-3 h-3 text-[#B7791F]" />
                রোগ অনুযায়ী:
              </span>
              {diseaseFilterOptions.map((df) => (
                <button
                  key={df.id}
                  onClick={() => setSelectedDiseaseFilter(df.id)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 text-[11px] font-medium transition-all ${
                    selectedDiseaseFilter === df.id
                      ? 'bg-[#B7791F] text-white shadow-xs'
                      : 'bg-white border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DISEASES VIEW */}
      {activeTab === 'diseases' && (
        <div className="space-y-3">
          {filteredDiseases.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#E5EAE4] text-center text-[#6B756D]">
              <AlertCircle className="w-8 h-8 mx-auto text-[#B7791F] mb-1.5" />
              <p className="font-semibold text-[#202820]">কোনো রোগ পাওয়া যায়নি</p>
              <p className="text-xs mt-1">অনুসন্ধান বা ফিল্টারের মান পরিবর্তন করে চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDiseases.map((disease) => {
                const isBookmarked = bookmarks.includes(disease.id);
                const isUrgent = disease.urgency === 'urgent';
                return (
                  <div
                    key={disease.id}
                    className="bg-white p-4 rounded-2xl border border-[#E5EAE4] hover:border-[#287447]/40 transition-all shadow-2xs flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top tags */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isUrgent
                                ? 'bg-[#FEE4E2] text-[#B42318]'
                                : 'bg-[#FEF0C7] text-[#B7791F]'
                            }`}
                          >
                            {isUrgent ? 'জরুরি চিকিৎসা' : 'সতর্কতা'}
                          </span>
                          <span className="text-[11px] text-[#6B756D]">
                            {disease.categoryBn}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(disease.id);
                          }}
                          className="p-1 rounded-lg text-[#6B756D] hover:text-[#287447] transition-colors"
                          title={isBookmarked ? 'বুকমার্ক মুছুন' : 'বুকমার্ক করুন'}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              isBookmarked ? 'text-[#287447] fill-[#287447]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base text-[#1E5635] group-hover:text-[#287447] transition-colors">
                        {disease.nameBn}
                      </h3>
                      <p className="text-xs text-[#6B756D] font-mono mt-0.5">
                        {disease.nameEn}
                      </p>

                      {/* Summary */}
                      <p className="text-xs text-[#202820] line-clamp-2 mt-2 leading-relaxed">
                        {disease.summary}
                      </p>

                      {/* Common Symptoms preview */}
                      <div className="mt-3 pt-2.5 border-t border-[#E5EAE4]">
                        <span className="text-[11px] font-semibold text-[#6B756D] block mb-1">
                          প্রধান লক্ষণসমূহ:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {disease.commonSymptoms.slice(0, 3).map((sym, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#F7F7F2] text-[#202820] px-2 py-0.5 rounded border border-[#E5EAE4]"
                            >
                              • {sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-4 pt-3 border-t border-[#E5EAE4] flex items-center justify-between">
                      <span className="text-[11px] text-[#6B756D]">
                        উৎস: {disease.sources[0]?.organization.split(',')[0]}
                      </span>
                      <button
                        onClick={() => onSelectDisease(disease)}
                        className="px-3 py-1.5 bg-[#EAF4EC] hover:bg-[#287447] text-[#1E5635] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors min-h-[36px]"
                      >
                        <span>চিকিৎসা ও গাইড</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MEDICINES VIEW */}
      {activeTab === 'medicines' && (
        <div className="space-y-4">
          {/* Prominent Safety Disclaimer */}
          <div className="bg-[#FFF9EE] border border-[#FADBA8] p-3.5 rounded-xl text-xs text-[#7A4B00] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#B7791F] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">ভেটেরিনারি সতর্কতা: </span>
              “ওষুধের সঠিক ব্যবহার ও মাত্রা নির্ধারণে নিবন্ধিত পশুচিকিৎসকের পরামর্শ নিন। প্রতিটি ওষুধের ছবি, কখন ও কীভাবে ব্যবহার করতে হবে এবং কোন কোন রোগে ব্যবহারযোগ্য তা বিস্তারিত কার্ডে যুক্ত আছে।”
            </p>
          </div>

          {filteredMedicines.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#E5EAE4] text-center text-[#6B756D]">
              <AlertCircle className="w-8 h-8 mx-auto text-[#B7791F] mb-1.5" />
              <p className="font-semibold text-[#202820]">কোনো ওষুধ পাওয়া যায়নি</p>
              <p className="text-xs mt-1">অনুসন্ধান বা ফিল্টারের মান পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMedicines.map((med) => (
                <div
                  key={med.id}
                  className="bg-white p-4 rounded-2xl border border-[#E5EAE4] hover:border-[#287447]/50 transition-all shadow-2xs flex flex-col justify-between group"
                >
                  <div>
                    {/* Top image & headline row */}
                    <div className="flex gap-3 items-start">
                      {med.imageUrl ? (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F7F7F2] border border-[#E5EAE4] shrink-0 shadow-2xs">
                          <img
                            src={med.imageUrl}
                            alt={med.genericNameBn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#EAF4EC] border border-[#287447]/20 flex flex-col items-center justify-center text-[#287447] shrink-0">
                          <Pill className="w-8 h-8" />
                          <span className="text-[10px] font-semibold mt-1">ওষুধ</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-semibold text-[#1E5635] bg-[#EAF4EC] px-2 py-0.5 rounded">
                            {med.category.split('(')[0].trim()}
                          </span>
                          {med.professionalSupervisionRequired && (
                            <span className="text-[9px] font-bold text-[#B42318] bg-[#FEE4E2] px-1.5 py-0.5 rounded">
                              ডাক্তারের পরামর্শে
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-[#1E5635] leading-snug group-hover:text-[#287447] transition-colors">
                          {med.genericNameBn}
                        </h3>
                        <p className="text-[11px] text-[#6B756D] font-mono truncate">
                          {med.genericName}
                        </p>

                        {med.commonBrands && (
                          <p className="text-[11px] text-[#287447] font-semibold mt-1 truncate">
                            ব্র্যান্ড: {med.commonBrands.split(',').slice(0, 3).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Target Diseases Chips */}
                    {med.targetDiseases && med.targetDiseases.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#E5EAE4]">
                        <span className="text-[10px] font-bold text-[#6B756D] uppercase block mb-1">
                          যেসব রোগে প্রযোজ্য:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {med.targetDiseases.slice(0, 3).map((dis, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#EAF4EC] text-[#1E5635] px-2 py-0.5 rounded border border-[#287447]/20 font-medium"
                            >
                              ✓ {dis}
                            </span>
                          ))}
                          {med.targetDiseases.length > 3 && (
                            <span className="text-[10px] text-[#6B756D] self-center">
                              +{med.targetDiseases.length - 3} আরও
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* When & How Quick Snippet */}
                    <div className="mt-2.5 space-y-1.5 text-xs bg-[#F7F7F2] p-2.5 rounded-xl border border-[#E5EAE4]">
                      {med.whenToUse && (
                        <p className="text-[#202820] line-clamp-2 text-[11px] leading-relaxed">
                          <span className="font-bold text-[#B7791F]">কখন ব্যবহার্য: </span>
                          {med.whenToUse}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-[#6B756D] pt-1 border-t border-[#E5EAE4]">
                        <span>রুট: {med.routeOfAdministration.split('(')[0].trim()}</span>
                        <span className="text-[#1E5635] font-semibold">দুধ প্রত্যাহার: {med.withdrawalPeriodMilk.split('(')[0].trim()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E5EAE4] flex items-center justify-between">
                    <span className="text-[10px] text-[#6B756D]">
                      উৎস: {med.sourceDoc.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => onSelectMedicine(med)}
                      className="px-3 py-1.5 bg-[#EAF4EC] hover:bg-[#287447] text-[#1E5635] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors min-h-[36px]"
                    >
                      <span>ব্যবহার ও মাত্রা দেখুন</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
