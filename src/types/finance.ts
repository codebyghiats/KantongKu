export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  budgetLimit?: number; // Optional monthly limit in IDR
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  date: string; // ISO format YYYY-MM-DD
  merchant: string;
  notes?: string;
  source: 'manual' | 'ocr' | 'bank_sync';
  bankProvider?: string; // BCA, BRI, GoPay, OVO, DANA
  aiConfidence?: number; // 0 to 1
  isAiCategorized?: boolean;
  userCorrectedAi?: boolean;
}

export interface BankAccount {
  id: string;
  provider: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  isConnected: boolean;
  lastSynced: string;
  autoSync: boolean;
  icon: string;
}

export interface BudgetStatus {
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger'; // safe <80%, warning 80-99%, danger >=100%
}

export interface OCRResult {
  merchant: string;
  amount: number;
  date: string;
  suggestedCategoryId: string;
  suggestedCategoryName: string;
  confidence: number;
  rawText: string;
  items?: Array<{ name: string; price: number }>;
}

export interface SecuritySettings {
  isPinEnabled: boolean;
  pinHash?: string;
  isBiometricEnabled: boolean;
  autoLockMinutes: number;
  encryptionEnabled: boolean;
}

export interface AILearningRule {
  merchantKeyword: string;
  assignedCategoryId: string;
  frequency: number;
  lastUpdated: string;
}
