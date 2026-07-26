import React from 'react';
import {
  Wallet,
  Scan,
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Settings,
  Lock,
  Landmark,
  Sun,
  Moon,
  Eye,
  EyeOff
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLockApp: () => void;
  onOpenSettings: () => void;
  totalBalance: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isPrivacyHide: boolean;
  onTogglePrivacyHide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onLockApp,
  onOpenSettings,
  totalBalance,
  theme,
  onToggleTheme,
  isPrivacyHide,
  onTogglePrivacyHide,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transaksi', icon: Receipt },
    { id: 'ocr', label: 'OCR Struk', icon: Scan },
    { id: 'budget', label: 'Anggaran', icon: Target },
    { id: 'banks', label: 'Bank & Wallet', icon: Landmark },
    { id: 'reports', label: 'Laporan', icon: PieChart },
  ];

  return (
    <header className="sticky top-0 z-20 w-full glass-panel border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-500/10 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">KantongKu</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Lokal</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">100% Gratis & Privasi Lokal</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden sm:flex flex-col items-end pr-2 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Saldo</span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              {isPrivacyHide ? 'Rp ••••••••' : `Rp ${totalBalance.toLocaleString('id-ID')}`}
            </span>
          </div>

          {/* Privacy Eye Hide/Show Button */}
          <button
            onClick={onTogglePrivacyHide}
            className={`p-2 rounded-xl border transition ${
              isPrivacyHide
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            title={isPrivacyHide ? 'Tampilkan Nominal' : 'Sembunyikan Nominal (Mode Privasi)'}
          >
            {isPrivacyHide ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
          </button>

          {/* Quick Lock Button */}
          <button
            onClick={onLockApp}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            title="Kunci Aplikasi"
          >
            <Lock className="w-4.5 h-4.5" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Pengaturan & Data"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
