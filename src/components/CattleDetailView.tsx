import React, { useState } from 'react';
import { ArrowLeft, Edit3, Archive, Trash2, Calendar, Activity, Shield, Plus, AlertCircle, FileText, CheckCircle2, Camera } from 'lucide-react';
import { CattleRecord } from '../types';
import { toBengaliNumber, formatTaka } from '../utils/storage';
import { compressImageFile } from '../utils/imageHelper';

interface CattleDetailViewProps {
  cattle: CattleRecord;
  onBack: () => void;
  onEdit: (cattle: CattleRecord) => void;
  onArchive: (cattleId: string) => void;
  onDelete: (cattleId: string) => void;
  onUpdateCattle: (updated: CattleRecord) => void;
}

export const CattleDetailView: React.FC<CattleDetailViewProps> = ({
  cattle,
  onBack,
  onEdit,
  onArchive,
  onDelete,
  onUpdateCattle
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'vaccines' | 'routine' | 'production'>('overview');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPhotoUpdating, setIsPhotoUpdating] = useState(false);

  const handleQuickPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsPhotoUpdating(true);
      const compressed = await compressImageFile(file, 800, 800, 0.8);
      onUpdateCattle({
        ...cattle,
        photoUrl: compressed
      });
    } catch (err: any) {
      alert(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsPhotoUpdating(false);
    }
  };

  // Quick Add forms
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState('');
  const [newVaccineDate, setNewVaccineDate] = useState('');
  const [newVaccineNext, setNewVaccineNext] = useState('');

  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [newTreatmentCondition, setNewTreatmentCondition] = useState('');
  const [newTreatmentDoctor, setNewTreatmentDoctor] = useState('');
  const [newTreatmentNotes, setNewTreatmentNotes] = useState('');

  const [showAddMilk, setShowAddMilk] = useState(false);
  const [morningLiters, setMorningLiters] = useState('');
  const [eveningLiters, setEveningLiters] = useState('');

  const handleSaveVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaccineName.trim()) return;
    const updated: CattleRecord = {
      ...cattle,
      vaccinations: [
        ...cattle.vaccinations,
        {
          id: `v-${Date.now()}`,
          vaccineName: newVaccineName.trim(),
          date: newVaccineDate || new Date().toISOString().split('T')[0],
          nextDueDate: newVaccineNext || undefined
        }
      ]
    };
    onUpdateCattle(updated);
    setNewVaccineName('');
    setNewVaccineDate('');
    setNewVaccineNext('');
    setShowAddVaccine(false);
  };

  const handleSaveTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreatmentCondition.trim()) return;
    const updated: CattleRecord = {
      ...cattle,
      treatments: [
        ...cattle.treatments,
        {
          id: `t-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          condition: newTreatmentCondition.trim(),
          prescribedBy: newTreatmentDoctor.trim() || 'রেজিস্টার্ড পশুচিকিৎসক',
          notes: newTreatmentNotes.trim()
        }
      ]
    };
    onUpdateCattle(updated);
    setNewTreatmentCondition('');
    setNewTreatmentDoctor('');
    setNewTreatmentNotes('');
    setShowAddTreatment(false);
  };

  const handleSaveMilk = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseFloat(morningLiters) || 0;
    const ev = parseFloat(eveningLiters) || 0;
    if (m === 0 && ev === 0) return;
    const today = new Date().toISOString().split('T')[0];
    const updated: CattleRecord = {
      ...cattle,
      milkYieldRecords: [
        ...(cattle.milkYieldRecords || []),
        { date: today, morningLiters: m, eveningLiters: ev }
      ]
    };
    onUpdateCattle(updated);
    setMorningLiters('');
    setEveningLiters('');
    setShowAddMilk(false);
  };

  const isSick = cattle.status === 'চিকিৎসাধীন';

  return (
    <div className="space-y-4">
      {/* Top action bar with back button */}
      <div className="flex items-center justify-between gap-2 bg-white p-3 sm:p-4 rounded-2xl border border-[#E5EAE4]">
        <button
          onClick={onBack}
          className="min-h-[44px] px-3 py-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1E5635] hover:bg-[#F7F7F2] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল গরু</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(cattle)}
            className="min-h-[44px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#202820] bg-[#F7F7F2] hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#287447]" />
            <span>সম্পাদনা</span>
          </button>
          <button
            onClick={() => onArchive(cattle.id)}
            className="min-h-[44px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6B756D] bg-[#F7F7F2] hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{cattle.status === 'সংরক্ষিত (Archived)' ? 'পুনরুদ্ধার' : 'আর্কাইভ'}</span>
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="min-h-[44px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#B42318] bg-[#FEE4E2]/40 hover:bg-[#FEE4E2] rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">মুছুন</span>
          </button>
        </div>
      </div>

      {/* Confirmation modal for delete */}
      {confirmDelete && (
        <div className="bg-[#FEE4E2] border border-[#FECDCA] p-4 rounded-2xl text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <p className="font-bold text-[#B42318]">আপনি কি নিশ্চিত এই গরুর রেকর্ডটি মুছে ফেলতে চান?</p>
            <p className="text-[#7A271A] text-xs mt-0.5">এই তথ্য আর পুনরুদ্ধার করা যাবে না।</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 bg-white text-[#202820] rounded-lg text-xs font-semibold"
            >
              বাতিল
            </button>
            <button
              onClick={() => onDelete(cattle.id)}
              className="px-4 py-1.5 bg-[#B42318] text-white rounded-lg text-xs font-bold"
            >
              হ্যাঁ, মুছে ফেলুন
            </button>
          </div>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E5EAE4] shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="relative group cursor-pointer shrink-0" title="গরুর ছবি পরিবর্তন করতে ক্লিক করুন">
            {cattle.photoUrl ? (
              <img
                src={cattle.photoUrl}
                alt={cattle.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#287447]/30 shadow-xs group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#EAF4EC] border-2 border-[#287447]/20 flex items-center justify-center text-[#1E5635] text-2xl font-bold group-hover:bg-[#d8eedb] transition-colors">
                {cattle.name.slice(0, 2)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-[#287447] text-white p-1 rounded-full shadow-xs border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleQuickPhotoChange}
              className="hidden"
            />
          </label>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#287447] bg-[#EAF4EC] px-2 py-0.5 rounded">
                ট্যাগ: {cattle.tagId}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isSick
                    ? 'bg-[#FEE4E2] text-[#B42318]'
                    : 'bg-[#EAF4EC] text-[#287447]'
                }`}
              >
                {cattle.status}
              </span>
              <span className="text-xs text-[#6B756D]">
                {cattle.purpose}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#1E5635] mt-1">
              {cattle.name}
            </h2>
            <div className="text-xs text-[#6B756D] flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span>জাত: <b className="text-[#202820]">{cattle.breed}</b></span>
              <span>·</span>
              <span>শ্রেণি: <b className="text-[#202820]">{cattle.sex}</b></span>
              <span>·</span>
              <span>বয়স: <b className="text-[#202820]">{cattle.dobOrAge}</b></span>
              {cattle.currentWeightKg && (
                <>
                  <span>·</span>
                  <span>ওজন: <b className="text-[#202820]">{toBengaliNumber(cattle.currentWeightKg)} কেজি</b></span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm border-b border-[#E5EAE4]">
        {[
          { id: 'overview', label: 'সংক্ষিপ্ত পরিচিতি' },
          { id: 'health', label: `চিকিৎসা (${cattle.treatments?.length || 0})` },
          { id: 'vaccines', label: `টিকা ও কৃমি (${(cattle.vaccinations?.length || 0) + (cattle.dewormingHistory?.length || 0)})` },
          { id: 'production', label: 'দুধ উৎপাদন' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 font-semibold rounded-xl shrink-0 transition-all min-h-[40px] ${
              activeTab === tab.id
                ? 'bg-[#287447] text-white shadow-xs'
                : 'bg-white border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] space-y-3">
            <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider">
              খামার ও বংশমর্যাদা বিবরণ
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#6B756D]">আইডি / ট্যাগ</span>
                <span className="font-bold text-[#202820]">{cattle.tagId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#6B756D]">জাতের ধরন</span>
                <span className="font-semibold text-[#202820]">{cattle.breed}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#6B756D]">পালনের উদ্দেশ্য</span>
                <span className="font-semibold text-[#202820]">{cattle.purpose}</span>
              </div>
              {cattle.purchasePrice !== undefined && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-[#6B756D]">ক্রয়মূল্য</span>
                  <span className="font-bold text-[#1E5635]">{formatTaka(cattle.purchasePrice)}</span>
                </div>
              )}
              {cattle.purchaseDate && (
                <div className="flex justify-between py-1.5">
                  <span className="text-[#6B756D]">ক্রয়ের তারিখ</span>
                  <span className="font-semibold text-[#202820]">{cattle.purchaseDate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E5EAE4] space-y-3">
            <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider">
              স্বাস্থ্য মন্তব্য ও বিশেষ যত্ন
            </h3>
            <p className="text-xs sm:text-sm text-[#202820] leading-relaxed bg-[#F7F7F2] p-3.5 rounded-xl border border-[#E5EAE4]">
              {cattle.healthNotes || 'কোনো বিশেষ স্বাস্থ্য মন্তব্য যোগ করা হয়নি।'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: HEALTH & TREATMENTS */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E5635]">চিকিৎসা ও প্রেসক্রিপশন রেকর্ড</h3>
            <button
              onClick={() => setShowAddTreatment(true)}
              className="px-3 py-1.5 bg-[#287447] text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:bg-[#1E5635]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>চিকিৎসা যোগ করুন</span>
            </button>
          </div>

          {showAddTreatment && (
            <form onSubmit={handleSaveTreatment} className="p-4 bg-[#F7F7F2] rounded-2xl border border-[#E5EAE4] space-y-3 text-xs">
              <h4 className="font-bold text-[#1E5635]">নতুন চিকিৎসার তথ্য</h4>
              <div>
                <label className="font-semibold block mb-1">অসুস্থতা বা লক্ষণ</label>
                <input
                  type="text"
                  value={newTreatmentCondition}
                  onChange={(e) => setNewTreatmentCondition(e.target.value)}
                  placeholder="যেমন: জ্বর ও খাওয়া কমে যাওয়া"
                  className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">চিকিৎসকের নাম ও পদবি</label>
                <input
                  type="text"
                  value={newTreatmentDoctor}
                  onChange={(e) => setNewTreatmentDoctor(e.target.value)}
                  placeholder="যেমন: ডাঃ মোস্তাফিজুর রহমান"
                  className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">প্রদত্ত ওষুধ ও পরামর্শ</label>
                <textarea
                  value={newTreatmentNotes}
                  onChange={(e) => setNewTreatmentNotes(e.target.value)}
                  placeholder="যেমন: প্যারাসিটামল বোলাস ৩ দিন, স্যালাইন..."
                  rows={2}
                  className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTreatment(false)}
                  className="px-3 py-1.5 bg-white border border-[#E5EAE4] rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#287447] text-white font-semibold rounded-lg"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          )}

          {cattle.treatments.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-[#E5EAE4] text-center text-xs text-[#6B756D]">
              এই গরুর চিকিৎসার কোনো পূর্ববর্তী রেকর্ড নেই।
            </div>
          ) : (
            <div className="space-y-2">
              {cattle.treatments.map((tr) => (
                <div key={tr.id} className="bg-white p-3.5 rounded-xl border border-[#E5EAE4] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1E5635] text-sm">{tr.condition}</span>
                    <span className="text-[#6B756D]">{tr.date}</span>
                  </div>
                  <p className="text-xs text-[#202820]">
                    <span className="font-semibold">চিকিৎসক: </span>{tr.prescribedBy}
                  </p>
                  {tr.notes && (
                    <p className="text-xs text-[#6B756D] bg-[#F7F7F2] p-2 rounded-lg mt-1">
                      {tr.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VACCINES & DEWORMING */}
      {activeTab === 'vaccines' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E5635]">টিকা প্রদানের ইতিবৃত্ত</h3>
            <button
              onClick={() => setShowAddVaccine(true)}
              className="px-3 py-1.5 bg-[#287447] text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:bg-[#1E5635]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>টিকা যোগ করুন</span>
            </button>
          </div>

          {showAddVaccine && (
            <form onSubmit={handleSaveVaccine} className="p-4 bg-[#F7F7F2] rounded-2xl border border-[#E5EAE4] space-y-3 text-xs">
              <h4 className="font-bold text-[#1E5635]">নতুন টিকা রেকর্ড</h4>
              <div>
                <label className="font-semibold block mb-1">টিকার নাম</label>
                <input
                  type="text"
                  value={newVaccineName}
                  onChange={(e) => setNewVaccineName(e.target.value)}
                  placeholder="যেমন: এফএমডি ট্রাইভ্যালেন্ট বা গলাফুলা টিকা"
                  className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">প্রদানের তারিখ</label>
                  <input
                    type="date"
                    value={newVaccineDate}
                    onChange={(e) => setNewVaccineDate(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">পরবর্তী বুস্টার তারিখ</label>
                  <input
                    type="date"
                    value={newVaccineNext}
                    onChange={(e) => setNewVaccineNext(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVaccine(false)}
                  className="px-3 py-1.5 bg-white border border-[#E5EAE4] rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#287447] text-white font-semibold rounded-lg"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {cattle.vaccinations.map((vac) => (
              <div key={vac.id} className="bg-white p-3.5 rounded-xl border border-[#E5EAE4] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#1E5635] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#287447]" />
                    <span>{vac.vaccineName}</span>
                  </div>
                  <div className="text-xs text-[#6B756D] mt-0.5">
                    প্রদানের তারিখ: {vac.date} {vac.veterinarian ? `· ${vac.veterinarian}` : ''}
                  </div>
                </div>
                {vac.nextDueDate && (
                  <span className="text-xs font-semibold text-[#B7791F] bg-[#FFF9EE] px-2.5 py-1 rounded-lg border border-[#FADBA8]">
                    পরবর্তী: {vac.nextDueDate}
                  </span>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-[#1E5635] pt-3">কৃমিনাশক দেওয়ার তালিকা</h3>
          <div className="space-y-2">
            {cattle.dewormingHistory.map((dew) => (
              <div key={dew.id} className="bg-white p-3 rounded-xl border border-[#E5EAE4] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-[#202820]">{dew.medicineName}</div>
                  <div className="text-[11px] text-[#6B756D]">প্রদানের তারিখ: {dew.date}</div>
                </div>
                {dew.nextDueDate && (
                  <span className="text-xs text-[#6B756D]">পরবর্তী: {dew.nextDueDate}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTION */}
      {activeTab === 'production' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E5635]">দৈনিক দুধ উৎপাদন রেকর্ড</h3>
            <button
              onClick={() => setShowAddMilk(true)}
              className="px-3 py-1.5 bg-[#287447] text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:bg-[#1E5635]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>দুধ রেকর্ড যোগ</span>
            </button>
          </div>

          {showAddMilk && (
            <form onSubmit={handleSaveMilk} className="p-4 bg-[#F7F7F2] rounded-2xl border border-[#E5EAE4] space-y-3 text-xs">
              <h4 className="font-bold text-[#1E5635]">আজকের দুধের পরিমাণ</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">সকাল (লিটার)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={morningLiters}
                    onChange={(e) => setMorningLiters(e.target.value)}
                    placeholder="যেমন: ৮.৫"
                    className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">বিকাল (লিটার)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={eveningLiters}
                    onChange={(e) => setEveningLiters(e.target.value)}
                    placeholder="যেমন: ৬.০"
                    className="w-full p-2 bg-white border border-[#E5EAE4] rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilk(false)}
                  className="px-3 py-1.5 bg-white border border-[#E5EAE4] rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#287447] text-white font-semibold rounded-lg"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          )}

          {(!cattle.milkYieldRecords || cattle.milkYieldRecords.length === 0) ? (
            <div className="bg-white p-6 rounded-2xl border border-[#E5EAE4] text-center text-xs text-[#6B756D]">
              দুধ উৎপাদনের কোনো রেকর্ড নেই। গাভীর দুধ পরিমাপ করে প্রতিদিন যোগ করুন।
            </div>
          ) : (
            <div className="space-y-2">
              {cattle.milkYieldRecords.map((m, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-[#E5EAE4] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#202820]">{m.date}</span>
                    <span className="text-[#6B756D] ml-2">
                      (সকাল: {toBengaliNumber(m.morningLiters)} লিটার + বিকাল: {toBengaliNumber(m.eveningLiters)} লিটার)
                    </span>
                  </div>
                  <span className="font-bold text-sm text-[#1E5635]">
                    মোট: {toBengaliNumber((m.morningLiters + m.eveningLiters).toFixed(1))} লিটার
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
