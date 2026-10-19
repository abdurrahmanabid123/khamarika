import React from 'react';
import { X, Pill, AlertTriangle, ShieldAlert, CheckCircle, Clock, FileText, CheckCircle2, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { MedicineEntry } from '../types';

interface MedicineDetailModalProps {
  medicine: MedicineEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectDiseaseName?: (diseaseName: string) => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  isOpen,
  onClose,
  onSelectDiseaseName
}) => {
  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-[#1E5635] bg-[#EAF4EC] px-2.5 py-0.5 rounded-md border border-[#287447]/20">
                {medicine.category}
              </span>
              {medicine.professionalSupervisionRequired ? (
                <span className="text-[11px] font-bold text-[#B42318] bg-[#FEE4E2] px-2 py-0.5 rounded-md border border-[#FECDCA]">
                  প্রেসক্রিপশন আবশ্যক
                </span>
              ) : (
                <span className="text-[11px] font-bold text-[#287447] bg-[#EAF4EC] px-2 py-0.5 rounded-md border border-[#287447]/20">
                  নিরাপদ সাধারণ ওষুধ
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E5635] mt-1.5 tracking-tight">
              {medicine.genericNameBn}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B756D] font-mono mt-0.5">
              Generic: {medicine.genericName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-[#F7F7F2] transition-colors shrink-0"
            title="বন্ধ করুন"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-[#202820]">
          {/* Medicine Image & Brand Banner */}
          <div className="bg-[#F7F7F2] rounded-2xl border border-[#E5EAE4] p-3.5 flex flex-col sm:flex-row gap-4 items-center">
            {medicine.imageUrl ? (
              <div className="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden bg-white border border-[#E5EAE4] shrink-0 shadow-xs group">
                <img
                  src={medicine.imageUrl}
                  alt={medicine.genericNameBn}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-sans">
                  আসল ছবি
                </span>
              </div>
            ) : (
              <div className="w-full sm:w-44 h-44 rounded-xl bg-[#EAF4EC] border border-[#287447]/20 flex flex-col items-center justify-center text-[#287447] shrink-0">
                <Pill className="w-12 h-12 stroke-1" />
                <span className="text-xs font-semibold mt-2">ভেটেরিনারি ওষুধ</span>
              </div>
            )}

            <div className="space-y-2.5 flex-1 min-w-0">
              {medicine.commonBrands && (
                <div className="bg-white p-3 rounded-xl border border-[#E5EAE4]">
                  <span className="text-[11px] font-bold text-[#6B756D] uppercase block mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#287447]" />
                    বাংলাদেশে প্রচলিত জনপ্রিয় ব্র্যান্ডসমূহ:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#1E5635] leading-relaxed">
                    {medicine.commonBrands}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#E5EAE4]">
                  <span className="text-[10px] font-bold text-[#6B756D] block">প্রয়োগের মাধ্যম</span>
                  <span className="font-semibold text-[#202820] text-xs sm:text-[13px]">{medicine.routeOfAdministration}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E5EAE4]">
                  <span className="text-[10px] font-bold text-[#6B756D] block">অনুমোদিত প্রজাতি</span>
                  <span className="font-semibold text-[#202820] text-xs sm:text-[13px]">{medicine.speciesAndIndication}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Veterinary Safety Note */}
          <div className="bg-[#FFF9EE] border-2 border-[#E0A838]/50 p-4 rounded-xl text-xs sm:text-sm text-[#7A4B00] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#B7791F] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#7A4B00]">পশুচিকিৎসা ও ওষুধ সুরক্ষা নির্দেশিকা:</p>
              <p className="text-[#5C3800] leading-relaxed">
                “ওষুধের সঠিক ব্যবহার ও মাত্রা নির্ধারণে নিবন্ধিত পশুচিকিৎসকের পরামর্শ নিন। ভুল ওষুধ বা ভুল মাত্রা গরুর অঙ্গহানি ও মৃত্যুর ঝুঁকি তৈরি করতে পারে এবং দুধ ও মাংসের নিরাপত্তায় প্রভাব ফেলতে পারে।”
              </p>
            </div>
          </div>

          {/* Target Diseases (কোন কোন রোগে ব্যবহার করা হয়) */}
          {medicine.targetDiseases && medicine.targetDiseases.length > 0 && (
            <div className="bg-[#EAF4EC]/40 p-4 rounded-xl border border-[#287447]/30">
              <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#287447]" />
                <span>কোন কোন রোগে ব্যবহার করা হয় (Target Diseases)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {medicine.targetDiseases.map((dis, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#287447]/30 text-[#1E5635] text-xs font-semibold rounded-lg shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#287447]" />
                    {dis}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* When to use (কখন ব্যবহার করতে হবে) */}
          {medicine.whenToUse && (
            <div className="bg-[#FFFDF5] border border-[#FADBA8] p-4 rounded-xl">
              <h3 className="text-xs font-bold text-[#7A4B00] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B7791F]" />
                <span>কখন ব্যবহার করতে হবে (When to Use & Signs)</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3800] leading-relaxed">
                {medicine.whenToUse}
              </p>
            </div>
          )}

          {/* How to use (কীভাবে ব্যবহার করতে হবে) */}
          {medicine.howToUse && (
            <div className="bg-[#F7F7F2] border border-[#E5EAE4] p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#287447]" />
                <span>কীভাবে ব্যবহার করতে হবে (How to Use & Administration)</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#202820] leading-relaxed whitespace-pre-line">
                {medicine.howToUse}
              </p>
              {medicine.dosageGuideline && (
                <div className="mt-2.5 p-3 bg-white rounded-lg border border-[#E5EAE4] text-xs">
                  <span className="font-bold text-[#1E5635] block mb-0.5">মাত্রা ও ডোজ গাইডলাইন:</span>
                  <p className="text-[#202820] font-medium">{medicine.dosageGuideline}</p>
                </div>
              )}
            </div>
          )}

          {/* Intended Uses Bullet Points */}
          <div>
            <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2">
              প্রধান কার্যকারিতা ও ফলাফল
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {medicine.intendedUses.map((use, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F7F7F2] p-2.5 rounded-lg border border-[#E5EAE4]">
                  <CheckCircle className="w-4 h-4 text-[#287447] shrink-0 mt-0.5" />
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Withdrawal Period (Critical Food Safety) */}
          <div className="bg-[#EAF4EC]/60 border border-[#287447]/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-[#1E5635] font-bold text-sm mb-2">
              <Clock className="w-4 h-4 text-[#287447]" />
              <span>প্রত্যাহার কাল (Withholding / Withdrawal Period)</span>
            </div>
            <p className="text-xs text-[#6B756D] mb-2">
              ওষুধ প্রয়োগের পর পশুর দুধ ও মাংস মানুষের খাওয়ার উপযুক্ত হতে যে ন্যূনতম সময় প্রয়োজন:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="p-2.5 bg-white rounded-lg border border-[#E5EAE4] font-medium text-[#1E5635]">
                {medicine.withdrawalPeriodMilk}
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#E5EAE4] font-medium text-[#1E5635]">
                {medicine.withdrawalPeriodMeat}
              </div>
            </div>
          </div>

          {/* Contraindications & Adverse Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="bg-[#FEE4E2]/40 p-3.5 rounded-xl border border-[#FECDCA]">
              <h4 className="font-bold text-[#B42318] mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#B42318]" />
                <span>যেসব ক্ষেত্রে ব্যবহার নিষেধ</span>
              </h4>
              <ul className="space-y-1 text-xs text-[#202820]">
                {medicine.contraindications.map((contra, idx) => (
                  <li key={idx}>• {contra}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F7F7F2] p-3.5 rounded-xl border border-[#E5EAE4]">
              <h4 className="font-bold text-[#6B756D] mb-1.5">
                সম্ভাব্য পার্শ্বপ্রতিক্রিয়া
              </h4>
              <ul className="space-y-1 text-xs text-[#202820]">
                {medicine.adverseEffects.map((adv, idx) => (
                  <li key={idx}>• {adv}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Storage instructions */}
          <div className="text-xs bg-[#F7F7F2] p-3.5 rounded-xl border border-[#E5EAE4] space-y-1">
            <span className="font-bold text-[#6B756D] uppercase block">
              সংরক্ষণ নির্দেশিকা
            </span>
            <p className="text-[#202820]">{medicine.storageInstructions}</p>
          </div>

          {/* Source Document */}
          <div className="flex items-center justify-between text-xs text-[#6B756D] border-t border-[#E5EAE4] pt-3">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#287447]" />
              <span>উৎস: {medicine.sourceDoc} ({medicine.sourceDate})</span>
            </div>
            <span className="text-[11px] bg-[#EAF4EC] text-[#287447] px-2 py-0.5 rounded font-medium">
              যাচাইকৃত ভেটেরিনারি তথ্য
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-[#6B756D] hidden sm:inline">
            সঠিক ওষুধ প্রয়োগে পশুর জীবন বাঁচে এবং খামার সুরক্ষিত থাকে
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-[#287447] text-white hover:bg-[#1E5635] transition-colors shadow-xs ml-auto"
          >
            বুঝেছি / বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
