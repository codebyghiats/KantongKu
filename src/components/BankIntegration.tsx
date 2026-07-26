import React, { useState } from 'react';
import {
  Landmark,
  Smartphone,
  Building2,
  Wallet,
  CreditCard,
  RefreshCw,
  Power,
  ShieldCheck,
  Zap,
  AlertCircle,
  Edit3,
  Plus,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { BankAccount } from '../types/finance';

interface BankIntegrationProps {
  banks: BankAccount[];
  onToggleBank: (id: string) => void;
  onTriggerSync: () => void;
  onUpdateBankAccount: (bank: BankAccount) => void;
  onAddBankAccount: (bank: BankAccount) => void;
  isPrivacyHide: boolean;
}

export const BankIntegration: React.FC<BankIntegrationProps> = ({
  banks,
  onToggleBank,
  onTriggerSync,
  onUpdateBankAccount,
  onAddBankAccount,
  isPrivacyHide,
}) => {
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editProvider, setEditProvider] = useState('');
  const [editAccountName, setEditAccountName] = useState('');
  const [editAccountNumber, setEditAccountNumber] = useState('');
  const [editBalance, setEditBalance] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState('BCA');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const [localHiddenAccounts, setLocalHiddenAccounts] = useState<Record<string, boolean>>({});

  const toggleAccountMask = (id: string) => {
    setLocalHiddenAccounts(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isMasked = (id: string) => {
    if (localHiddenAccounts[id] !== undefined) {
      return localHiddenAccounts[id];
    }
    return isPrivacyHide;
  };

  const getProviderIcon = (provider: string) => {
    const p = provider.toUpperCase();
    if (p.includes('BCA') || p.includes('BRI') || p.includes('MANDIRI') || p.includes('BNI') || p.includes('SEABANK') || p.includes('JAGO')) {
      return <Building2 className="w-6 h-6 text-blue-500" />;
    } else if (p.includes('GOPAY')) {
      return <Smartphone className="w-6 h-6 text-emerald-500" />;
    } else if (p.includes('DANA')) {
      return <Wallet className="w-6 h-6 text-sky-500" />;
    } else if (p.includes('OVO') || p.includes('SHOPEE')) {
      return <CreditCard className="w-6 h-6 text-purple-500" />;
    } else {
      return <Landmark className="w-6 h-6 text-slate-400" />;
    }
  };

  const openEditModal = (bank: BankAccount) => {
    setEditingBank(bank);
    setEditProvider(bank.provider);
    setEditAccountName(bank.accountName);
    setEditAccountNumber(bank.accountNumber);
    setEditBalance(bank.balance.toString());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBank) {
      onUpdateBankAccount({
        ...editingBank,
        provider: editProvider,
        accountName: editAccountName,
        accountNumber: editAccountNumber,
        balance: parseFloat(editBalance) || 0,
      });
      setEditingBank(null);
    }
  };

  const handleSaveNewBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvider || !newAccountName || !newAccountNumber) return;

    onAddBankAccount({
      id: 'bank-custom-' + Date.now(),
      provider: newProvider,
      accountName: newAccountName,
      accountNumber: newAccountNumber,
      balance: parseFloat(newBalance) || 0,
      isConnected: true,
      lastSynced: new Date().toISOString(),
      autoSync: true,
      icon: 'Building2',
    });

    setNewProvider('BCA');
    setNewAccountName('');
    setNewAccountNumber('');
    setNewBalance('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Integrasi Bank & E-Wallet Lokal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Koneksi Akun Finansial</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola nomor rekening & e-wallet Anda. Data 100% tersimpan aman lokal di perangkat Anda.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Logic Explanation Banner */}
      <div className="glass-panel rounded-3xl p-5 border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold">
          <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Penjelasan Sistem Pembacaan Akun:</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          - <strong>Pengisian Nomor Rekening</strong>: Nomor rekening & e-wallet di bawah ini diisi langsung oleh Anda agar tidak ada akses rahasia ke SIM Card/Sistem HP.<br />
          - <strong>Pembacaan Otomatis Transaksi</strong>: Engine lokal KantongKu mendeteksi notifikasi transaksi (m-BCA, BRImo, GoPay, DANA) yang masuk di layar HP Anda, mencocokkan kata kunci provider/nomor, dan mencatat transaksi secara otomatis!
        </p>
      </div>

      {/* Sync Action Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Simulasi Auto-Sync Transaksi</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
            Sistem mensimulasikan parsing notifikasi & feed e-statement bank/e-wallet terhubung secara lokal di perangkat Anda.
          </p>
        </div>

        <button
          onClick={onTriggerSync}
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tarik Transaksi Baru</span>
        </button>
      </div>

      {/* Grid of Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banks.map(b => (
          <div
            key={b.id}
            className={`glass-card rounded-3xl p-6 border transition-all ${
              b.isConnected
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-200 dark:border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner">
                  {getProviderIcon(b.provider)}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{b.provider}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        b.isConnected
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {b.isConnected ? 'Terhubung' : 'Terputus'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.accountName}</p>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <p className="text-[11px] font-mono text-slate-400">
                      {isMasked(b.id) ? '••••••••' + b.accountNumber.slice(-4) : b.accountNumber}
                    </p>
                    <button
                      onClick={() => toggleAccountMask(b.id)}
                      className="text-slate-400 hover:text-emerald-500 transition p-0.5"
                      title={isMasked(b.id) ? 'Tampilkan Nomor Rekening' : 'Sembunyikan Nomor Rekening'}
                    >
                      {isMasked(b.id) ? <EyeOff className="w-3 h-3 text-emerald-500" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Edit Detail Rekening & Saldo"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleBank(b.id)}
                  className={`p-2 rounded-xl border transition ${
                    b.isConnected
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                  title={b.isConnected ? 'Putuskan Koneksi' : 'Hubungkan Akun'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>

            {b.isConnected && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Saldo Terhubung</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {isMasked(b.id) ? 'Rp ••••••••' : `Rp ${b.balance.toLocaleString('id-ID')}`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Terakhir Disinkron</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b.lastSynced !== '-' ? new Date(b.lastSynced).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Bank Account Details Modal */}
      {editingBank && (
        <div className="fixed inset-0 z-50 bg-slate-900/25 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setEditingBank(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Edit Detail Akun: {editingBank.provider}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Penyedia / Bank</label>
                <input
                  type="text"
                  value={editProvider}
                  onChange={e => setEditProvider(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nama Pemilik Akun / Alias</label>
                <input
                  type="text"
                  value={editAccountName}
                  onChange={e => setEditAccountName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nomor Rekening / No HP E-Wallet</label>
                <input
                  type="text"
                  value={editAccountNumber}
                  onChange={e => setEditAccountNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Saldo Riil / Saldo Awal (Rp)</label>
                <input
                  type="number"
                  value={editBalance}
                  onChange={e => setEditBalance(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBank(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Bank Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/25 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Tambah Akun Bank / E-Wallet Baru
            </h3>

            <form onSubmit={handleSaveNewBank} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nama Penyedia / Bank</label>
                <input
                  type="text"
                  placeholder="Contoh: BCA, Mandiri, SeaBank, ShopeePay"
                  value={newProvider}
                  onChange={e => setNewProvider(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nama Pemilik Akun</label>
                <input
                  type="text"
                  placeholder="Contoh: BCA Tabungan Utama"
                  value={newAccountName}
                  onChange={e => setNewAccountName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nomor Rekening / No HP</label>
                <input
                  type="text"
                  placeholder="Contoh: 8830192841"
                  value={newAccountNumber}
                  onChange={e => setNewAccountNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Saldo Awal (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 5000000"
                  value={newBalance}
                  onChange={e => setNewBalance(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
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
                  Tambah Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Regulatory & Security Info Notice */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400">
        <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 dark:text-white">Privasi Finansial & Kepatuhan Regulasi: </span>
          Aplikasi tidak pernah meminta kata sandi bank atau PIN transaksi Anda. Seluruh proses pembacaan feed berjalan lokal di HP Anda.
        </div>
      </div>

    </div>
  );
};
