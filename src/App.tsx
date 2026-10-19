import React, { useState, useEffect } from 'react';
import { TabType, CattleRecord, CareTask, FarmLedgerEntry, FarmProfile, Disease, MedicineEntry, CareGuideArticle, SymptomItem } from './types';
import {
  getStoredCattle,
  saveStoredCattle,
  getStoredTasks,
  saveStoredTasks,
  getStoredLedger,
  saveStoredLedger,
  getStoredProfile,
  saveStoredProfile,
  getStoredBookmarks,
  toggleStoredBookmark
} from './utils/storage';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { DiseaseScreen } from './components/DiseaseScreen';
import { MyCattleScreen } from './components/MyCattleScreen';
import { CattleDetailView } from './components/CattleDetailView';
import { CareRoutineScreen } from './components/CareRoutineScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { DiseaseDetailModal } from './components/DiseaseDetailModal';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { SymptomCheckerModal } from './components/SymptomCheckerModal';
import { AddEditCattleModal } from './components/AddEditCattleModal';
import { AddTaskModal } from './components/AddTaskModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { VeterinaryDisclaimerModal } from './components/VeterinaryDisclaimerModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Core persistent data
  const [cattleList, setCattleList] = useState<CattleRecord[]>([]);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [ledger, setLedger] = useState<FarmLedgerEntry[]>([]);
  const [profile, setProfile] = useState<FarmProfile>({
    farmerName: '',
    farmName: '',
    district: '',
    upazila: '',
    primaryFocus: '',
    notificationsEnabled: true,
    language: 'bn'
  });
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Detailed Modals / Views
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineEntry | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<CareGuideArticle | null>(null);
  const [activeCattleDetail, setActiveCattleDetail] = useState<CattleRecord | null>(null);

  // Form Modals
  const [isAddCattleOpen, setIsAddCattleOpen] = useState(false);
  const [editingCattle, setEditingCattle] = useState<CattleRecord | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Load data on startup
  const reloadFromStorage = () => {
    setCattleList(getStoredCattle());
    setTasks(getStoredTasks());
    setLedger(getStoredLedger());
    setProfile(getStoredProfile());
    setBookmarks(getStoredBookmarks());
  };

  useEffect(() => {
    reloadFromStorage();
  }, []);

  // Cattle handlers
  const handleSaveCattle = (saved: CattleRecord) => {
    let updated: CattleRecord[];
    const exists = cattleList.some((c) => c.id === saved.id);
    if (exists) {
      updated = cattleList.map((c) => (c.id === saved.id ? saved : c));
    } else {
      updated = [saved, ...cattleList];
    }
    setCattleList(updated);
    saveStoredCattle(updated);
    if (activeCattleDetail && activeCattleDetail.id === saved.id) {
      setActiveCattleDetail(saved);
    }
  };

  const handleArchiveCattle = (cattleId: string) => {
    const updated: CattleRecord[] = cattleList.map((c) => {
      if (c.id === cattleId) {
        const newStatus: CattleRecord['status'] =
          c.status === 'সংরক্ষিত (Archived)' ? 'সুস্থ' : 'সংরক্ষিত (Archived)';
        return { ...c, status: newStatus };
      }
      return c;
    });
    setCattleList(updated);
    saveStoredCattle(updated);
    if (activeCattleDetail && activeCattleDetail.id === cattleId) {
      const match = updated.find((c) => c.id === cattleId);
      if (match) setActiveCattleDetail(match);
    }
  };

  const handleDeleteCattle = (cattleId: string) => {
    const updated = cattleList.filter((c) => c.id !== cattleId);
    setCattleList(updated);
    saveStoredCattle(updated);
    setActiveCattleDetail(null);
  };

  // Task handlers
  const handleSaveTask = (newTask: CareTask) => {
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleToggleTaskComplete = (taskId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.isCompleted;
        return {
          ...t,
          isCompleted: nextState,
          completedDate: nextState ? today : undefined
        };
      }
      return t;
    });
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveStoredTasks(updated);
  };

  // Ledger handlers
  const handleSaveTransaction = (entry: FarmLedgerEntry) => {
    const updated = [entry, ...ledger];
    setLedger(updated);
    saveStoredLedger(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = ledger.filter((l) => l.id !== id);
    setLedger(updated);
    saveStoredLedger(updated);
  };

  // Profile handler
  const handleUpdateProfile = (updatedProfile: FarmProfile) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
  };

  // Bookmark handler
  const handleToggleBookmark = (diseaseId: string) => {
    const updated = toggleStoredBookmark(diseaseId);
    setBookmarks(updated);
  };

  const pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#202820] flex flex-col font-sans">
      {/* Top Application Bar */}
      <TopBar
        profile={profile}
        pendingTasksCount={pendingTasksCount}
        onOpenSearch={() => setIsGlobalSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Main Content Area — Occupies Available Viewport Naturally without fake phone bezel */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 pt-3 pb-24">
        {/* If an animal detail view is currently open, show it */}
        {activeCattleDetail ? (
          <CattleDetailView
            cattle={activeCattleDetail}
            onBack={() => setActiveCattleDetail(null)}
            onEdit={(cat) => {
              setEditingCattle(cat);
              setIsAddCattleOpen(true);
            }}
            onArchive={handleArchiveCattle}
            onDelete={handleDeleteCattle}
            onUpdateCattle={handleSaveCattle}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                profile={profile}
                cattleList={cattleList}
                tasks={tasks}
                ledger={ledger}
                onOpenSearch={() => setIsGlobalSearchOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenAddCattle={() => {
                  setEditingCattle(null);
                  setIsAddCattleOpen(true);
                }}
                onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
                onSelectArticle={(art) => setSelectedArticle(art)}
                onSelectDisease={(dis) => setSelectedDisease(dis)}
                onSelectMedicine={(med) => setSelectedMedicine(med)}
                onSelectSymptom={(sym) => setIsSymptomCheckerOpen(true)}
                onSelectCattle={(c) => setActiveCattleDetail(c)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
              />
            )}

            {currentTab === 'diseases' && (
              <DiseaseScreen
                onSelectDisease={(dis) => setSelectedDisease(dis)}
                onSelectMedicine={(med) => setSelectedMedicine(med)}
                onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {currentTab === 'cattle' && (
              <MyCattleScreen
                cattleList={cattleList}
                onSelectCattle={(c) => setActiveCattleDetail(c)}
                onOpenAddModal={() => {
                  setEditingCattle(null);
                  setIsAddCattleOpen(true);
                }}
              />
            )}

            {currentTab === 'care' && (
              <CareRoutineScreen
                tasks={tasks}
                onToggleTaskComplete={handleToggleTaskComplete}
                onDeleteTask={handleDeleteTask}
                onOpenAddTaskModal={() => setIsAddTaskOpen(true)}
                onSelectArticle={(art) => setSelectedArticle(art)}
                cattleList={cattleList}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                ledger={ledger}
                onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
                onDeleteTransaction={handleDeleteTransaction}
                onRefreshData={reloadFromStorage}
                onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Primary Bottom Navigation Bar (5 Destinations) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveCattleDetail(null);
          setCurrentTab(tab);
        }}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectDisease={(dis) => setSelectedDisease(dis)}
        onSelectMedicine={(med) => setSelectedMedicine(med)}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onSelectSymptom={(_sym) => {
          setIsSymptomCheckerOpen(true);
        }}
        cattleList={cattleList}
        onSelectCattle={(c) => setActiveCattleDetail(c)}
      />

      {/* Disease Detail Modal */}
      <DiseaseDetailModal
        disease={selectedDisease}
        isOpen={Boolean(selectedDisease)}
        onClose={() => setSelectedDisease(null)}
        isBookmarked={selectedDisease ? bookmarks.includes(selectedDisease.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Medicine Detail Modal */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        isOpen={Boolean(selectedMedicine)}
        onClose={() => setSelectedMedicine(null)}
      />

      {/* Educational Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Symptom Checker Wizard Modal */}
      <SymptomCheckerModal
        isOpen={isSymptomCheckerOpen}
        onClose={() => setIsSymptomCheckerOpen(false)}
        onSelectDisease={(dis) => setSelectedDisease(dis)}
      />

      {/* Add / Edit Cattle Modal */}
      <AddEditCattleModal
        isOpen={isAddCattleOpen}
        onClose={() => {
          setIsAddCattleOpen(false);
          setEditingCattle(null);
        }}
        onSave={handleSaveCattle}
        existingCattle={editingCattle}
      />

      {/* Add Care Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSaveTask={handleSaveTask}
        cattleList={cattleList}
      />

      {/* Add Ledger Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onSave={handleSaveTransaction}
        cattleList={cattleList}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        tasks={tasks}
        onToggleTaskComplete={handleToggleTaskComplete}
      />

      {/* Veterinary Disclaimer Modal */}
      <VeterinaryDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
