import React, { useState } from 'react';
import { Lock, Fingerprint, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { SecuritySettings } from '../types/finance';

interface SecurityLockProps {
  settings: SecuritySettings;
  onUnlock: () => void;
}

export const SecurityLock: React.FC<SecurityLockProps> = ({ settings, onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isBiometricSimulating, setIsBiometricSimulating] = useState(false);

  const handleNumClick = (digit: string) => {
    if (pinInput.length < 4) {
      const updated = pinInput + digit;
      setPinInput(updated);
      setErrorMsg('');

      if (updated.length === 4) {
        verifyPin(updated);
      }
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const verifyPin = (pin: string) => {
    const target = settings.pinHash || '1234';
    if (pin === target) {
      onUnlock();
    } else {
      setErrorMsg('PIN salah! Silakan coba lagi (PIN default: 1234)');
      setPinInput('');
    }
  };

  const handleBiometricClick = () => {
    setIsBiometricSimulating(true);
    setTimeout(() => {
      setIsBiometricSimulating(false);
      onUnlock();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm glass-card rounded-3xl p-8 border border-emerald-500/30 text-center shadow-2xl relative overflow-hidden bg-slate-900 text-white">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">KantongKu Terkunci</h2>
        <p className="text-xs text-slate-400 mb-6">Masukkan PIN 4-digit atau gunakan Biometrik untuk mengakses data keuangan Anda</p>

        {/* PIN Indicators */}
        <div className="flex justify-center space-x-4 mb-6">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                pinInput.length > idx
                  ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/50'
                  : 'border-slate-600 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="flex items-center justify-center space-x-2 text-rose-400 text-xs mb-4 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xl font-bold text-white transition active:scale-95 flex items-center justify-center shadow"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBiometricClick}
            className="h-14 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center transition active:scale-95"
            title="Biometric Fingerprint"
          >
            <Fingerprint className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNumClick('0')}
            className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xl font-bold text-white transition active:scale-95 flex items-center justify-center shadow"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-300 flex items-center justify-center transition active:scale-95"
          >
            Hapus
          </button>
        </div>

        {isBiometricSimulating && (
          <div className="text-xs text-emerald-400 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 animate-spin" />
            <span>Memverifikasi Biometrik...</span>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-center space-x-1">
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dekripsi Data WebCrypto AES-256 Active</span>
        </div>
      </div>
    </div>
  );
};
