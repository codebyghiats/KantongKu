import React, { useState } from 'react';
import { Target, Edit2 } from 'lucide-react';
import { BudgetStatus, Category } from '../types/finance';

interface BudgetingProps {
  budgetStatuses: BudgetStatus[];
  categories: Category[];
  onUpdateBudget: (categoryId: string, limit: number) => void;
}

export const Budgeting: React.FC<BudgetingProps> = ({
  budgetStatuses,
  categories,
  onUpdateBudget,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [limitInput, setLimitInput] = useState('');

  const totalBudget = budgetStatuses.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgetStatuses.reduce((acc, b) => acc + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setLimitInput(cat.budgetLimit ? cat.budgetLimit.toString() : '');
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && limitInput) {
      onUpdateBudget(editingCategory.id, parseFloat(limitInput));
      setEditingCategory(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
          <Target className="w-3.5 h-3.5" />
          <span>Pengatur Anggaran & Alert Limits</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Manajemen Anggaran Bulanan</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tetapkan batas pengeluaran per kategori. Dapatkan peringatan otomatis saat mendekati atau melewati limit.
        </p>
      </div>

      {/* Overall Budget Overview Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Anggaran Gabungan</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Rp {totalSpent.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-semibold text-slate-400">
                / Rp {totalBudget.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Status Pengeluaran: {overallPercentage}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-200 dark:bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage >= 100
                  ? 'bg-rose-500'
                  : overallPercentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetStatuses.map(b => {
          const catObj = categories.find(c => c.id === b.categoryId);
          return (
            <div
              key={b.categoryId}
              className={`glass-card rounded-3xl p-6 border transition-all ${
                b.status === 'danger'
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : b.status === 'warning'
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">{b.categoryName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        b.status === 'danger'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : b.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {b.status === 'danger' ? 'Over Limit' : b.status === 'warning' ? 'Waspada' : 'Aman'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Terpakai: <span className="font-bold text-slate-900 dark:text-white">Rp {b.spent.toLocaleString('id-ID')}</span> / Limit Rp {b.limit.toLocaleString('id-ID')}
                  </div>
                </div>

                <button
                  onClick={() => catObj && openEditModal(catObj)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                  title="Edit Limit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Individual Bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  <span>Persentase</span>
                  <span>{b.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      b.status === 'danger'
                        ? 'bg-rose-500'
                        : b.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, b.percentage)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/25 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Set Limit Anggaran: {editingCategory.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Masukkan nominal batas bulanan untuk kategori ini.</p>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Batas Maksimal (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 1500000"
                  value={limitInput}
                  onChange={e => setLimitInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition"
                >
                  Simpan Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
