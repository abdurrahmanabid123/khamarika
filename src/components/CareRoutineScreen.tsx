import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Clock, AlertTriangle, BookOpen, ChevronRight, Check, Trash2 } from 'lucide-react';
import { CareTask, CareGuideArticle, CattleRecord } from '../types';
import { CARE_GUIDE_ARTICLES } from '../data/seedData';
import { toBengaliNumber } from '../utils/storage';

interface CareRoutineScreenProps {
  tasks: CareTask[];
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTaskModal: () => void;
  onSelectArticle: (article: CareGuideArticle) => void;
  cattleList: CattleRecord[];
}

export const CareRoutineScreen: React.FC<CareRoutineScreenProps> = ({
  tasks,
  onToggleTaskComplete,
  onDeleteTask,
  onOpenAddTaskModal,
  onSelectArticle,
  cattleList
}) => {
  const [subTab, setSubTab] = useState<'calendar' | 'guides'>('calendar');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [guideCategory, setGuideCategory] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const overdueTasks = pendingTasks.filter((t) => t.dueDate < todayStr);

  const displayedTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return !t.isCompleted;
    if (taskFilter === 'completed') return t.isCompleted;
    return true;
  });

  const filteredArticles = CARE_GUIDE_ARTICLES.filter((a) => {
    if (guideCategory === 'all') return true;
    return a.category.includes(guideCategory);
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE4] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#287447]" />
            <h2 className="text-xl font-bold text-[#1E5635] tracking-tight">
              যত্ন, রুটিন ও পালন সহায়িকা
            </h2>
          </div>
          <p className="text-xs text-[#6B756D] mt-0.5">
            টিকা, কৃমিনাশক ও খামার ব্যবস্থাপনার সময়সূচি এবং বৈজ্ঞানিক পালন নির্দেশিকা
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAddTaskModal}
            className="px-4 py-2.5 bg-[#287447] hover:bg-[#1E5635] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন কাজ যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E5EAE4] w-fit">
        <button
          onClick={() => setSubTab('calendar')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] ${
            subTab === 'calendar'
              ? 'bg-[#EAF4EC] text-[#1E5635] font-bold shadow-xs'
              : 'text-[#6B756D] hover:text-[#202820]'
          }`}
        >
          ক্যালেন্ডার ও রিমাইন্ডার ({toBengaliNumber(pendingTasks.length)})
        </button>
        <button
          onClick={() => setSubTab('guides')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all min-h-[40px] ${
            subTab === 'guides'
              ? 'bg-[#EAF4EC] text-[#1E5635] font-bold shadow-xs'
              : 'text-[#6B756D] hover:text-[#202820]'
          }`}
        >
          পালন ও পুষ্টি সহায়িকা ({toBengaliNumber(CARE_GUIDE_ARTICLES.length)})
        </button>
      </div>

      {/* SUBTAB 1: CALENDAR & TASKS */}
      {subTab === 'calendar' && (
        <div className="space-y-4">
          {/* Overdue alert if any */}
          {overdueTasks.length > 0 && (
            <div className="bg-[#FFF9EE] border border-[#FADBA8] p-3.5 rounded-xl text-xs sm:text-sm text-[#7A4B00] flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#B7791F] shrink-0" />
              <div>
                <span className="font-bold">জরুরি সতর্কতা: </span>
                আপনার খামারে <b>{toBengaliNumber(overdueTasks.length)} টি কাজ</b> নির্ধারিত তারিখ পার হয়ে গেছে। অনুগ্রহ করে দ্রুত সম্পন্ন করুন।
              </div>
            </div>
          )}

          {/* Task Status Filters */}
          <div className="flex items-center gap-2 text-xs">
            {[
              { id: 'pending', label: `আসন্ন ও বকেয়া (${toBengaliNumber(pendingTasks.length)})` },
              { id: 'completed', label: `সম্পন্ন (${toBengaliNumber(completedTasks.length)})` },
              { id: 'all', label: `সকল (${toBengaliNumber(tasks.length)})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTaskFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium border transition-all min-h-[36px] ${
                  taskFilter === f.id
                    ? 'bg-[#287447] text-white border-[#287447]'
                    : 'bg-white border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tasks List */}
          {displayedTasks.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#E5EAE4] text-center text-[#6B756D] space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-[#287447] opacity-60" />
              <p className="font-semibold text-[#202820]">কোনো কাজের তালিকা নেই</p>
              <p className="text-xs">নতুন কাজের রিমাইন্ডার যোগ করতে ওপরের বাটনে চাপুন।</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedTasks.map((task) => {
                const isOverdue = !task.isCompleted && task.dueDate < todayStr;
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 bg-white ${
                      task.isCompleted
                        ? 'border-[#E5EAE4] opacity-75'
                        : isOverdue
                        ? 'border-[#FECDCA] bg-[#FFFBFB]'
                        : 'border-[#E5EAE4] hover:border-[#287447]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Checkbox */}
                      <button
                        onClick={() => onToggleTaskComplete(task.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          task.isCompleted
                            ? 'bg-[#287447] border-[#287447] text-white'
                            : 'border-slate-300 hover:border-[#287447] bg-white'
                        }`}
                        title={task.isCompleted ? 'অসম্পন্ন করুন' : 'সম্পন্ন করুন'}
                      >
                        {task.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-semibold bg-[#EAF4EC] text-[#1E5635] px-2 py-0.5 rounded">
                            {task.category}
                          </span>
                          {task.cattleName && (
                            <span className="text-[10px] font-medium bg-[#F7F7F2] text-[#202820] px-1.5 py-0.5 rounded border border-[#E5EAE4]">
                              গরু: {task.cattleName}
                            </span>
                          )}
                          {isOverdue && (
                            <span className="text-[10px] font-bold text-[#B42318] bg-[#FEE4E2] px-1.5 py-0.5 rounded">
                              তারিখ অতিক্রান্ত
                            </span>
                          )}
                          {task.priority === 'জরুরি' && (
                            <span className="text-[10px] font-bold text-[#B42318] bg-[#FEE4E2] px-1.5 py-0.5 rounded">
                              জরুরি
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-bold text-sm sm:text-base mt-1 text-[#202820] ${
                            task.isCompleted ? 'line-through text-[#6B756D]' : ''
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.notes && (
                          <p className="text-xs text-[#6B756D] mt-0.5 line-clamp-2">
                            {task.notes}
                          </p>
                        )}

                        <div className="text-[11px] text-[#6B756D] mt-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#287447]" />
                          <span>নির্ধারিত তারিখ: <b>{task.dueDate}</b></span>
                          {task.completedDate && (
                            <span className="text-[#287447] font-medium">
                              (সম্পন্ন: {task.completedDate})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-[#6B756D] hover:text-[#B42318] hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: FARMING GUIDES & ARTICLES */}
      {subTab === 'guides' && (
        <div className="space-y-4">
          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'সকল গাইড' },
              { id: 'পুষ্টি', label: 'পুষ্টি ও সুষম খাদ্য' },
              { id: 'বাসস্থান', label: 'বাসস্থান ও জৈবনিরাপত্তা' },
              { id: 'বাছুর', label: 'বাছুর পরিচর্যা' },
              { id: 'দুগ্ধ', label: 'দুগ্ধ ব্যবস্থাপনা' },
              { id: 'মোটাতাজাকরণ', label: 'মোটাতাজাকরণ' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setGuideCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all min-h-[36px] ${
                  guideCategory === c.id
                    ? 'bg-[#287447] text-white shadow-xs'
                    : 'bg-white border border-[#E5EAE4] text-[#6B756D] hover:text-[#202820]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="bg-white rounded-2xl border border-[#E5EAE4] overflow-hidden hover:border-[#287447]/50 transition-all shadow-2xs cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {article.imageUrl && (
                    <div className="h-36 sm:h-40 overflow-hidden bg-slate-100">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <span className="text-[10px] font-semibold text-[#1E5635] bg-[#EAF4EC] px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <h3 className="font-bold text-base text-[#1E5635] group-hover:text-[#287447] transition-colors mt-1.5 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#202820] line-clamp-2 mt-1.5 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-[#E5EAE4] flex items-center justify-between text-xs text-[#6B756D]">
                  <span className="truncate max-w-[200px]">{article.reference}</span>
                  <span className="text-[#287447] font-semibold flex items-center gap-1 shrink-0">
                    <span>পড়ুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
