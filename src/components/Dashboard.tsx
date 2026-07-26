import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Scan,
  PlusCircle,
  Landmark,
  Target,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Transaction, Category, BankAccount, BudgetStatus } from '../types/finance';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  banks: BankAccount[];
  budgetStatuses: BudgetStatus[];
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onTriggerBankSync: () => void;
  isPrivacyHide: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  categories,
  banks,
  budgetStatuses,
  setActiveTab,
  onOpenAddModal,
  onTriggerBankSync,
  isPrivacyHide,
}) => {
  // Calculate totals for current month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const connectedBankBalance = banks.reduce((acc, b) => acc + (b.isConnected ? b.balance : 0), 0);
  const totalBalance = connectedBankBalance + (totalIncome - totalExpense);

  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // Find warnings or over-budget categories
  const warningBudgets = budgetStatuses.filter(b => b.status === 'warning' || b.status === 'danger');

  // Recent 5 transactions
  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      
      {/* Top Hero Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Penyimpanan Lokal Terenkripsi (WebCrypto AES-256)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ringkasan Keuangan KantongKu
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Pencatatan keuangan mandiri tanpa langganan. Data Anda 100% tersimpan aman secara lokal di HP/perangkat ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ocr')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Struk OCR</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-300 dark:border-slate-700 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Catat Transaksi</span>
            </button>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          
          {/* Total Saldo */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <span>Total Saldo Terhubung</span>
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isPrivacyHide ? 'Rp ••••••••' : `Rp ${totalBalance.toLocaleString('id-ID')}`}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{banks.filter(b => b.isConnected).length} akun terhubung</span>
            </p>
          </div>

          {/* Income */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <span>Pemasukan Bulan Ini</span>
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight flex items-center">
              <ArrowUpRight className="w-5 h-5 mr-1 shrink-0" />
              {isPrivacyHide ? 'Rp ••••••••' : `Rp ${totalIncome.toLocaleString('id-ID')}`}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {monthTransactions.filter(t => t.type === 'income').length} transaksi tercatat
            </p>
          </div>

          {/* Expense */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <span>Pengeluaran Bulan Ini</span>
              <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight flex items-center">
              <ArrowDownRight className="w-5 h-5 mr-1 shrink-0" />
              {isPrivacyHide ? 'Rp ••••••••' : `Rp ${totalExpense.toLocaleString('id-ID')}`}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {monthTransactions.filter(t => t.type === 'expense').length} transaksi tercatat
            </p>
          </div>

          {/* Savings Rate */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
              <span>Rasio Tabungan Bulan Ini</span>
              <div className="p-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {savingsRate}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Budget Warning Banner (If any category near limit) */}
      {warningBudgets.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300">Peringatan Anggaran: </span>
            {warningBudgets.map(b => (
              <span key={b.categoryId} className="mr-2">
                {b.categoryName} ({b.percentage}% dari limit Rp {b.limit.toLocaleString('id-ID')})
              </span>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('budget')}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
          >
            Kelola Anggaran
          </button>
        </div>
      )}

      {/* Main Grid: Recent Transactions & Bank Sync Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Transactions */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaksi Terbaru</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pencatatan manual, OCR struk, & sync akun terhubung</p>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTxs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Belum ada transaksi. Gunakan fitur OCR Scan Struk atau Catat Transaksi!
              </div>
            ) : (
              recentTxs.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{tx.merchant}</span>
                        {tx.source === 'ocr' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold">
                            OCR
                          </span>
                        )}
                        {tx.source === 'bank_sync' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                            {tx.bankProvider || 'Sync'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{tx.categoryName}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-extrabold ${
                        tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} {isPrivacyHide ? 'Rp ••••••••' : `Rp ${tx.amount.toLocaleString('id-ID')}`}
                    </div>
                    {tx.isAiCategorized && (
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center justify-end space-x-1 mt-0.5 font-medium">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Kategori Otomatis</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Bank Integration Status */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bank & E-Wallet</span>
              </h3>
              <button
                onClick={() => setActiveTab('banks')}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Kelola
              </button>
            </div>

            <div className="space-y-2.5 mb-4">
              {banks.slice(0, 4).map(b => (
                <div
                  key={b.id}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">{b.provider}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{b.accountName}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      b.isConnected
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {b.isConnected ? 'Terhubung' : 'Terputus'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onTriggerBankSync}
              className="w-full py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Simulasi Sync Transaksi</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
