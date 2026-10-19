import { CattleRecord, CareTask, FarmLedgerEntry, FarmProfile } from '../types';
import { INITIAL_SAMPLE_CATTLE, INITIAL_CARE_TASKS, INITIAL_LEDGER_ENTRIES, DEFAULT_FARM_PROFILE } from '../data/seedData';

const STORAGE_KEYS = {
  CATTLE: 'goru_sathi_cattle_v1',
  TASKS: 'goru_sathi_tasks_v1',
  LEDGER: 'goru_sathi_ledger_v1',
  PROFILE: 'goru_sathi_profile_v1',
  BOOKMARKS: 'goru_sathi_bookmarks_v1',
  ONBOARDED: 'goru_sathi_onboarded_v1'
};

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  if (num === undefined || num === null) return '';
  const str = num.toString();
  return str.replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

export function formatTaka(amount: number): string {
  if (isNaN(amount)) return '৳ ০';
  const formatted = amount.toLocaleString('en-IN');
  return `৳ ${toBengaliNumber(formatted)}`;
}

export function getStoredCattle(): CattleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATTLE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATTLE, JSON.stringify(INITIAL_SAMPLE_CATTLE));
      return INITIAL_SAMPLE_CATTLE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading cattle records:', err);
    return INITIAL_SAMPLE_CATTLE;
  }
}

export function saveStoredCattle(records: CattleRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATTLE, JSON.stringify(records));
  } catch (err: any) {
    console.error('Error saving cattle records:', err);
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      alert('ফোনের লোকাল স্টোরেজ পূর্ণ হয়ে গেছে। অনুগ্রহ করে অপ্রয়োজনীয় তথ্য মুছুন।');
    }
  }
}

export function getStoredTasks(): CareTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_CARE_TASKS));
      return INITIAL_CARE_TASKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading tasks:', err);
    return INITIAL_CARE_TASKS;
  }
}

export function saveStoredTasks(tasks: CareTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks:', err);
  }
}

export function getStoredLedger(): FarmLedgerEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEDGER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(INITIAL_LEDGER_ENTRIES));
      return INITIAL_LEDGER_ENTRIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading ledger:', err);
    return INITIAL_LEDGER_ENTRIES;
  }
}

export function saveStoredLedger(ledger: FarmLedgerEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(ledger));
  } catch (err) {
    console.error('Error saving ledger:', err);
  }
}

export function getStoredProfile(): FarmProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_FARM_PROFILE));
      return DEFAULT_FARM_PROFILE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading farm profile:', err);
    return DEFAULT_FARM_PROFILE;
  }
}

export function saveStoredProfile(profile: FarmProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err: any) {
    console.error('Error saving farm profile:', err);
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      alert('ফোনের লোকাল স্টোরেজ পূর্ণ হয়ে গেছে। অনুগ্রহ করে অপ্রয়োজনীয় তথ্য মুছুন।');
    }
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : ['fmd', 'mastitis'];
  } catch {
    return ['fmd', 'mastitis'];
  }
}

export function toggleStoredBookmark(diseaseId: string): string[] {
  try {
    const current = getStoredBookmarks();
    const updated = current.includes(diseaseId)
      ? current.filter(id => id !== diseaseId)
      : [...current, diseaseId];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function exportBackupData(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    cattle: getStoredCattle(),
    tasks: getStoredTasks(),
    ledger: getStoredLedger(),
    profile: getStoredProfile(),
    bookmarks: getStoredBookmarks()
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.cattle && Array.isArray(data.cattle)) {
      saveStoredCattle(data.cattle);
    }
    if (data.tasks && Array.isArray(data.tasks)) {
      saveStoredTasks(data.tasks);
    }
    if (data.ledger && Array.isArray(data.ledger)) {
      saveStoredLedger(data.ledger);
    }
    if (data.profile) {
      saveStoredProfile(data.profile);
    }
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data.bookmarks));
    }
    return true;
  } catch (err) {
    console.error('Error importing backup:', err);
    return false;
  }
}

export function clearSampleDataAndReset(): void {
  localStorage.setItem(STORAGE_KEYS.CATTLE, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
}

export function resetToDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.CATTLE, JSON.stringify(INITIAL_SAMPLE_CATTLE));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_CARE_TASKS));
  localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(INITIAL_LEDGER_ENTRIES));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_FARM_PROFILE));
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(['fmd', 'mastitis']));
}
