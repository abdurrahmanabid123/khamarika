import React, { useState, useEffect } from 'react';
import { X, Check, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { CattleRecord } from '../types';
import { compressImageFile } from '../utils/imageHelper';

interface AddEditCattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cattle: CattleRecord) => void;
  existingCattle?: CattleRecord | null;
}

export const AddEditCattleModal: React.FC<AddEditCattleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingCattle
}) => {
  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [breed, setBreed] = useState('দেশি শঙ্কর');
  const [sex, setSex] = useState<CattleRecord['sex']>('গাভী');
  const [dobOrAge, setDobOrAge] = useState('');
  const [purpose, setPurpose] = useState<CattleRecord['purpose']>('দুধ উৎপাদন (Dairy)');
  const [currentWeightKg, setCurrentWeightKg] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [status, setStatus] = useState<CattleRecord['status']>('সুস্থ');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [healthNotes, setHealthNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (existingCattle) {
      setName(existingCattle.name);
      setTagId(existingCattle.tagId);
      setBreed(existingCattle.breed);
      setSex(existingCattle.sex);
      setDobOrAge(existingCattle.dobOrAge);
      setPurpose(existingCattle.purpose);
      setCurrentWeightKg(existingCattle.currentWeightKg?.toString() || '');
      setPurchaseDate(existingCattle.purchaseDate || '');
      setPurchasePrice(existingCattle.purchasePrice?.toString() || '');
      setStatus(existingCattle.status);
      setPhotoUrl(existingCattle.photoUrl || '');
      setHealthNotes(existingCattle.healthNotes || '');
    } else {
      setName('');
      setTagId('');
      setBreed('দেশি শঙ্কর');
      setSex('গাভী');
      setDobOrAge('২ বছর');
      setPurpose('দুধ উৎপাদন (Dairy)');
      setCurrentWeightKg('');
      setPurchaseDate('');
      setPurchasePrice('');
      setStatus('সুস্থ');
      setPhotoUrl('');
      setHealthNotes('');
    }
    setErrorMsg('');
  }, [existingCattle, isOpen]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImageFile(file, 800, 800, 0.8);
      setPhotoUrl(compressedBase64);
    } catch (err: any) {
      setErrorMsg(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsCompressing(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !tagId.trim()) {
      setErrorMsg('অনুগ্রহ করে গরুর নাম অথবা ট্যাগ নম্বর লিখুন।');
      return;
    }

    const newRecord: CattleRecord = {
      id: existingCattle ? existingCattle.id : `cattle-${Date.now()}`,
      name: name.trim() || `গরু ${tagId.trim()}`,
      tagId: tagId.trim() || `BD-${Math.floor(100 + Math.random() * 900)}`,
      breed,
      sex,
      dobOrAge: dobOrAge.trim() || 'অজানা বয়স',
      purpose,
      currentWeightKg: currentWeightKg ? parseFloat(currentWeightKg) : undefined,
      purchaseDate: purchaseDate.trim() || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      status,
      photoUrl: photoUrl.trim() || undefined,
      healthNotes: healthNotes.trim() || undefined,
      vaccinations: existingCattle ? existingCattle.vaccinations : [],
      dewormingHistory: existingCattle ? existingCattle.dewormingHistory : [],
      treatments: existingCattle ? existingCattle.treatments : [],
      milkYieldRecords: existingCattle ? existingCattle.milkYieldRecords : []
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1E5635]">
              {existingCattle ? 'গরুর তথ্য সম্পাদনা' : 'নতুন গরু যুক্ত করুন'}
            </h2>
            <p className="text-xs text-[#6B756D]">
              খামারের তথ্য সঠিক ও হালনাগাদ রাখুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-[#F7F7F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 bg-[#FEE4E2] border border-[#FECDCA] text-[#B42318] rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Cattle Photo Upload / Preview */}
          <div className="bg-[#F7F7F2] p-3.5 rounded-2xl border border-[#E5EAE4]">
            <label className="font-semibold text-[#202820] block mb-2">
              গরুর ছবি (ফোন গ্যালারি বা ক্যামেরা থেকে)
            </label>
            <div className="flex items-center gap-3.5">
              {photoUrl ? (
                <div className="relative group shrink-0">
                  <img
                    src={photoUrl}
                    alt="Cattle preview"
                    className="w-20 h-20 rounded-xl object-cover border border-[#287447]/30 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute -top-1.5 -right-1.5 bg-[#B42318] text-white p-1 rounded-full shadow-xs hover:bg-red-700 transition-colors"
                    title="ছবি মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white border-2 border-dashed border-[#D2DDD0] flex flex-col items-center justify-center text-[#6B756D] shrink-0">
                  <Camera className="w-6 h-6 text-[#287447]" />
                  <span className="text-[10px] mt-1 text-slate-400">ছবি নেই</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E5EAE4] text-[#1E5635] font-semibold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors">
                  <Camera className="w-3.5 h-3.5 text-[#287447]" />
                  <span>{photoUrl ? 'ছবি পরিবর্তন করুন' : 'ছবি যোগ করুন'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#6B756D] mt-1.5">
                  {isCompressing
                    ? 'ছবি প্রক্রিয়াজাত করা হচ্ছে...'
                    : 'ফোন মেমোরিতে ছবি স্বয়ংক্রিয়ভাবে অপ্টিমাইজ হয়ে সংরক্ষিত হবে।'}
                </p>
              </div>
            </div>
          </div>

          {/* Name & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                গরুর নাম / ডাকনাম <span className="text-[#B42318]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: শাপলা, লাল মানিক"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                ট্যাগ বা আইডি নম্বর
              </label>
              <input
                type="text"
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
                placeholder="যেমন: BD-PAB-101"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
          </div>

          {/* Breed & Sex */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                জাত (Breed)
              </label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              >
                <option value="দেশি শঙ্কর">দেশি শঙ্কর</option>
                <option value="হলস্টাইন ফ্রিজিয়ান শঙ্কর">হলস্টাইন ফ্রিজিয়ান শঙ্কর</option>
                <option value="শাহীওয়াল শঙ্কর">শাহীওয়াল শঙ্কর</option>
                <option value="রেড চিটাগাং ক্যাটল (RCC)">রেড চিটাগাং ক্যাটল (RCC)</option>
                <option value="পাবনা জাত">পাবনা জাত</option>
                <option value="জার্সি শঙ্কর">জার্সি শঙ্কর</option>
                <option value="অন্যান্য জাত">অন্যান্য জাত</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                লিঙ্গ ও বয়স শ্রেণি
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as CattleRecord['sex'])}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              >
                <option value="গাভী">গাভী</option>
                <option value="ষাঁড়">ষাঁড়</option>
                <option value="বকনা">বকনা</option>
                <option value="এঁড়ে বাছুর">এঁড়ে বাছুর</option>
                <option value="বকনা বাছুর">বকনা বাছুর</option>
              </select>
            </div>
          </div>

          {/* Purpose & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                পালনের উদ্দেশ্য
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as CattleRecord['purpose'])}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              >
                <option value="দুধ উৎপাদন (Dairy)">দুধ উৎপাদন (Dairy)</option>
                <option value="মোটাতাজাকরণ (Beef Fattening)">মোটাতাজাকরণ (Beef Fattening)</option>
                <option value="প্রজনন (Breeding)">প্রজনন (Breeding)</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                বয়স বা জন্মতারিখ
              </label>
              <input
                type="text"
                value={dobOrAge}
                onChange={(e) => setDobOrAge(e.target.value)}
                placeholder="যেমন: ৩ বছর, অথবা ২০২৪-০১-১৫"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
          </div>

          {/* Weight & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                বর্তমান আনুমানিক ওজন (কেজি)
              </label>
              <input
                type="number"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(e.target.value)}
                placeholder="যেমন: ৩৫০"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                বর্তমান স্বাস্থ্য অবস্থা
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CattleRecord['status'])}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              >
                <option value="সুস্থ">সুস্থ</option>
                <option value="চিকিৎসাধীন">চিকিৎসাধীন (অসুস্থ)</option>
                <option value="গর্ভবতী">গর্ভবতী</option>
                <option value="সংরক্ষিত (Archived)">সংরক্ষিত (Archived)</option>
              </select>
            </div>
          </div>

          {/* Purchase details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                ক্রয়মূল্য (টাকা)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="যেমন: ৮৫০০০"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#202820] block mb-1">
                ক্রয়ের তারিখ
              </label>
              <input
                type="text"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                placeholder="যেমন: ২০২৪-০৩-১০"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-[#202820] block mb-1">
              স্বাস্থ্য ও বিশেষ মন্তব্য
            </label>
            <textarea
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              rows={2}
              placeholder="পশুর বংশমর্যাদা, দুধের পরিমাণ বা বিশেষ কোনো স্বভাব থাকলে লিখুন..."
              className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#E5EAE4] flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5EAE4] text-xs font-semibold rounded-xl text-[#6B756D] hover:bg-slate-100"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
