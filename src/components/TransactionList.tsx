import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Scan,
  Landmark,
  X,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types/finance';
import { AICategorizerService } from '../services/aiCategorizer';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddCategory: (cat: Category) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onAddCategory,
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Form State
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.id || 'cat-1');
  const [formMerchant, setFormMerchant] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<TransactionType>('expense');
  const [newCatColor, setNewCatColor] = useState('#10b981');
  const [newCatLimit, setNewCatLimit] = useState('');

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    const matchSearch =
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchType = selectedType === 'all' || t.type === selectedType;
    const matchCategory = selectedCategory === 'all' || t.categoryId === selectedCategory;
    const matchMonth = !selectedMonth || t.date.startsWith(selectedMonth);

    return matchSearch && matchType && matchCategory && matchMonth;
  });

  const openAddModal = () => {
    setEditingTx(null);
    setFormType('expense');
    setFormAmount('');
    setFormCategory(categories[0]?.id || 'cat-1');
    setFormMerchant('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setFormType(tx.type);
    setFormAmount(tx.amount.toString());
    setFormCategory(tx.categoryId);
    setFormMerchant(tx.merchant);
    setFormDate(tx.date);
    setFormNotes(tx.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || !formMerchant) return;

    const catObj = categories.find(c => c.id === formCategory);
    const categoryName = catObj ? catObj.name : 'Lain-lain';

    if (editingTx) {
      // Record AI Feedback if user changed category
      if (editingTx.categoryId !== formCategory) {
        AICategorizerService.recordUserFeedback(formMerchant, formCategory);
      }

      onUpdateTransaction({
        ...editingTx,
        amount: parseFloat(formAmount),
        type: formType,
        categoryId: formCategory,
        categoryName,
        date: formDate,
        merchant: formMerchant,
        notes: formNotes,
        userCorrectedAi: editingTx.categoryId !== formCategory ? true : editingTx.userCorrectedAi,
      });
    } else {
      onAddTransaction({
        amount: parseFloat(formAmount),
        type: formType,
        categoryId: formCategory,
        categoryName,
        date: formDate,
        merchant: formMerchant,
        notes: formNotes,
        source: 'manual',
      });
    }

    setIsAddModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    onAddCategory({
      id: 'cat-custom-' + Date.now(),
      name: newCatName.trim(),
      type: newCatType,
      icon: 'Tag',
      color: newCatColor,
      budgetLimit: newCatLimit ? parseFloat(newCatLimit) : undefined,
    });

    setNewCatName('');
    setNewCatLimit('');
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      
      {/* Header & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pencatatan Transaksi</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Kelola dan pantau seluruh histori pemasukan & pengeluaran</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition shadow-sm"
          >
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kelola Kategori</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Transaksi</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari merchant / catatan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Month Selector */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as any)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Semua Jenis</option>
          <option value="expense">Pengeluaran Sahaja</option>
          <option value="income">Pemasukan Sahaja</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Semua Kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.type === 'income' ? 'Masuk' : 'Keluar'})
            </option>
          ))}
        </select>
      </div>

      {/* Transaction Table / Cards */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-xl">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400 text-xs">
            Tidak ada transaksi yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/60">
            {filteredTransactions.map(tx => (
              <div
                key={tx.id}
                className="p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{tx.merchant}</span>
                      {tx.source === 'ocr' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold flex items-center space-x-1">
                          <Scan className="w-3 h-3" />
                          <span>OCR</span>
                        </span>
                      )}
                      {tx.source === 'bank_sync' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                          <Landmark className="w-3 h-3" />
                          <span>{tx.bankProvider}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {tx.categoryName}
                      </span>
                      <span>•</span>
                      <span>{tx.date}</span>
                      {tx.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-500 dark:text-slate-400">"{tx.notes}"</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <div
                      className={`text-sm font-extrabold ${
                        tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(tx)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      title="Edit Transaksi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/25 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingTx ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
            </h3>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormType('expense')}
                  className={
                    formType === 'expense'
                      ? 'py-2 rounded-xl text-xs font-bold transition bg-rose-500 text-white shadow'
                      : 'py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('income')}
                  className={
                    formType === 'income'
                      ? 'py-2 rounded-xl text-xs font-bold transition bg-emerald-500 text-white shadow'
                      : 'py-2 rounded-xl text-xs font-bold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }
                >
                  Pemasukan
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 50000"
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Merchant / Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Merchant / Sumber</label>
                <input
                  type="text"
                  placeholder="Contoh: Indomaret, Gaji PT, Starbucks"
                  value={formMerchant}
                  onChange={e => setFormMerchant(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Kategori</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {categories
                    .filter(c => c.type === formType)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Makan siang kantor"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/25 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Buat Kategori Custom Baru</h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  placeholder="Contoh: Crypto & Saham, Pet Care"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Tipe Kategori</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCatType('expense')}
                    className={
                      newCatType === 'expense'
                        ? 'py-2 rounded-xl text-xs font-bold transition bg-rose-500 text-white shadow'
                        : 'py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('income')}
                    className={
                      newCatType === 'income'
                        ? 'py-2 rounded-xl text-xs font-bold transition bg-emerald-500 text-white shadow'
                        : 'py-2 rounded-xl text-xs font-bold transition bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }
                  >
                    Pemasukan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Limit Anggaran Bulanan (Rp) - Opsional</label>
                <input
                  type="number"
                  placeholder="Contoh: 1000000"
                  value={newCatLimit}
                  onChange={e => setNewCatLimit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition"
                >
                  Tambah Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
