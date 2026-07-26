import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  Upload,
  Trash2,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileJson,
  RotateCcw
} from 'lucide-react';
import { SecuritySettings } from '../types/finance';
import { StorageService } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  security: SecuritySettings;
  onUpdateSecurity: (newSettings: SecuritySettings) => void;
  onReloadData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  security,
  onUpdateSecurity,
  onReloadData,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleTogglePin = () => {
    if (!security.isPinEnabled) {
      if (!pinInput || pinInput.length !== 4) {
        setMsg('Masukkan PIN 4 angka terlebih dahulu');
        return;
      }
      onUpdateSecurity({
        ...security,
        isPinEnabled: true,
        pinHash: pinInput,
      });
      setMsg('PIN Security Berhasil Diaktifkan!');
      setPinInput('');
    } else {
      onUpdateSecurity({
        ...security,
        isPinEnabled: false,
        pinHash: undefined,
      });
      setMsg('PIN Security Dinonaktifkan.');
    }
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kantongku_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvStr = StorageService.exportCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kantongku_transaksi_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importJSON(content);
        if (success) {
          setMsg('Data berhasil diimpor!');
          onReloadData();
        } else {
          setMsg('Gagal mengimpor file backup.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSeedSampleData = () => {
    const sample = StorageService.generateSampleTransactions();
    StorageService.saveTransactions(sample);
    onReloadData();
    setMsg('Data sampel simulasi berhasil dimuat!');
  };

  const handleWipeData = () => {
    StorageService.wipeAllData();
    onReloadData();
    setShowWipeConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/25 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan & Keamanan Data</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enkripsi WebCrypto AES-256 lokal & ekspor data</p>
          </div>
        </div>

        {msg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        <div className="space-y-6">
          
          {/* Section 1: Security & PIN */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Autentikasi PIN Lock Screen</span>
            </h3>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Status Lock Screen</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {security.isPinEnabled ? 'PIN Aktif (Meminta PIN saat aplikasi dibuka)' : 'Tidak Aktif'}
                </p>
              </div>

              <button
                onClick={handleTogglePin}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  security.isPinEnabled
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400 font-bold'
                }`}
              >
                {security.isPinEnabled ? 'Nonaktifkan' : 'Aktifkan PIN'}
              </button>
            </div>

            {!security.isPinEnabled && (
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Set 4-Digit PIN (cth: 1234)"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono tracking-widest"
                />
              </div>
            )}
          </div>

          {/* Section 2: Data Export & Import */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-500" />
              <span>Ekspor & Impor Data (Privasi Lokal)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportCSV}
                className="p-3 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center space-x-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Ekspor CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="p-3 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center space-x-2"
              >
                <FileJson className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Ekspor JSON</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <label
                htmlFor="import-json-file"
                className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center space-x-2"
              >
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Impor Backup JSON</span>
              </label>
              <input
                type="file"
                id="import-json-file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSONFile}
              />

              <button
                onClick={handleSeedSampleData}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5"
                title="Muat Ulang Sampel Transaksi"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Reset Data Sampel</span>
              </button>
            </div>
          </div>

          {/* Section 3: Danger Zone - Permanent Delete */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
            <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Hapus Permanen Seluruh Data (Wipe Data)</span>
            </h3>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Menghapus seluruh transaksi, kategori custom, dan histori lokal dari penyimpanan browser HP Anda tanpa sisa.
            </p>

            {!showWipeConfirm ? (
              <button
                onClick={() => setShowWipeConfirm(true)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold transition"
              >
                Hapus Seluruh Data Permanen
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 space-y-3">
                <div className="text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan!</span>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowWipeConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleWipeData}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    Ya, Hapus Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
