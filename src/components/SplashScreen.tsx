import React, { useEffect, useState } from 'react';
import { Wallet, ShieldCheck, Lock } from 'lucide-react';

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFading(true);
          setTimeout(() => {
            onFinished();
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
        
        {/* Animated Brand Logo Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
              <Wallet className="w-10 h-10 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-emerald-950 font-bold shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-950" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center space-x-2">
            <span>KantongKu</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center space-x-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pencatatan Keuangan Terenkripsi AES-256</span>
          </p>
        </div>

        {/* Loading Progress Indicator Bar */}
        <div className="w-full space-y-2 pt-4">
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Memuat Data Lokal...</span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Footer Branding Notice */}
      <div className="absolute bottom-6 text-center">
        <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">
          100% Privasi Lokal • Offline-First • Tanpa Cloud
        </p>
      </div>
    </div>
  );
};
