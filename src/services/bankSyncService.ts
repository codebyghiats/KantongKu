import { BankAccount, Transaction, Category } from '../types/finance';
import { StorageService } from './storage';
import { AICategorizerService } from './aiCategorizer';

export interface BankSyncResult {
  addedCount: number;
  newTransactions: Transaction[];
  totalSyncedAmount: number;
}

export class BankSyncService {
  /**
   * Toggle connection status for a bank or e-wallet account
   */
  static toggleAccountConnection(providerId: string): BankAccount[] {
    const banks = StorageService.getBanks();
    const bank = banks.find(b => b.id === providerId);
    if (bank) {
      bank.isConnected = !bank.isConnected;
      bank.lastSynced = bank.isConnected ? new Date().toISOString() : '-';
      StorageService.saveBanks(banks);
    }
    return banks;
  }

  /**
   * Trigger simulated sync for connected banks & e-wallets
   */
  static syncConnectedAccounts(availableCategories: Category[]): BankSyncResult {
    const banks = StorageService.getBanks().filter(b => b.isConnected);
    if (banks.length === 0) {
      return { addedCount: 0, newTransactions: [], totalSyncedAmount: 0 };
    }

    const mockFeeds = this.generateMockFeeds(banks);
    const addedTransactions: Transaction[] = [];
    let totalAmount = 0;

    for (const feed of mockFeeds) {
      // Predict category via On-Device AI
      const aiPred = AICategorizerService.predictCategory(feed.merchant, feed.notes, availableCategories);

      const tx = StorageService.addTransaction({
        amount: feed.amount,
        type: feed.type,
        categoryId: aiPred.categoryId,
        categoryName: aiPred.categoryName,
        date: feed.date,
        merchant: feed.merchant,
        notes: feed.notes,
        source: 'bank_sync',
        bankProvider: feed.provider,
        aiConfidence: aiPred.confidence,
        isAiCategorized: true,
      });

      addedTransactions.push(tx);
      totalAmount += feed.amount;
    }

    // Update last synced timestamps for connected accounts
    const allBanks = StorageService.getBanks();
    allBanks.forEach(b => {
      if (b.isConnected) {
        b.lastSynced = new Date().toISOString();
      }
    });
    StorageService.saveBanks(allBanks);

    return {
      addedCount: addedTransactions.length,
      newTransactions: addedTransactions,
      totalSyncedAmount: totalAmount,
    };
  }

  /**
   * Generates realistic Indonesian bank & e-wallet feed entries
   */
  private static generateMockFeeds(connectedBanks: BankAccount[]): Array<{
    provider: string;
    merchant: string;
    amount: number;
    type: 'expense' | 'income';
    notes: string;
    date: string;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const feeds: Array<{
      provider: string;
      merchant: string;
      amount: number;
      type: 'expense' | 'income';
      notes: string;
      date: string;
    }> = [];

    const availableProviders = connectedBanks.map(b => b.provider);

    if (availableProviders.includes('GoPay')) {
      feeds.push({
        provider: 'GoPay',
        merchant: 'QRIS - Toko Kopi Tuku',
        amount: 38000,
        type: 'expense',
        notes: 'Bayar QRIS via GoPay',
        date: today,
      });
    }

    if (availableProviders.includes('BCA')) {
      feeds.push({
        provider: 'BCA',
        merchant: 'TRSF m-BCA TO BUKALAPAK',
        amount: 175000,
        type: 'expense',
        notes: 'Transfer m-BCA Belanja Elektronik',
        date: today,
      });
    }

    if (availableProviders.includes('DANA')) {
      feeds.push({
        provider: 'DANA',
        merchant: 'Voucher Google Play Store',
        amount: 50000,
        type: 'expense',
        notes: 'Pembelian Game via DANA',
        date: today,
      });
    }

    if (availableProviders.includes('BRI')) {
      feeds.push({
        provider: 'BRI',
        merchant: 'TRANSFER MASUK BRImo',
        amount: 450000,
        type: 'income',
        notes: 'Pengembalian Dana / Transfer Masuk',
        date: today,
      });
    }

    return feeds;
  }
}
