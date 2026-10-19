import React from 'react';
import { X, ShieldAlert, CheckCircle2, PhoneCall } from 'lucide-react';

interface VeterinaryDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VeterinaryDisclaimerModal: React.FC<VeterinaryDisclaimerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#FFF9EE] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF0C7] text-[#B7791F] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#7A4B00]">
                পশুচিকিৎসা ও আইনি নির্দেশিকা
              </h2>
              <p className="text-xs text-[#93370D]">
                সঠিক চিকিৎসা ও পশুর জীবন সুরক্ষার অঙ্গীকার
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

        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-[#202820] leading-relaxed">
          <div className="p-3.5 bg-[#FFF9EE] border border-[#FADBA8] rounded-xl text-[#7A4B00]">
            <p className="font-bold text-sm mb-1">
              “ওষুধের সঠিক ব্যবহার ও মাত্রা নির্ধারণে নিবন্ধিত পশুচিকিৎসকের পরামর্শ নিন। ভুল ওষুধ বা মাত্রা গরুর ক্ষতি করতে পারে এবং দুধ ও মাংসের নিরাপত্তায় প্রভাব ফেলতে পারে।”
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#1E5635]">১. শিক্ষামূলক ও প্রাথমিক নির্দেশিকা:</h3>
            <p className="text-[#6B756D]">
              ‘খামারিকা’ অ্যাপে প্রদত্ত সকল তথ্য বাংলাদেশ প্রাণিসম্পদ অধিদপ্তর (DLS), বিশ্ব প্রাণিস্বাস্থ্য সংস্থা (WOAH) এবং জাতিসংঘের এফএও (FAO) নির্দেশিত প্রোটোকল অনুসারে সংকলিত। এটি খামারিদের সচেতনতা বৃদ্ধির জন্য তৈরি।
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#1E5635]">২. প্রেসক্রিপশন ও ওষুধের মাত্রা:</h3>
            <p className="text-[#6B756D]">
              প্রতিটি পশুর দৈহিক ওজন, বয়স, গর্ভকালীন অবস্থা ও রোগের তীব্রতার ওপর ওষুধের সঠিক ডোজ নির্ভর করে। চিকিৎসকের অনুমোদন ছাড়া অ্যান্টিবায়োটিক বা স্টেরয়েড ব্যবহার সম্পূর্ণ নিষিদ্ধ।
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#1E5635]">৩. প্রত্যাহার কাল (Withholding Period):</h3>
            <p className="text-[#6B756D]">
              ওষুধ সেবনের পর নির্দিষ্ট দিন পর্যন্ত গাভীর দুধ বা মাংস মানবদেহের জন্য অনিরাপদ হতে পারে। প্রতিটি ওষুধের নির্দেশিকা অনুযায়ী দুধ ও মাংসের প্রত্যাহার কাল যথাযথভাবে পালন করুন।
            </p>
          </div>

          <div className="p-3.5 bg-[#EAF4EC] border border-[#287447]/20 rounded-xl text-xs text-[#1E5635] flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#287447] shrink-0" />
            <div>
              <span className="font-bold">জরুরি যোগাযোগের জন্য: </span>
              আপনার নিকটস্থ উপজেলা প্রাণিসম্পদ দপ্তর ও ভেটেরিনারি হাসপাতালে যোগাযোগ করুন।
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t border-[#E5EAE4] bg-[#F7F7F2] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-[#287447] text-white hover:bg-[#1E5635]"
          >
            শর্তাবলী বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
};
