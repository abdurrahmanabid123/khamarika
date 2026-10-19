import React from 'react';
import { X, Bookmark, BookmarkCheck, AlertOctagon, CheckCircle2, XCircle, Stethoscope, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';
import { Disease } from '../types';

interface DiseaseDetailModalProps {
  disease: Disease | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (diseaseId: string) => void;
  onSelectRelated?: (diseaseName: string) => void;
}

export const DiseaseDetailModal: React.FC<DiseaseDetailModalProps> = ({
  disease,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectRelated
}) => {
  if (!isOpen || !disease) return null;

  const isUrgent = disease.urgency === 'urgent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Sticky Header with Title, Urgency, and Actions */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isUrgent
                    ? 'bg-[#FEE4E2] text-[#B42318] border border-[#FECDCA]'
                    : 'bg-[#FEF0C7] text-[#B7791F] border border-[#FEDF89]'
                }`}
              >
                {isUrgent ? 'জরুরি চিকিৎসা প্রয়োজন' : 'সতর্কতা ও পর্যবেক্ষণ'}
              </span>
              <span className="text-xs text-[#6B756D]">
                {disease.categoryBn}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E5635] mt-1 tracking-tight">
              {disease.nameBn}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B756D] font-mono mt-0.5">
              {disease.nameEn}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleBookmark(disease.id)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition-colors ${
                isBookmarked
                  ? 'bg-[#EAF4EC] border-[#287447] text-[#287447]'
                  : 'bg-white border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
              }`}
              title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্ক করুন'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-[#287447]" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-[#F7F7F2] transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 text-[#202820]">
          {/* Veterinary Disclaimer Callout */}
          <div className="bg-[#FFF9EE] border border-[#FADBA8] p-3.5 rounded-xl text-xs text-[#7A4B00] flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-[#B7791F] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">জরুরি চিকিৎসা ও শিক্ষামূলক ঘোষণা:</p>
              <p className="mt-0.5 text-[#5C3800]">
                এই বিবরণীটি সাধারণ সচেতনতা ও জরুরি প্রাথমিক নির্দেশনার জন্য সংকলিত। এটি সরাসরি কোনো একক পশুর নির্ভুল রোগ নির্ণয় নয়। সঠিক ওষুধ প্রয়োগে অবশ্যই নিবন্ধিত পশুচিকিৎসকের পরামর্শ নিন।
              </p>
            </div>
          </div>

          {/* 1. Summary */}
          <div>
            <h3 className="text-sm font-bold text-[#1E5635] uppercase tracking-wider mb-1.5">
              ১. রোগের সংক্ষিপ্ত পরিচিতি
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[#202820] bg-[#F7F7F2] p-3.5 rounded-xl border border-[#E5EAE4]">
              {disease.summary}
            </p>
          </div>

          {/* 2. Common Symptoms */}
          <div>
            <h3 className="text-sm font-bold text-[#1E5635] uppercase tracking-wider mb-2">
              ২. সাধারণ লক্ষণসমূহ
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {disease.commonSymptoms.map((sym, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5EAE4]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#B42318] shrink-0 mt-1.5" />
                  <span className="text-[#202820]">{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Causes & Risks and Transmission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#F7F7F2] p-4 rounded-xl border border-[#E5EAE4]">
              <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2">
                ৩. সম্ভাব্য কারণ ও ঝুঁকির বিষয়
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#202820]">
                {disease.causesAndRisks.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#287447] font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {disease.transmission && (
              <div className="bg-[#F7F7F2] p-4 rounded-xl border border-[#E5EAE4]">
                <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2">
                  ৪. কীভাবে ছড়াতে পারে
                </h3>
                <p className="text-xs sm:text-sm text-[#202820] leading-relaxed">
                  {disease.transmission}
                </p>
              </div>
            )}
          </div>

          {/* 4. Safe Immediate Steps vs What NOT to do */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Safe steps */}
            <div className="bg-[#EAF4EC]/70 p-4 rounded-xl border border-[#287447]/20">
              <div className="flex items-center gap-1.5 text-[#1E5635] font-bold text-sm mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#287447]" />
                <span>প্রাথমিক নিরাপদ করণীয়</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#202820]">
                {disease.safeImmediateSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#287447] font-semibold text-xs mt-0.5">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What not to do */}
            <div className="bg-[#FEE4E2]/40 p-4 rounded-xl border border-[#FECDCA]">
              <div className="flex items-center gap-1.5 text-[#B42318] font-bold text-sm mb-2.5">
                <XCircle className="w-4 h-4 text-[#B42318]" />
                <span>যা করা একেবারেই উচিত নয়</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#202820]">
                {disease.whatNotToDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#B42318] font-semibold text-xs mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. When to Call Vet */}
          <div className="bg-[#FBF6ED] p-4 rounded-xl border border-[#E0D0B6]">
            <div className="flex items-center gap-2 text-[#7A4B00] font-bold text-sm mb-2">
              <Stethoscope className="w-4 h-4 text-[#B7791F]" />
              <span>কখন জরুরি পশুচিকিৎসক ডাকবেন</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#202820]">
              {disease.whenToCallVet.map((vet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#B7791F] font-bold">!</span>
                  <span>{vet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Prevention & Vaccination */}
          <div className="bg-[#F7F7F2] p-4 rounded-xl border border-[#E5EAE4]">
            <div className="flex items-center gap-2 text-[#1E5635] font-bold text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-[#287447]" />
              <span>প্রতিরোধের উপায় ও টিকা শিডিউল</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#202820] mb-3">
              {disease.prevention.map((prev, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#287447]">•</span>
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
            {disease.vaccinationInfo && (
              <div className="mt-2 text-xs bg-white p-3 rounded-lg border border-[#E5EAE4] text-[#1E5635]">
                <span className="font-bold">টিকার বিবরণ: </span>
                {disease.vaccinationInfo}
              </div>
            )}
          </div>

          {/* 7. Related Conditions */}
          {disease.relatedConditions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#6B756D] uppercase mb-1.5">
                সম্পর্কিত রোগ ও লক্ষণ সাদৃশ্য
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {disease.relatedConditions.map((rel, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#F7F7F2] border border-[#E5EAE4] px-2.5 py-1 rounded-md text-[#202820]"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 8. Sources & Verification Metadata */}
          <div className="border-t border-[#E5EAE4] pt-4 text-xs text-[#6B756D] space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E5635]">
              <Calendar className="w-3.5 h-3.5" />
              <span>তথ্যের উৎস ও নির্ভরযোগ্যতা যাচাই</span>
            </div>
            {disease.sources.map((src, idx) => (
              <div key={idx} className="bg-[#F7F7F2] p-2.5 rounded-lg border border-[#E5EAE4] flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="font-medium text-[#202820]">{src.title}</div>
                  <div className="text-[11px] text-[#6B756D] mt-0.5">
                    প্রকাশক: {src.organization} · যাচাইকৃত তারিখ: {src.verificationDate}
                  </div>
                </div>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[11px] text-[#287447] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>উৎস লিঙ্ক</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={() => onToggleBookmark(disease.id)}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border border-[#E5EAE4] bg-white text-[#202820] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[#287447]" />
                <span>বুকমার্ক করা আছে</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-[#6B756D]" />
                <span>বুকমার্কে যুক্ত করুন</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#287447] text-white hover:bg-[#1E5635] transition-colors"
          >
            বুঝেছি / বন্ধ
          </button>
        </div>
      </div>
    </div>
  );
};
