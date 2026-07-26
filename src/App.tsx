import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { ReceiptScanner } from './components/ReceiptScanner';
import { BankIntegration } from './components/BankIntegration';
import { Budgeting } from './components/Budgeting';
import { VisualReports } from './components/VisualReports';
import { SecurityLock } from './components/SecurityLock';
import { SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';

import { Transaction, Category, BankAccount, SecuritySettings, BudgetStatus } from './types/finance';
import { StorageService } from './services/storage';
import { BankSyncService } from './services/bankSyncService';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(StorageService.getTheme());
  const [isPrivacyHide, setIsPrivacyHide] = useState<boolean>(StorageService.getPrivacyHide());

  // Core Data States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [security, setSecurity] = useState<SecuritySettings>(StorageService.getSecuritySettings());

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync Theme class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const togglePrivacyHide = () => {
    setIsPrivacyHide(prev => {
      const next = !prev;
      StorageService.savePrivacyHide(next);
      showToast(next ? 'Mode Privasi Aktif: Nominal disembunyikan.' : 'Mode Privasi Nonaktif: Nominal ditampilkan.');
      return next;
    });
  };

  // Load Data on Mount
  const loadAllData = () => {
    const txs = StorageService.getTransactions();
    const cats = StorageService.getCategories();
    const bks = StorageService.getBanks();
    const sec = StorageService.getSecuritySettings();

    setTransactions(txs);
    setCategories(cats);
    setBanks(bks);
    setSecurity(sec);

    if (sec.isPinEnabled) {
      setIsLocked(true);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Transaction Handlers
  const handleAddTransaction = (tx: Omit<Transaction, 'id'>) => {
    const created = StorageService.addTransaction(tx);
    setTransactions(prev => [created, ...prev]);
    showToast(`Transaksi "${tx.merchant}" berhasil ditambahkan!`);
  };

  const handleUpdateTransaction = (tx: Transaction) => {
    StorageService.updateTransaction(tx);
    setTransactions(prev => prev.map(t => (t.id === tx.id ? tx : t)));
    showToast(`Transaksi "${tx.merchant}" berhasil diperbarui.`);
  };

  const handleDeleteTransaction = (id: string) => {
    StorageService.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaksi berhasil dihapus.');
  };

  // Category & Budget Handlers
  const handleAddCategory = (cat: Category) => {
    const updated = [...categories, cat];
    StorageService.saveCategories(updated);
    setCategories(updated);
    showToast(`Kategori "${cat.name}" berhasil dibuat!`);
  };

  const handleUpdateBudget = (categoryId: string, limit: number) => {
    StorageService.updateCategoryBudget(categoryId, limit);
    setCategories(StorageService.getCategories());
    showToast('Limit anggaran berhasil diperbarui.');
  };

  // Bank Handlers
  const handleToggleBank = (id: string) => {
    const updated = BankSyncService.toggleAccountConnection(id);
    setBanks([...updated]);
    showToast('Status koneksi akun diperbarui.');
  };

  const handleUpdateBankAccount = (bank: BankAccount) => {
    const updated = banks.map(b => (b.id === bank.id ? bank : b));
    StorageService.saveBanks(updated);
    setBanks(updated);
    showToast(`Detail akun "${bank.provider}" berhasil diperbarui.`);
  };

  const handleAddBankAccount = (bank: BankAccount) => {
    const updated = [...banks, bank];
    StorageService.saveBanks(updated);
    setBanks(updated);
    showToast(`Akun "${bank.provider}" (${bank.accountName}) berhasil ditambahkan!`);
  };

  const handleTriggerBankSync = () => {
    const result = BankSyncService.syncConnectedAccounts(categories);
    if (result.addedCount > 0) {
      setTransactions(StorageService.getTransactions());
      setBanks(StorageService.getBanks());

      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      showToast(
        `Auto-sync berhasil! ${result.addedCount} transaksi baru diimpor (Rp ${result.totalSyncedAmount.toLocaleString('id-ID')}).`
      );
    } else {
      showToast('Seluruh akun terhubung sudah tersinkronkan.');
    }
  };

  // Calculate Budget Statuses
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));

  const budgetStatuses: BudgetStatus[] = categories
    .filter(c => c.type === 'expense' && c.budgetLimit && c.budgetLimit > 0)
    .map(c => {
      const spent = monthExpenses
        .filter(t => t.categoryId === c.id)
        .reduce((acc, t) => acc + t.amount, 0);
      const limit = c.budgetLimit || 1;
      const percentage = Math.round((spent / limit) * 100);
      let status: 'safe' | 'warning' | 'danger' = 'safe';
      if (percentage >= 100) status = 'danger';
      else if (percentage >= 80) status = 'warning';

      return {
        categoryId: c.id,
        categoryName: c.name,
        limit,
        spent,
        percentage,
        status,
      };
    });

  // Calculate Total Balance
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const connectedBankBalance = banks.reduce((acc, b) => acc + (b.isConnected ? b.balance : 0), 0);
  const totalBalance = connectedBankBalance + (totalIncome - totalExpense);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* App Opening Transition Splash Screen */}
      {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}

      {/* Security Lock Screen Modal */}
      {isLocked && !showSplash && <SecurityLock settings={security} onUnlock={() => setIsLocked(false)} />}

      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLockApp={() => setIsLocked(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalBalance={totalBalance}
        theme={theme}
        onToggleTheme={toggleTheme}
        isPrivacyHide={isPrivacyHide}
        onTogglePrivacyHide={togglePrivacyHide}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Toast Alert Banner */}
        {toastMsg && (
          <div className="fixed top-20 right-4 z-50 glass-card px-4 py-3 rounded-2xl border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xl flex items-center space-x-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tab Router with Smooth Fade Transition */}
        <div key={activeTab} className="animate-tab-fade">
          {activeTab === 'dashboard' && (
            <Dashboard
              transactions={transactions}
              categories={categories}
              banks={banks}
              budgetStatuses={budgetStatuses}
              setActiveTab={setActiveTab}
              onOpenAddModal={() => setActiveTab('transactions')}
              onTriggerBankSync={handleTriggerBankSync}
              isPrivacyHide={isPrivacyHide}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionList
              transactions={transactions}
              categories={categories}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onAddCategory={handleAddCategory}
            />
          )}

          {activeTab === 'ocr' && (
            <ReceiptScanner
              categories={categories}
              onSaveScannedTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'budget' && (
            <Budgeting
              budgetStatuses={budgetStatuses}
              categories={categories}
              onUpdateBudget={handleUpdateBudget}
            />
          )}

          {activeTab === 'banks' && (
            <BankIntegration
              banks={banks}
              onToggleBank={handleToggleBank}
              onTriggerSync={handleTriggerBankSync}
              onUpdateBankAccount={handleUpdateBankAccount}
              onAddBankAccount={handleAddBankAccount}
              isPrivacyHide={isPrivacyHide}
            />
          )}

          {activeTab === 'reports' && (
            <VisualReports
              transactions={transactions}
              categories={categories}
            />
          )}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        security={security}
        onUpdateSecurity={sec => {
          setSecurity(sec);
          StorageService.saveSecuritySettings(sec);
        }}
        onReloadData={loadAllData}
      />

      {/* Responsive Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
