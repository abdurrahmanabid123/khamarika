import React from 'react';
import { X, BookOpen, AlertTriangle, CheckCircle2, Bookmark, Share2 } from 'lucide-react';
import { CareGuideArticle } from '../types';

interface ArticleDetailModalProps {
  article: CareGuideArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose
}) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-start justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-[#1E5635] bg-[#EAF4EC] px-2 py-0.5 rounded">
              {article.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E5635] mt-1.5 leading-snug">
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-[#F7F7F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-[#202820]">
          {/* Authentic image if present */}
          {article.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-[#E5EAE4] shadow-xs">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-48 sm:h-64 object-cover"
              />
            </div>
          )}

          {/* Summary */}
          <div className="bg-[#F7F7F2] p-4 rounded-xl border border-[#E5EAE4]">
            <p className="text-sm sm:text-base leading-relaxed text-[#202820] font-medium">
              {article.summary}
            </p>
          </div>

          {/* Practical steps */}
          <div>
            <h3 className="text-sm font-bold text-[#1E5635] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#287447]" />
              <span>বাস্তবসম্মত করণীয় ধাপসমূহ</span>
            </h3>
            <div className="space-y-2">
              {article.practicalSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E5EAE4] text-xs sm:text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-[#EAF4EC] text-[#287447] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[#202820] leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Caution notes */}
          {article.cautions.length > 0 && (
            <div className="bg-[#FFF9EE] border border-[#FADBA8] p-4 rounded-xl text-xs sm:text-sm text-[#7A4B00] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#7A4B00]">
                <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
                <span>সতর্কতা ও ভুল ধারণা পরিহার</span>
              </div>
              <ul className="space-y-1 text-[#5C3800] list-disc list-inside">
                {article.cautions.map((c, idx) => (
                  <li key={idx} className="leading-relaxed">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reference */}
          <div className="border-t border-[#E5EAE4] pt-3 text-xs text-[#6B756D] flex items-center justify-between">
            <span>উৎস ও তথ্যসূত্র: <b className="text-[#202820]">{article.reference}</b></span>
            <span className="text-[#287447] font-semibold">ডিএলএস অনুমোদিত</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E5EAE4] bg-[#F7F7F2] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#287447] text-white hover:bg-[#1E5635]"
          >
            পড়া শেষ / বন্ধ
          </button>
        </div>
      </div>
    </div>
  );
};
