export type TabType = 'home' | 'diseases' | 'cattle' | 'care' | 'profile';

export type DiseaseCategory = 'infectious' | 'digestive' | 'parasitic' | 'calf' | 'metabolic' | 'reproductive';
export type UrgencyLevel = 'urgent' | 'warning' | 'moderate';

export interface DiseaseSource {
  title: string;
  organization: string;
  url?: string;
  publicationDate?: string;
  verificationDate: string;
  verificationStatus: 'verified' | 'needs_review';
}

export interface Disease {
  id: string;
  nameBn: string;
  nameEn: string;
  category: DiseaseCategory;
  categoryBn: string;
  summary: string;
  commonSymptoms: string[];
  causesAndRisks: string[];
  transmission?: string;
  safeImmediateSteps: string[];
  whatNotToDo: string[];
  whenToCallVet: string[];
  prevention: string[];
  vaccinationInfo?: string;
  relatedConditions: string[];
  urgency: UrgencyLevel;
  sources: DiseaseSource[];
}

export interface MedicineEntry {
  id: string;
  genericName: string;
  genericNameBn: string;
  commonBrands?: string;
  category: string;
  intendedUses: string[];
  speciesAndIndication: string;
  routeOfAdministration: string;
  howToUse?: string; // কীভাবে ব্যবহার করতে হবে
  whenToUse?: string; // কখন ব্যবহার করতে হবে
  targetDiseases?: string[]; // কোন কোন রোগে ব্যবহারযোগ্য
  dosageGuideline?: string; // মাত্রা নির্ধারণ নীতি
  contraindications: string[];
  adverseEffects: string[];
  professionalSupervisionRequired: boolean;
  withdrawalPeriodMilk: string;
  withdrawalPeriodMeat: string;
  storageInstructions: string;
  sourceDoc: string;
  sourceDate: string;
  verificationStatus: 'verified' | 'needs_review';
  imageUrl?: string;
}

export interface SymptomItem {
  id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  isUrgentFlag?: boolean;
}

export interface CattleRecord {
  id: string;
  name: string;
  tagId: string;
  breed: string;
  sex: 'গাভী' | 'ষাঁড়' | 'বকনা' | 'এঁড়ে বাছুর' | 'বকনা বাছুর';
  dobOrAge: string;
  purpose: 'দুধ উৎপাদন (Dairy)' | 'মোটাতাজাকরণ (Beef Fattening)' | 'প্রজনন (Breeding)' | 'অন্যান্য';
  currentWeightKg?: number;
  purchaseDate?: string;
  purchasePrice?: number;
  status: 'সুস্থ' | 'চিকিৎসাধীন' | 'গর্ভবতী' | 'সংরক্ষিত (Archived)';
  photoUrl?: string;
  healthNotes?: string;
  vaccinations: {
    id: string;
    vaccineName: string;
    date: string;
    nextDueDate?: string;
    veterinarian?: string;
  }[];
  dewormingHistory: {
    id: string;
    medicineName: string;
    date: string;
    nextDueDate?: string;
  }[];
  treatments: {
    id: string;
    date: string;
    condition: string;
    prescribedBy: string;
    notes: string;
  }[];
  milkYieldRecords?: {
    date: string;
    morningLiters: number;
    eveningLiters: number;
  }[];
}

export interface CareTask {
  id: string;
  cattleId?: string; // empty means whole farm
  cattleName?: string;
  title: string;
  category: 'টিকা (Vaccine)' | 'কৃমিনাশক (Deworming)' | 'পশুচিকিৎসক পরিদর্শন' | 'প্রজনন ও কৃত্রিম প্রজনন' | 'ওজন পরিমাপ' | 'খাবার পর্যালোচনা' | 'শেড পরিষ্কার ও জীবাণুমুক্তকরণ' | 'অন্যান্য';
  dueDate: string;
  isCompleted: boolean;
  completedDate?: string;
  notes?: string;
  priority: 'জরুরি' | 'সাধারণ';
}

export interface FarmLedgerEntry {
  id: string;
  date: string;
  type: 'খরচ' | 'আয়';
  category: 'খাদ্য ও পুষ্টি' | 'চিকিৎসা ও ওষুধ' | 'টিকা ও প্রতিষেধক' | 'পশু ক্রয়' | 'পশু বিক্রয়' | 'দুধ বিক্রয়' | 'শ্রম ও ব্যবস্থাপনা' | 'অন্যান্য';
  cattleId?: string;
  cattleName?: string;
  amount: number;
  notes: string;
}

export interface CareGuideArticle {
  id: string;
  title: string;
  category: 'পুষ্টি ও খাদ্য' | 'বাসস্থান ও জৈবনিরাপত্তা' | 'বাছুর পরিচর্যা' | 'দুগ্ধ ব্যবস্থাপনা' | 'মোটাতাজাকরণ';
  summary: string;
  practicalSteps: string[];
  cautions: string[];
  reference: string;
  imageUrl?: string;
}

export interface FarmProfile {
  farmerName: string;
  farmName: string;
  district: string;
  upazila: string;
  primaryFocus: string;
  phoneContact?: string;
  notificationsEnabled: boolean;
  language: 'bn' | 'en';
  avatarUrl?: string;
}
