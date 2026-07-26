import React, { useState } from 'react';
import {
  Scan,
  Upload,
  Camera,
  CheckCircle2,
  FileText,
  RefreshCw,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { OCRResult, Category, Transaction } from '../types/finance';
import { OCRService } from '../services/ocrService';
import confetti from 'canvas-confetti';

interface ReceiptScannerProps {
  categories: Category[];
  onSaveScannedTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({
  categories,
  onSaveScannedTransaction,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMsg, setScanStatusMsg] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<OCRResult | null>(null);

  // Editable Form Fields
  const [editMerchant, setEditMerchant] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setIsScanning(true);
    setScannedResult(null);

    const result = await OCRService.scanReceipt(file, categories, (progress, status) => {
      setScanProgress(progress);
      setScanStatusMsg(status);
    });

    setIsScanning(false);
    setScannedResult(result);

    setEditMerchant(result.merchant);
    setEditAmount(result.amount.toString());
    setEditDate(result.date);
    setEditCategory(result.suggestedCategoryId);
    setEditNotes('Diimpor via OCR Scan Struk');
  };

  const handleSampleReceipt = async (type: 'indomaret' | 'starbucks' | 'alfamart' | 'pln') => {
    setIsScanning(true);
    setScannedResult(null);
    setPreviewImage(null);

    const sampleName = `${type}_receipt_sample.jpg`;

    const result = await OCRService.scanReceipt(sampleName, categories, (progress, status) => {
      setScanProgress(progress);
      setScanStatusMsg(status);
    });

    setIsScanning(false);
    setScannedResult(result);

    setEditMerchant(result.merchant);
    setEditAmount(result.amount.toString());
    setEditDate(result.date);
    setEditCategory(result.suggestedCategoryId);
    setEditNotes(`Scan Struk ${result.merchant}`);
  };

  const handleSaveScanned = () => {
    if (!editMerchant || !editAmount) return;

    const catObj = categories.find(c => c.id === editCategory);
    const categoryName = catObj ? catObj.name : 'Belanja Bulanan';

    onSaveScannedTransaction({
      amount: parseFloat(editAmount),
      type: 'expense',
      categoryId: editCategory,
      categoryName,
      date: editDate,
      merchant: editMerchant,
      notes: editNotes,
      source: 'ocr',
      aiConfidence: scannedResult?.confidence || 0.9,
      isAiCategorized: true,
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setScannedResult(null);
    setPreviewImage(null);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-2">
          <Scan className="w-3.5 h-3.5" />
          <span>OCR Struk 100% Lokal • Tanpa Kirim Data ke Cloud</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">OCR Scan Struk Belanja</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Foto struk atau upload file untuk mengekstrak nominal, tanggal, merchant, dan kategori secara otomatis.
        </p>
      </div>

      {/* Upload Box */}
      {!scannedResult && (
        <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden shadow-sm dark:shadow-xl">
          
          <input
            type="file"
            accept="image/*"
            id="receipt-file-input"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />

          {!isScanning ? (
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Scan className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload atau Ambil Foto Struk</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                  Mendukung struk Indomaret, Alfamart, Starbucks, GoFood, PLN, Pertamina, & toko lokal.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <label
                  htmlFor="receipt-file-input"
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-sm cursor-pointer transition active:scale-95 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Pilih Foto dari Galeri</span>
                </label>

                <label
                  htmlFor="receipt-file-input"
                  className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-300 dark:border-slate-700 cursor-pointer transition active:scale-95 flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Kamera HP</span>
                </label>
              </div>

              {/* Sample Shortcuts for Testing */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">Uji Coba Cepat (Sample Struk Indonesia):</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleSampleReceipt('indomaret')}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs transition flex items-center space-x-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Indomaret Point (Rp 148.500)</span>
                  </button>
                  <button
                    onClick={() => handleSampleReceipt('starbucks')}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs transition flex items-center space-x-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Kopi Kenangan (Rp 58.000)</span>
                  </button>
                  <button
                    onClick={() => handleSampleReceipt('alfamart')}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs transition flex items-center space-x-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span>Alfamart (Rp 89.000)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{scanStatusMsg || 'Memproses OCR...'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sistem sedang menganalisis teks & nominal struk</p>
              </div>

              <div className="w-full max-w-xs mx-auto bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{scanProgress}%</span>
            </div>
          )}

        </div>
      )}

      {/* Scanned Result Review */}
      {scannedResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Hasil Pembacaan Teks Struk</span>
            </h3>

            {previewImage ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-64 flex items-center justify-center bg-slate-900">
                <img src={previewImage} alt="Struk Preview" className="object-contain max-h-64 w-full" />
              </div>
            ) : (
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {scannedResult.rawText}
              </div>
            )}

            <button
              onClick={() => setScannedResult(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              Scan Struk Lain
            </button>
          </div>

          <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Koreksi & Konfirmasi Transaksi</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Periksa hasil ekstraksi OCR di bawah ini sebelum disimpan.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nama Merchant / Toko</label>
                <input
                  type="text"
                  value={editMerchant}
                  onChange={e => setEditMerchant(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Nominal Bayar (Rp)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-extrabold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Kategori Transaksi
                </label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {categories
                    .filter(c => c.type === 'expense')
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Tanggal Struk</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Catatan Struk</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setScannedResult(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={handleSaveScanned}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-400 transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Transaksi Keuangan</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
