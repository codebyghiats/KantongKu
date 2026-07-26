import React from 'react';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Info,
  CheckCircle2,
  AlertCircle,
  PiggyBank,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Transaction, Category } from '../types/finance';

interface VisualReportsProps {
  transactions: Transaction[];
  categories: Category[];
}

export const VisualReports: React.FC<VisualReportsProps> = ({ transactions, categories }) => {
  // Current month filtering
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTxs = transactions.filter(t => t.date.startsWith(currentMonth));

  const totalIncome = monthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = monthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netCashFlow = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netCashFlow / totalIncome) * 100) : 0;

  // 1. Category Expense Distribution
  const categoryMap: Record<string, { name: string; value: number; color: string }> = {};

  monthTxs
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const catObj = categories.find(c => c.id === t.categoryId);
      const color = catObj ? catObj.color : '#10b981';
      if (!categoryMap[t.categoryName]) {
        categoryMap[t.categoryName] = { name: t.categoryName, value: 0, color };
      }
      categoryMap[t.categoryName].value += t.amount;
    });

  const categoryData = Object.values(categoryMap).sort((a, b) => b.value - a.value);

  // Highest spending category
  const topCategory = categoryData[0];
  const topCatPercentage = totalExpense > 0 && topCategory ? Math.round((topCategory.value / totalExpense) * 100) : 0;

  // Colors palette for pie chart
  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  // 2. Dynamic Real-Time Monthly Trend Data (starts from user's actual first transaction month)
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthlyGroupMap: Record<string, { monthKey: string; label: string; Pemasukan: number; Pengeluaran: number }> = {};

  transactions.forEach(t => {
    if (!t.date) return;
    const yearMonth = t.date.slice(0, 7); // e.g. "2026-07"
    const [year, monthStr] = yearMonth.split('-');
    const monthIdx = Math.max(0, Math.min(11, parseInt(monthStr, 10) - 1));
    const label = `${MONTH_NAMES[monthIdx]} ${year.slice(2)}`;

    if (!monthlyGroupMap[yearMonth]) {
      monthlyGroupMap[yearMonth] = { monthKey: yearMonth, label, Pemasukan: 0, Pengeluaran: 0 };
    }

    if (t.type === 'income') {
      monthlyGroupMap[yearMonth].Pemasukan += t.amount;
    } else {
      monthlyGroupMap[yearMonth].Pengeluaran += t.amount;
    }
  });

  const sortedMonthKeys = Object.keys(monthlyGroupMap).sort();
  const monthlyData = sortedMonthKeys.map(key => ({
    month: monthlyGroupMap[key].label,
    Pemasukan: monthlyGroupMap[key].Pemasukan,
    Pengeluaran: monthlyGroupMap[key].Pengeluaran,
  }));

  // Fallback if no transactions exist yet
  if (monthlyData.length === 0) {
    const now = new Date();
    const currLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear().toString().slice(2)}`;
    monthlyData.push({
      month: currLabel,
      Pemasukan: 0,
      Pengeluaran: 0,
    });
  }

  // 3. Top Merchants Breakdown
  const merchantMap: Record<string, { count: number; total: number }> = {};
  monthTxs
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!merchantMap[t.merchant]) {
        merchantMap[t.merchant] = { count: 0, total: 0 };
      }
      merchantMap[t.merchant].count += 1;
      merchantMap[t.merchant].total += t.amount;
    });

  const topMerchants = Object.entries(merchantMap)
    .map(([merchant, data]) => ({ merchant, count: data.count, amount: data.total }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Micro-transaction insights (Indomaret, GoFood, Coffee)
  const microTxs = monthTxs.filter(t => 
    /indomaret|alfamart|gofood|grabfood|kopi|starbucks/i.test(t.merchant)
  );
  const microTotal = microTxs.reduce((acc, t) => acc + t.amount, 0);

  const formatYAxisTick = (val: number) => {
    if (val === 0) return '0';
    if (val >= 1000000000) {
      const b = val / 1000000000;
      return `${Number.isInteger(b) ? b : b.toFixed(1)}Mlyr`;
    }
    if (val >= 1000000) {
      const m = val / 1000000;
      return `${Number.isInteger(m) ? m : m.toFixed(1)}Jt`;
    }
    if (val >= 1000) {
      const k = val / 1000;
      return `${Number.isInteger(k) ? k : k.toFixed(0)}rb`;
    }
    return `${val}`;
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
          <PieChartIcon className="w-3.5 h-3.5" />
          <span>Laporan & Analisis Finansial Lanjutan</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Laporan Visual & Penjelasan Insight
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Grafik interaktif beserta narasi analisis keuangan, alokasi anggaran, dan potensi penghematan.
        </p>
      </div>

      {/* Financial Health Summary Cards with Narrative Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Cash Flow Health Status */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Kesehatan Arus Kas</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>{savingsRate >= 30 ? 'Sangat Sehat' : savingsRate >= 10 ? 'Cukup Stabil' : 'Perlu Penyesuaian'}</span>
              <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">({savingsRate}% disimpan)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {netCashFlow >= 0
                ? `Net cash flow Anda bernilai positif sebesar Rp ${netCashFlow.toLocaleString('id-ID')}. Anda berhasil menyisihkan ${savingsRate}% dari total pemasukan.`
                : `Pengeluaran Anda melebihi pemasukan bulan ini sebesar Rp ${Math.abs(netCashFlow).toLocaleString('id-ID')}. Disarankan mengevaluasi anggaran non-primer.`}
            </p>
          </div>
        </div>

        {/* Top Category Spending Narrative */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Kategori Terboros</span>
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {topCategory ? topCategory.name : 'Belum Ada Data'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {topCategory
                ? `Pengeluaran di kategori ${topCategory.name} menyedot Rp ${topCategory.value.toLocaleString('id-ID')} (${topCatPercentage}% dari total pengeluaran).`
                : 'Belum ada catatan pengeluaran bulan ini.'}
            </p>
          </div>
        </div>

        {/* Actionable Micro-Spending Insight */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Rekomendasi Hemat</span>
            <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {microTxs.length > 0 ? `${microTxs.length} Transaksi Jajan & Minimarket` : 'Pengeluaran Terkendali'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {microTxs.length > 0
                ? `Total belanja minimarket & pesan makanan mencapai Rp ${microTotal.toLocaleString('id-ID')}. Membatasi jajanan harian dapat menghemat hingga Rp ${Math.round(microTotal * 0.4).toLocaleString('id-ID')}/bulan.`
                : 'Pola pengeluaran harian Anda terlihat stabil dan terencana dengan baik.'}
            </p>
          </div>
        </div>

      </div>

      {/* Visual Charts Row 1: Bar Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income vs Expense Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Perbandingan Pemasukan vs Pengeluaran</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tren perbandingan dana masuk dan pengeluaran per bulan.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatYAxisTick} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#ffffff' }}
                  itemStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']}
                />
                <Bar dataKey="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Penjelasan:</strong> Batang hijau menunjukkan total pemasukan, sedangkan batang merah menunjukkan pengeluaran. Usahakan tinggi batang hijau selalu melampaui batang merah.
            </span>
          </div>
        </div>

        {/* Category Expense Distribution Donut Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Alokasi Pengeluaran per Kategori</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Persentase pembagian dana ke setiap kategori kebutuhan.
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <div className="text-xs text-slate-400">Belum ada data pengeluaran.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#ffffff' }}
                    itemStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Nominal']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Interactive Legend List with Percentages */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 max-h-36 overflow-y-auto">
            {categoryData.map((cat, idx) => {
              const pct = totalExpense > 0 ? Math.round((cat.value / totalExpense) * 100) : 0;
              return (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                    <span>{pct}%</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      (Rp {cat.value.toLocaleString('id-ID')})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 2: Top Merchants Leaderboard */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Top Merchant Pengeluaran Terbesar</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Toko, vendor, atau penyedia layanan dengan akumulasi transaksi tertinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topMerchants.map((m, idx) => (
            <div
              key={m.merchant}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-extrabold text-xs text-emerald-600 dark:text-emerald-400 border border-slate-300 dark:border-slate-700">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.merchant}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{m.count} kali transaksi</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                Rp {m.amount.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
