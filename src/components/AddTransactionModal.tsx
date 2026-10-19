import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { FarmLedgerEntry, CattleRecord } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: FarmLedgerEntry) => void;
  cattleList: CattleRecord[];
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cattleList
}) => {
  const [type, setType] = useState<FarmLedgerEntry['type']>('খরচ');
  const [category, setCategory] = useState<FarmLedgerEntry['category']>('খাদ্য ও পুষ্টি');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCattleId, setSelectedCattleId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setErrorMsg('অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।');
      return;
    }

    const matchedCattle = cattleList.find((c) => c.id === selectedCattleId);

    const newEntry: FarmLedgerEntry = {
      id: `led-${Date.now()}`,
      date,
      type,
      category,
      cattleId: selectedCattleId || undefined,
      cattleName: matchedCattle ? matchedCattle.name : undefined,
      amount: val,
      notes: notes.trim()
    };

    onSave(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1E5635]">নতুন আর্থিক হিসাব যুক্ত করুন</h2>
            <p className="text-xs text-[#6B756D]">খামারের দৈনিক আয় ও খরচের সঠিক হিসাব</p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E5EAE4] bg-white text-[#6B756D] hover:bg-[#F7F7F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 bg-[#FEE4E2] border border-[#FECDCA] text-[#B42318] rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Type Selector (Income vs Expense) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('খরচ');
                setCategory('খাদ্য ও পুষ্টি');
              }}
              className={`p-2.5 font-bold rounded-xl border text-center transition-all ${
                type === 'খরচ'
                  ? 'bg-[#FEE4E2] border-[#B42318] text-[#B42318]'
                  : 'bg-white border-[#E5EAE4] text-[#6B756D]'
              }`}
            >
              খরচ (Expense)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('আয়');
                setCategory('দুধ বিক্রয়');
              }}
              className={`p-2.5 font-bold rounded-xl border text-center transition-all ${
                type === 'আয়'
                  ? 'bg-[#EAF4EC] border-[#287447] text-[#1E5635]'
                  : 'bg-white border-[#E5EAE4] text-[#6B756D]'
              }`}
            >
              আয় (Income)
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold block mb-1">ক্যাটাগরি</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FarmLedgerEntry['category'])}
              className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
            >
              {type === 'খরচ' ? (
                <>
                  <option value="খাদ্য ও পুষ্টি">খাদ্য ও পুষ্টি (ভূষি, খৈল, ঘাস)</option>
                  <option value="চিকিৎসা ও ওষুধ">চিকিৎসা ও ওষুধ</option>
                  <option value="টিকা ও প্রতিষেধক">টিকা ও প্রতিষেধক</option>
                  <option value="পশু ক্রয়">পশু ক্রয়</option>
                  <option value="শ্রম ও ব্যবস্থাপনা">শ্রম ও শেড ব্যবস্থাপনা</option>
                  <option value="অন্যান্য">অন্যান্য খরচ</option>
                </>
              ) : (
                <>
                  <option value="দুধ বিক্রয়">দুধ বিক্রয়</option>
                  <option value="পশু বিক্রয়">পশু বিক্রয়</option>
                  <option value="অন্যান্য">অন্যান্য আয় (গোবর সার ইত্যাদি)</option>
                </>
              )}
            </select>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">টাকার পরিমাণ (৳) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="যেমন: ১৫০০"
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">তারিখ <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
                required
              />
            </div>
          </div>

          {/* Specific Animal */}
          <div>
            <label className="font-semibold block mb-1">নির্দিষ্ট গরু (ঐচ্ছিক)</label>
            <select
              value={selectedCattleId}
              onChange={(e) => setSelectedCattleId(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
            >
              <option value="">সম্পূর্ণ খামারের জন্য</option>
              {cattleList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tagId})
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold block mb-1">বিবরণ বা রসিদ মন্তব্য</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="যেমন: ২ বস্তা খৈল ক্রয় বা ১২ লিটার দুধ ডেলিভারি"
              className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5EAE4] flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5EAE4] text-xs font-semibold rounded-xl text-[#6B756D]"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>হিসাব যোগ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
