import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, PhoneCall, RotateCcw, AlertOctagon, HelpCircle } from 'lucide-react';
import { SYMPTOMS_LIST, DISEASES_DATA } from '../data/seedData';
import { Disease } from '../types';

interface SymptomCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDisease: (disease: Disease) => void;
}

export const SymptomCheckerModal: React.FC<SymptomCheckerModalProps> = ({
  isOpen,
  onClose,
  onSelectDisease
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [step, setStep] = useState<'symptoms' | 'followup' | 'results'>('symptoms');

  // Follow-up questions
  const [ageGroup, setAgeGroup] = useState<string>('পূর্ণবয়স্ক গরু');
  const [duration, setDuration] = useState<string>('১ দিন বা কম');
  const [eatingState, setEatingState] = useState<string>('কিছুটা কম');
  const [multipleAffected, setMultipleAffected] = useState<string>('শুধুমাত্র একটি পশু');
  const [breathingDifficulty, setBreathingDifficulty] = useState<boolean>(false);
  const [canStand, setCanStand] = useState<string>('স্বাভাবিক');

  if (!isOpen) return null;

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setStep('symptoms');
    setAgeGroup('পূর্ণবয়স্ক গরু');
    setDuration('১ দিন বা কম');
    setEatingState('কিছুটা কম');
    setMultipleAffected('শুধুমাত্র একটি পশু');
    setBreathingDifficulty(false);
    setCanStand('স্বাভাবিক');
  };

  // Immediate urgency criteria
  const hasEmergencySymptom =
    breathingDifficulty ||
    canStand === 'দাঁড়াতে পারছে না (শুয়ে পড়েছে)' ||
    selectedSymptoms.includes('sym-cannot-stand') ||
    selectedSymptoms.includes('sym-breathing-difficulty') ||
    selectedSymptoms.includes('sym-bloat') ||
    selectedSymptoms.includes('sym-calving-problem');

  const isContagiousRisk =
    multipleAffected === 'খামারে একাধিক পশু আক্রান্ত' ||
    selectedSymptoms.includes('sym-mouth-sores') ||
    selectedSymptoms.includes('sym-foot-sores') ||
    selectedSymptoms.includes('sym-skin-nodules') ||
    selectedSymptoms.includes('sym-salivation');

  // Matched diseases based on symptoms (as educational possibilities, not definitive diagnosis)
  const matchedDiseases: Disease[] = [];
  if (selectedSymptoms.includes('sym-mouth-sores') || selectedSymptoms.includes('sym-foot-sores') || selectedSymptoms.includes('sym-salivation')) {
    const fmd = DISEASES_DATA.find((d) => d.id === 'fmd');
    if (fmd && !matchedDiseases.includes(fmd)) matchedDiseases.push(fmd);
  }
  if (selectedSymptoms.includes('sym-skin-nodules') || selectedSymptoms.includes('sym-fever')) {
    const lsd = DISEASES_DATA.find((d) => d.id === 'lsd');
    if (lsd && !matchedDiseases.includes(lsd)) matchedDiseases.push(lsd);
  }
  if (selectedSymptoms.includes('sym-breathing-difficulty') || selectedSymptoms.includes('sym-fever')) {
    const hs = DISEASES_DATA.find((d) => d.id === 'hs');
    if (hs && !matchedDiseases.includes(hs)) matchedDiseases.push(hs);
  }
  if (selectedSymptoms.includes('sym-udder-swelling')) {
    const mastitis = DISEASES_DATA.find((d) => d.id === 'mastitis');
    if (mastitis && !matchedDiseases.includes(mastitis)) matchedDiseases.push(mastitis);
  }
  if (selectedSymptoms.includes('sym-bloat')) {
    const bloat = DISEASES_DATA.find((d) => d.id === 'bloat');
    if (bloat && !matchedDiseases.includes(bloat)) matchedDiseases.push(bloat);
  }
  if (selectedSymptoms.includes('sym-diarrhea')) {
    const calfDiarrhea = DISEASES_DATA.find((d) => d.id === 'calf-diarrhea');
    if (calfDiarrhea && !matchedDiseases.includes(calfDiarrhea)) matchedDiseases.push(calfDiarrhea);
  }
  if (selectedSymptoms.includes('sym-cannot-stand')) {
    const milkFever = DISEASES_DATA.find((d) => d.id === 'milk-fever');
    if (milkFever && !matchedDiseases.includes(milkFever)) matchedDiseases.push(milkFever);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF4EC] text-[#287447] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E5635]">
                লক্ষণ যাচাই ও পরামর্শ (Symptom Checker)
              </h2>
              <p className="text-xs text-[#6B756D]">
                প্রাথমিক স্বাস্থ্য মূল্যায়ন ও জরুরি সতর্কতা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {step !== 'symptoms' && (
              <button
                onClick={handleReset}
                className="p-2 rounded-lg text-xs font-semibold text-[#6B756D] hover:bg-slate-200 flex items-center gap-1"
                title="পুনরায় শুরু করুন"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">রিসেট</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-[#F7F7F2]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* STEP 1: SYMPTOMS SELECTION */}
          {step === 'symptoms' && (
            <div className="space-y-4">
              <div className="bg-[#EAF4EC] p-3.5 rounded-xl border border-[#287447]/20 text-xs sm:text-sm text-[#1E5635]">
                <p className="font-semibold">পশুর মধ্যে কী কী অস্বাভাবিক লক্ষণ লক্ষ্য করছেন?</p>
                <p className="text-xs text-[#202820] mt-0.5">
                  নিচের তালিকা থেকে এক বা একাধিক লক্ষণ নির্বাচন করুন:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SYMPTOMS_LIST.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      onClick={() => toggleSymptom(sym.id)}
                      type="button"
                      className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 min-h-[48px] ${
                        isSelected
                          ? 'bg-[#EAF4EC] border-[#287447] text-[#1E5635] shadow-xs'
                          : 'bg-white border-[#E5EAE4] text-[#202820] hover:bg-[#F7F7F2]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border mt-0.5 shrink-0 flex items-center justify-center ${
                          isSelected ? 'bg-[#287447] border-[#287447] text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold leading-tight">
                          {sym.nameBn}
                        </div>
                        <div className="text-[11px] text-[#6B756D] truncate mt-0.5 font-mono">
                          {sym.nameEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setStep('followup')}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>পরবর্তী প্রশ্নাবলী</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: FOLLOW-UP QUESTIONS */}
          {step === 'followup' && (
            <div className="space-y-4">
              <div className="bg-[#FFF9EE] border border-[#FADBA8] p-3 rounded-xl text-xs text-[#7A4B00]">
                <span className="font-bold">গুরুত্বপূর্ণ পরিস্থিতি পর্যালোচনা:</span> সঠিক নির্দেশনার জন্য নিচের সাধারণ প্রশ্নগুলোর উত্তর দিন।
              </div>

              {/* Age */}
              <div>
                <label className="text-xs font-bold text-[#1E5635] block mb-1.5">
                  পশুর বয়স গ্রুপ:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['বাছুর (১-৬ মাস)', 'বাড়ন্ত (৬-১৮ মাস)', 'পূর্ণবয়স্ক গরু'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setAgeGroup(item)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        ageGroup === item
                          ? 'bg-[#EAF4EC] border-[#287447] text-[#1E5635]'
                          : 'bg-white border-[#E5EAE4] text-[#202820] hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs font-bold text-[#1E5635] block mb-1.5">
                  কতদিন যাবৎ লক্ষণ দেখা যাচ্ছে?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['১ দিন বা কম', '২-৩ দিন', '৪ দিনের বেশি'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDuration(item)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        duration === item
                          ? 'bg-[#EAF4EC] border-[#287447] text-[#1E5635]'
                          : 'bg-white border-[#E5EAE4] text-[#202820] hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standing ability */}
              <div>
                <label className="text-xs font-bold text-[#1E5635] block mb-1.5">
                  পশু উঠে দাঁড়াতে পারছে কি?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['স্বাভাবিক', 'কষ্ট হচ্ছে', 'দাঁড়াতে পারছে না (শুয়ে পড়েছে)'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCanStand(item)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        canStand === item
                          ? item.includes('পারছে না')
                            ? 'bg-[#FEE4E2] border-[#B42318] text-[#B42318]'
                            : 'bg-[#EAF4EC] border-[#287447] text-[#1E5635]'
                          : 'bg-white border-[#E5EAE4] text-[#202820] hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breathing */}
              <div>
                <label className="text-xs font-bold text-[#1E5635] block mb-1.5">
                  শ্বাসকষ্ট বা ঘড়ঘড় শব্দ হচ্ছে কি?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBreathingDifficulty(true)}
                    className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                      breathingDifficulty
                        ? 'bg-[#FEE4E2] border-[#B42318] text-[#B42318]'
                        : 'bg-white border-[#E5EAE4] text-[#202820]'
                    }`}
                  >
                    হ্যাঁ, শ্বাস নিতে তীব্র কষ্ট
                  </button>
                  <button
                    type="button"
                    onClick={() => setBreathingDifficulty(false)}
                    className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                      !breathingDifficulty
                        ? 'bg-[#EAF4EC] border-[#287447] text-[#1E5635]'
                        : 'bg-white border-[#E5EAE4] text-[#202820]'
                    }`}
                  >
                    না, শ্বাস স্বাভাবিক
                  </button>
                </div>
              </div>

              {/* Multiple animals */}
              <div>
                <label className="text-xs font-bold text-[#1E5635] block mb-1.5">
                  খামারে আক্রান্ত পশুর সংখ্যা:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['শুধুমাত্র একটি পশু', 'খামারে একাধিক পশু আক্রান্ত'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMultipleAffected(item)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        multipleAffected === item
                          ? item.includes('একাধিক')
                            ? 'bg-[#FEF0C7] border-[#B7791F] text-[#B7791F]'
                            : 'bg-[#EAF4EC] border-[#287447] text-[#1E5635]'
                          : 'bg-white border-[#E5EAE4] text-[#202820]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('symptoms')}
                  className="px-4 py-2 border border-[#E5EAE4] text-xs font-semibold rounded-xl hover:bg-slate-100"
                >
                  পেছনে
                </button>
                <button
                  type="button"
                  onClick={() => setStep('results')}
                  className="px-6 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white font-semibold rounded-xl text-sm"
                >
                  ফলাফল ও পরামর্শ দেখুন
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS & IMMEDIATE ACTIONS */}
          {step === 'results' && (
            <div className="space-y-5">
              {/* Emergency Banner if critical */}
              {hasEmergencySymptom ? (
                <div className="bg-[#FEE4E2] border-2 border-[#F04438] p-4 rounded-xl text-[#B42318] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-base">
                    <AlertOctagon className="w-6 h-6 shrink-0" />
                    <span>জরুরি অবস্থা: তাৎক্ষণিক রেজিস্টার্ড পশুচিকিৎসক ডাকুন!</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#7A271A]">
                    শ্বাসকষ্ট, পেট ফাঁপা, দাঁড়াতে অক্ষমতা বা প্রসবজনিত জটিলতা অত্যন্ত ঝুঁকিপূর্ণ লক্ষণ। এতে সামান্য কালক্ষেপণেও পশুর প্রাণহানি ঘটতে পারে। প্রশ্নোত্তরে সময় নষ্ট না করে উপজেলা প্রাণিসম্পদ হাসপাতালে যোগাযোগ করুন।
                  </p>
                </div>
              ) : (
                <div className="bg-[#FEF0C7] border border-[#FDB022] p-3.5 rounded-xl text-[#B7791F] flex items-center gap-2.5 text-xs sm:text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold">সতর্ক পর্যবেক্ষণ প্রয়োজন: </span>
                    লক্ষণগুলো দ্রুত প্রতিকারে চিকিৎসকের পরামর্শ গ্রহণ করুন এবং পশুকে শান্ত স্থানে রাখুন।
                  </div>
                </div>
              )}

              {/* Contagious disease warning */}
              {isContagiousRisk && (
                <div className="bg-[#FFF9EE] border border-[#FADBA8] p-3.5 rounded-xl text-xs text-[#7A4B00] space-y-1">
                  <p className="font-bold">⚠️ সংক্রামক রোগের সম্ভাব্য ঝুঁকি ও জৈবনিরাপত্তা:</p>
                  <ul className="space-y-0.5 text-[#5C3800] list-disc list-inside">
                    <li>আক্রান্ত পশুকে সুস্থ পালের থেকে তাৎক্ষণিক সম্পূর্ণ আলাদা শেডে কোয়ারেন্টাইনে রাখুন।</li>
                    <li>আক্রান্ত পশুর ব্যবহৃত খাবার ও পানির পাত্র অন্য পশুকে ব্যবহার করতে দেবেন না।</li>
                    <li>খামার চত্বরে ব্লিচিং পাউডার বা চুন ছিটান এবং বহিরাগত চলাচল বন্ধ করুন।</li>
                  </ul>
                </div>
              )}

              {/* Reported Symptoms Summary */}
              <div>
                <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2">
                  প্রতিবেদিত লক্ষণসমূহের সারসংক্ষেপ
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSymptoms.map((symId) => {
                    const item = SYMPTOMS_LIST.find((s) => s.id === symId);
                    return (
                      <span
                        key={symId}
                        className="text-xs bg-[#F7F7F2] border border-[#E5EAE4] px-2.5 py-1 rounded-md text-[#202820] font-medium"
                      >
                        {item ? item.nameBn : symId}
                      </span>
                    );
                  })}
                  <span className="text-xs bg-[#F7F7F2] border border-[#E5EAE4] px-2.5 py-1 rounded-md text-[#6B756D]">
                    বয়স: {ageGroup}
                  </span>
                  <span className="text-xs bg-[#F7F7F2] border border-[#E5EAE4] px-2.5 py-1 rounded-md text-[#6B756D]">
                    স্থায়িত্বকাল: {duration}
                  </span>
                </div>
              </div>

              {/* Possible Conditions to Learn About */}
              <div>
                <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2">
                  সম্ভাব্য সম্পর্কিত স্বাস্থ্য সমস্যা (শিক্ষামূলক পর্যালোচনা)
                </h3>
                <p className="text-xs text-[#6B756D] mb-2">
                  নিচের রোগগুলো লক্ষণের সাথে সাদৃশ্যপূর্ণ হতে পারে (এটি কোনো চূড়ান্ত রোগ নির্ণয় নয়):
                </p>
                <div className="space-y-2">
                  {matchedDiseases.length > 0 ? (
                    matchedDiseases.map((dis) => (
                      <div
                        key={dis.id}
                        className="p-3 rounded-xl border border-[#E5EAE4] bg-white flex items-center justify-between gap-2 hover:bg-[#F7F7F2] transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#1E5635]">
                            {dis.nameBn} ({dis.nameEn})
                          </div>
                          <div className="text-xs text-[#6B756D] line-clamp-1 mt-0.5">
                            {dis.summary}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onSelectDisease(dis);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-[#EAF4EC] hover:bg-[#287447] text-[#287447] hover:text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                        >
                          বিস্তারিত
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-[#F7F7F2] text-xs text-[#6B756D]">
                      নির্দিষ্ট কোনো পরিচিত সংক্রামক রোগের নিশ্চিত প্যাটার্ন পাওয়া যায়নি। সাধারণ পেটের সমস্যা বা মৃদু সংক্রমণের সম্ভাবনা থাকতে পারে।
                    </div>
                  )}
                </div>
              </div>

              {/* Safe Immediate Steps */}
              <div className="bg-[#EAF4EC]/60 p-4 rounded-xl border border-[#287447]/20">
                <h3 className="text-xs font-bold text-[#1E5635] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#287447]" />
                  <span>তাত্ক্ষণিক নিরাপদ পদক্ষেপ</span>
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#202820]">
                  <li>• পশুকে ছায়াযুক্ত, শুকনো ও আরামদায়ক খড় বিছানো জায়গায় আলাদা রাখুন।</li>
                  <li>• পর্যাপ্ত স্বাভাবিক তাপমাত্রার পরিষ্কার খাবার পানি দিন। জোর করে মুখে কিছু ঢালবেন না।</li>
                  <li>• জ্বর থাকলে কপালে ও ঘাড়ে হালকা পানি ঢেলে বা ভিজা কাপড় দিয়ে মুছে দিন।</li>
                  <li>• পশুচিকিৎসক না আসা পর্যন্ত নিজ ইচ্ছায় কোনো অ্যান্টিবায়োটিক বা ভারী ওষুধ দেবেন না।</li>
                </ul>
              </div>

              {/* Non-negotiable Disclaimer */}
              <div className="text-[11px] text-[#6B756D] border-t border-[#E5EAE4] pt-3 leading-relaxed">
                <span className="font-semibold text-[#202820]">সীমাবদ্ধতা ও আইনি ঘোষণা:</span> এই লক্ষণ যাচাইকরণ টুলটি শুধুমাত্র প্রাথমিক ধারণা ও সচেতনতার জন্য তৈরি। একই লক্ষণ বিভিন্ন মারাত্মক বা সাধারণ রোগে হতে পারে। যেকোনো চিকিৎসা সিদ্ধান্তের জন্য স্থানীয় উপজেলা প্রাণিসম্পদ কর্মকর্তা বা নিবন্ধিত পশুচিকিৎসকের সাথে পরামর্শ করুন।
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between shrink-0">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-[#6B756D] hover:text-[#202820]"
          >
            নতুন করে যাচাই
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#287447] text-white hover:bg-[#1E5635] transition-colors"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
