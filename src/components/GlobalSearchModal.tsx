import React from 'react';
import { X, Search } from 'lucide-react';
import { FilteringSearch } from './FilteringSearch';
import { Disease, MedicineEntry, CareGuideArticle, SymptomItem, CattleRecord } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDisease: (disease: Disease) => void;
  onSelectMedicine: (medicine: MedicineEntry) => void;
  onSelectArticle: (article: CareGuideArticle) => void;
  onSelectSymptom: (symptom: SymptomItem) => void;
  onSelectCattle?: (cattle: CattleRecord) => void;
  cattleList?: CattleRecord[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDisease,
  onSelectMedicine,
  onSelectArticle,
  onSelectSymptom,
  onSelectCattle,
  cattleList = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#287447]" />
            <h2 className="text-sm sm:text-base font-bold text-[#1E5635]">
              ফিল্টারিং অনুসন্ধান
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filtering Search Body */}
        <div className="p-3 sm:p-4">
          <FilteringSearch
            isInline={false}
            cattleList={cattleList}
            onSelectDisease={(d) => {
              onSelectDisease(d);
              onClose();
            }}
            onSelectMedicine={(m) => {
              onSelectMedicine(m);
              onClose();
            }}
            onSelectArticle={(a) => {
              onSelectArticle(a);
              onClose();
            }}
            onSelectSymptom={(s) => {
              onSelectSymptom(s);
              onClose();
            }}
            onSelectCattle={(c) => {
              if (onSelectCattle) onSelectCattle(c);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
