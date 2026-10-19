import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { CareTask, CattleRecord } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: CareTask) => void;
  cattleList: CattleRecord[];
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  cattleList
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CareTask['category']>('টিকা (Vaccine)');
  const [selectedCattleId, setSelectedCattleId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<CareTask['priority']>('সাধারণ');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('অনুগ্রহ করে কাজের শিরোনাম লিখুন।');
      return;
    }
    if (!dueDate) {
      setErrorMsg('অনুগ্রহ করে নির্ধারিত তারিখ নির্বাচন করুন।');
      return;
    }

    const matchedCattle = cattleList.find((c) => c.id === selectedCattleId);

    const newTask: CareTask = {
      id: `task-${Date.now()}`,
      cattleId: selectedCattleId || undefined,
      cattleName: matchedCattle ? matchedCattle.name : undefined,
      title: title.trim(),
      category,
      dueDate,
      isCompleted: false,
      priority,
      notes: notes.trim() || undefined
    };

    onSaveTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5EAE4] overflow-hidden my-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-[#E5EAE4] bg-[#F7F7F2] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1E5635]">নতুন যত্ন বা রিমাইন্ডার যোগ করুন</h2>
            <p className="text-xs text-[#6B756D]">টিকা, কৃমিনাশক ও খামার কাজের সময়সূচী নির্ধারণ</p>
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

          <div>
            <label className="font-semibold block mb-1">কাজের শিরোনাম <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: এফএমডি বুস্টার টিকা প্রদান"
              className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">কাজের ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CareTask['category'])}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              >
                <option value="টিকা (Vaccine)">টিকা (Vaccine)</option>
                <option value="কৃমিনাশক (Deworming)">কৃমিনাশক (Deworming)</option>
                <option value="পশুচিকিৎসক পরিদর্শন">পশুচিকিৎসক পরিদর্শন</option>
                <option value="প্রজনন ও কৃত্রিম প্রজনন">প্রজনন ও কৃত্রিম প্রজনন</option>
                <option value="ওজন পরিমাপ">ওজন পরিমাপ</option>
                <option value="খাবার পর্যালোচনা">খাবার পর্যালোচনা</option>
                <option value="শেড পরিষ্কার ও জীবাণুমুক্তকরণ">শেড পরিষ্কার ও জীবাণুমুক্তকরণ</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">নির্দিষ্ট গরু (ঐচ্ছিক)</label>
              <select
                value={selectedCattleId}
                onChange={(e) => setSelectedCattleId(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              >
                <option value="">পুরো খামারের জন্য</option>
                {cattleList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tagId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">নির্ধারিত তারিখ <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">অগ্রাধিকার</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CareTask['priority'])}
                className="w-full p-2.5 bg-white border border-[#E5EAE4] rounded-xl focus:outline-none focus:border-[#287447]"
              >
                <option value="সাধারণ">সাধারণ</option>
                <option value="জরুরি">জরুরি</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">নোট বা বিস্তারিত মন্তব্য</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="ওষুধের নাম, ডোজ বা সার্জনের যোগাযোগের তথ্য..."
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
              <span>রিমাইন্ডার সেট করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
