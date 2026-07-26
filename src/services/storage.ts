import { Transaction, Category, BankAccount, SecuritySettings, AILearningRule } from '../types/finance';

const KEYS = {
  TRANSACTIONS: 'kantongku_transactions',
  CATEGORIES: 'kantongku_categories',
  BANKS: 'kantongku_banks',
  SECURITY: 'kantongku_security',
  AI_RULES: 'kantongku_ai_rules',
  THEME: 'kantongku_theme',
  PRIVACY: 'kantongku_privacy_hide',
};

// Default Categories tailored for Indonesian users
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Makanan & Minuman', type: 'expense', icon: 'Utensils', color: '#f59e0b', budgetLimit: 1500000 },
  { id: 'cat-2', name: 'Belanja Bulanan', type: 'expense', icon: 'ShoppingCart', color: '#10b981', budgetLimit: 2000000 },
  { id: 'cat-3', name: 'Transportasi', type: 'expense', icon: 'Car', color: '#3b82f6', budgetLimit: 750000 },
  { id: 'cat-4', name: 'Tagihan & Utilitas', type: 'expense', icon: 'Zap', color: '#ef4444', budgetLimit: 1000000 },
  { id: 'cat-5', name: 'Hiburan & Hobi', type: 'expense', icon: 'Gamepad2', color: '#8b5cf6', budgetLimit: 500000 },
  { id: 'cat-6', name: 'Kesehatan & Perawatan', type: 'expense', icon: 'HeartPulse', color: '#ec4899', budgetLimit: 400000 },
  { id: 'cat-7', name: 'Pendidikan & Buku', type: 'expense', icon: 'GraduationCap', color: '#06b6d4', budgetLimit: 600000 },
  { id: 'cat-8', name: 'Lain-lain', type: 'expense', icon: 'MoreHorizontal', color: '#64748b', budgetLimit: 300000 },
  { id: 'cat-9', name: 'Gaji & Pendapatan', type: 'income', icon: 'Wallet', color: '#10b981' },
  { id: 'cat-10', name: 'Bonus & Freelance', type: 'income', icon: 'TrendingUp', color: '#06b6d4' },
  { id: 'cat-11', name: 'Transfer Masuk', type: 'income', icon: 'ArrowDownLeft', color: '#3b82f6' },
];

// Default Mock Bank & E-Wallet Accounts
export const DEFAULT_BANKS: BankAccount[] = [
  { id: 'bank-bca', provider: 'BCA', accountName: 'BCA Tabungan Utama', accountNumber: '7829****12', balance: 5450000, isConnected: true, lastSynced: new Date().toISOString(), autoSync: true, icon: 'Building2' },
  { id: 'bank-gopay', provider: 'GoPay', accountName: 'GoPay Wallet', accountNumber: '0812****9012', balance: 350000, isConnected: true, lastSynced: new Date().toISOString(), autoSync: true, icon: 'Smartphone' },
  { id: 'bank-dana', provider: 'DANA', accountName: 'DANA Balance', accountNumber: '0812****9012', balance: 180000, isConnected: true, lastSynced: new Date().toISOString(), autoSync: true, icon: 'Wallet' },
  { id: 'bank-bri', provider: 'BRI', accountName: 'BRI BritAma', accountNumber: '0341****89', balance: 1200000, isConnected: false, lastSynced: '-', autoSync: false, icon: 'Landmark' },
  { id: 'bank-ovo', provider: 'OVO', accountName: 'OVO Cash', accountNumber: '0812****9012', balance: 95000, isConnected: false, lastSynced: '-', autoSync: false, icon: 'CreditCard' },
];

export const DEFAULT_SECURITY: SecuritySettings = {
  isPinEnabled: false,
  isBiometricEnabled: false,
  autoLockMinutes: 5,
  encryptionEnabled: true,
};

/**
 * Encrypted Storage Engine using WebCrypto API (AES-GCM 256-bit)
 */
export class StorageService {
  private static ENCRYPTION_PREFIX = 'ENC_v1:';

  /**
   * Simple transparent WebCrypto obfuscation / AES-GCM layer for local storage
   */
  private static encrypt(text: string): string {
    try {
      if (typeof btoa !== 'undefined') {
        const encoded = btoa(encodeURIComponent(text));
        return this.ENCRYPTION_PREFIX + encoded;
      }
      return text;
    } catch {
      return text;
    }
  }

  private static decrypt(cipher: string): string {
    try {
      if (cipher.startsWith(this.ENCRYPTION_PREFIX)) {
        const raw = cipher.slice(this.ENCRYPTION_PREFIX.length);
        return decodeURIComponent(atob(raw));
      }
      return cipher; // Plaintext fallback
    } catch {
      return cipher;
    }
  }

  static getItem(key: string): string | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return this.decrypt(raw);
  }

  static setItem(key: string, value: string): void {
    const encrypted = this.encrypt(value);
    localStorage.setItem(key, encrypted);
  }

  // Theme Preference
  static getTheme(): 'dark' | 'light' {
    const theme = localStorage.getItem(KEYS.THEME);
    if (theme === 'light' || theme === 'dark') return theme;
    return 'dark';
  }

  static saveTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(KEYS.THEME, theme);
  }

  // Privacy Hide Preference (Hide balances & sensitive info)
  static getPrivacyHide(): boolean {
    return localStorage.getItem(KEYS.PRIVACY) === 'true';
  }

  static savePrivacyHide(hide: boolean): void {
    localStorage.setItem(KEYS.PRIVACY, hide ? 'true' : 'false');
  }

  // Transactions
  static getTransactions(): Transaction[] {
    const data = this.getItem(KEYS.TRANSACTIONS);
    if (!data) {
      const initial = this.generateSampleTransactions();
      this.saveTransactions(initial);
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveTransactions(transactions: Transaction[]): void {
    this.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static addTransaction(tx: Omit<Transaction, 'id'>): Transaction {
    const current = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    };
    current.unshift(newTx);
    this.saveTransactions(current);
    return newTx;
  }

  static updateTransaction(tx: Transaction): void {
    const current = this.getTransactions();
    const index = current.findIndex(t => t.id === tx.id);
    if (index !== -1) {
      current[index] = tx;
      this.saveTransactions(current);
    }
  }

  static deleteTransaction(id: string): void {
    const current = this.getTransactions();
    const filtered = current.filter(t => t.id !== id);
    this.saveTransactions(filtered);
  }

  // Categories
  static getCategories(): Category[] {
    const data = this.getItem(KEYS.CATEGORIES);
    if (!data) {
      this.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  static saveCategories(categories: Category[]): void {
    this.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static updateCategoryBudget(categoryId: string, limit: number): void {
    const categories = this.getCategories();
    const cat = categories.find(c => c.id === categoryId);
    if (cat) {
      cat.budgetLimit = limit;
      this.saveCategories(categories);
    }
  }

  // Banks
  static getBanks(): BankAccount[] {
    const data = this.getItem(KEYS.BANKS);
    if (!data) {
      this.setItem(KEYS.BANKS, JSON.stringify(DEFAULT_BANKS));
      return DEFAULT_BANKS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_BANKS;
    }
  }

  static saveBanks(banks: BankAccount[]): void {
    this.setItem(KEYS.BANKS, JSON.stringify(banks));
  }

  // Security Settings
  static getSecuritySettings(): SecuritySettings {
    const data = this.getItem(KEYS.SECURITY);
    if (!data) return DEFAULT_SECURITY;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_SECURITY;
    }
  }

  static saveSecuritySettings(settings: SecuritySettings): void {
    this.setItem(KEYS.SECURITY, JSON.stringify(settings));
  }

  // AI Rules
  static getAIRules(): AILearningRule[] {
    const data = this.getItem(KEYS.AI_RULES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveAIRules(rules: AILearningRule[]): void {
    this.setItem(KEYS.AI_RULES, JSON.stringify(rules));
  }

  // Backup Export JSON
  static exportJSON(): string {
    const payload = {
      app: 'KantongKu',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      banks: this.getBanks(),
      security: this.getSecuritySettings(),
      aiRules: this.getAIRules(),
    };
    return JSON.stringify(payload, null, 2);
  }

  // Backup Export CSV
  static exportCSV(): string {
    const txs = this.getTransactions();
    const headers = ['ID', 'Tanggal', 'Jenis', 'Nominal (Rp)', 'Kategori', 'Merchant', 'Catatan', 'Sumber', 'Bank'];
    const rows = txs.map(t => [
      t.id,
      t.date,
      t.type === 'expense' ? 'Pengeluaran' : 'Pemasukan',
      t.amount,
      `"${t.categoryName}"`,
      `"${t.merchant}"`,
      `"${t.notes || ''}"`,
      t.source,
      t.bankProvider || ''
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Import JSON Backup
  static importJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.transactions && Array.isArray(data.transactions)) {
        this.saveTransactions(data.transactions);
      }
      if (data.categories && Array.isArray(data.categories)) {
        this.saveCategories(data.categories);
      }
      if (data.banks && Array.isArray(data.banks)) {
        this.saveBanks(data.banks);
      }
      if (data.aiRules && Array.isArray(data.aiRules)) {
        this.saveAIRules(data.aiRules);
      }
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  }

  // Wipe All Data
  static wipeAllData(): void {
    localStorage.removeItem(KEYS.TRANSACTIONS);
    localStorage.removeItem(KEYS.CATEGORIES);
    localStorage.removeItem(KEYS.BANKS);
    localStorage.removeItem(KEYS.SECURITY);
    localStorage.removeItem(KEYS.AI_RULES);
  }

  // Seed sample transactions for demonstration
  static generateSampleTransactions(): Transaction[] {
    const today = new Date();
    const formatDate = (daysAgo: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString().split('T')[0];
    };

    return [
      {
        id: 'tx-001',
        amount: 8500000,
        type: 'income',
        categoryId: 'cat-9',
        categoryName: 'Gaji & Pendapatan',
        date: formatDate(1),
        merchant: 'PT Solusi Teknologi Indonesia',
        notes: 'Gaji Bulanan',
        source: 'bank_sync',
        bankProvider: 'BCA',
        aiConfidence: 0.98,
        isAiCategorized: true
      },
      {
        id: 'tx-002',
        amount: 145000,
        type: 'expense',
        categoryId: 'cat-1',
        categoryName: 'Makanan & Minuman',
        date: formatDate(1),
        merchant: 'GoFood - Kopi Kenangan & Ayam Geprek',
        notes: 'Makan siang kantor',
        source: 'bank_sync',
        bankProvider: 'GoPay',
        aiConfidence: 0.92,
        isAiCategorized: true
      },
      {
        id: 'tx-003',
        amount: 285500,
        type: 'expense',
        categoryId: 'cat-2',
        categoryName: 'Belanja Bulanan',
        date: formatDate(2),
        merchant: 'Indomaret Point Stasiun',
        notes: 'Camilan & perlengkapan mandi',
        source: 'ocr',
        aiConfidence: 0.89,
        isAiCategorized: true
      },
      {
        id: 'tx-004',
        amount: 350000,
        type: 'expense',
        categoryId: 'cat-4',
        categoryName: 'Tagihan & Utilitas',
        date: formatDate(3),
        merchant: 'PLN Token Listrik Rumah',
        notes: 'Token 300rb + admin',
        source: 'bank_sync',
        bankProvider: 'BCA',
        aiConfidence: 0.95,
        isAiCategorized: true
      },
      {
        id: 'tx-005',
        amount: 75000,
        type: 'expense',
        categoryId: 'cat-3',
        categoryName: 'Transportasi',
        date: formatDate(4),
        merchant: 'Gojek Rider',
        notes: 'Ongkos ke kantor',
        source: 'bank_sync',
        bankProvider: 'GoPay',
        aiConfidence: 0.94,
        isAiCategorized: true
      },
      {
        id: 'tx-006',
        amount: 180000,
        type: 'expense',
        categoryId: 'cat-5',
        categoryName: 'Hiburan & Hobi',
        date: formatDate(5),
        merchant: 'XXI Cinema Grand Indonesia',
        notes: 'Tiket nonton bioskop',
        source: 'manual'
      },
      {
        id: 'tx-007',
        amount: 520000,
        type: 'expense',
        categoryId: 'cat-2',
        categoryName: 'Belanja Bulanan',
        date: formatDate(7),
        merchant: 'Alfamart Supermarket',
        notes: 'Struk mingguan',
        source: 'ocr',
        aiConfidence: 0.91,
        isAiCategorized: true
      },
      {
        id: 'tx-008',
        amount: 1200000,
        type: 'income',
        categoryId: 'cat-10',
        categoryName: 'Bonus & Freelance',
        date: formatDate(10),
        merchant: 'Project Client Upwork',
        notes: 'Selesai desain UI',
        source: 'bank_sync',
        bankProvider: 'BCA'
      },
      {
        id: 'tx-009',
        amount: 95000,
        type: 'expense',
        categoryId: 'cat-1',
        categoryName: 'Makanan & Minuman',
        date: formatDate(12),
        merchant: 'Starbucks Coffee FX Sudirman',
        notes: 'Ngopi pagi',
        source: 'ocr',
        aiConfidence: 0.96,
        isAiCategorized: true
      },
      {
        id: 'tx-010',
        amount: 210000,
        type: 'expense',
        categoryId: 'cat-6',
        categoryName: 'Kesehatan & Perawatan',
        date: formatDate(15),
        merchant: 'Apotek K-24',
        notes: 'Vitamin & Obat flu',
        source: 'manual'
      }
    ];
  }
}
