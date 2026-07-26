import { Category, AILearningRule } from '../types/finance';
import { StorageService } from './storage';

// Built-in keyword mappings for Indonesian Merchants and Keywords
const DEFAULT_KEYWORD_RULES: Record<string, string> = {
  // Makanan & Minuman (cat-1)
  'gofood': 'cat-1',
  'grabfood': 'cat-1',
  'shopeefood': 'cat-1',
  'kopi': 'cat-1',
  'starbucks': 'cat-1',
  'mcdonalds': 'cat-1',
  'mcd': 'cat-1',
  'kfc': 'cat-1',
  'solaria': 'cat-1',
  'warung': 'cat-1',
  'resto': 'cat-1',
  'bakso': 'cat-1',
  'nasi': 'cat-1',
  'kafe': 'cat-1',
  'cafe': 'cat-1',
  'boba': 'cat-1',
  'dapur': 'cat-1',

  // Belanja Bulanan (cat-2)
  'indomaret': 'cat-2',
  'alfamart': 'cat-2',
  'superindo': 'cat-2',
  'hypermart': 'cat-2',
  'carrefour': 'cat-2',
  'tokopedia': 'cat-2',
  'shopee': 'cat-2',
  'blibli': 'cat-2',
  'sayurbox': 'cat-2',
  'pasar': 'cat-2',
  'minimarket': 'cat-2',

  // Transportasi (cat-3)
  'gojek': 'cat-3',
  'grab': 'cat-3',
  'pertamina': 'cat-3',
  'spbu': 'cat-3',
  'shell': 'cat-3',
  'bensin': 'cat-3',
  'parkir': 'cat-3',
  'toll': 'cat-3',
  'e-toll': 'cat-3',
  'krl': 'cat-3',
  'mrt': 'cat-3',
  'tj': 'cat-3',
  'transjakarta': 'cat-3',
  'tiket.com': 'cat-3',
  'kai': 'cat-3',

  // Tagihan & Utilitas (cat-4)
  'pln': 'cat-4',
  'pdam': 'cat-4',
  'indihome': 'cat-4',
  'biznet': 'cat-4',
  'pulsa': 'cat-4',
  'telkomsel': 'cat-4',
  'xl': 'cat-4',
  'tri': 'cat-4',
  'listrik': 'cat-4',
  'air': 'cat-4',
  'bpjs': 'cat-4',

  // Hiburan & Hobi (cat-5)
  'xxi': 'cat-5',
  'cgv': 'cat-5',
  'steam': 'cat-5',
  'netflix': 'cat-5',
  'spotify': 'cat-5',
  'youtube': 'cat-5',
  'game': 'cat-5',
  'cinema': 'cat-5',

  // Gaji & Income (cat-9)
  'gaji': 'cat-9',
  'payroll': 'cat-9',
  'salary': 'cat-9',
  'honor': 'cat-9',
};

export interface AICategorizationResult {
  categoryId: string;
  categoryName: string;
  confidence: number; // 0 to 1
  matchedKeyword?: string;
  isLearnedFromUser: boolean;
}

export class AICategorizerService {
  /**
   * Predict category for merchant and notes completely on-device
   */
  static predictCategory(
    merchant: string,
    notes: string = '',
    availableCategories: Category[]
  ): AICategorizationResult {
    const text = `${merchant} ${notes}`.toLowerCase().trim();
    if (!text) {
      const fallback = availableCategories.find(c => c.id === 'cat-8') || availableCategories[0];
      return {
        categoryId: fallback.id,
        categoryName: fallback.name,
        confidence: 0.3,
        isLearnedFromUser: false,
      };
    }

    // 1. Check user-learned rules first (highest priority)
    const userRules = StorageService.getAIRules();
    for (const rule of userRules) {
      if (text.includes(rule.merchantKeyword.toLowerCase())) {
        const cat = availableCategories.find(c => c.id === rule.assignedCategoryId);
        if (cat) {
          return {
            categoryId: cat.id,
            categoryName: cat.name,
            confidence: Math.min(0.99, 0.85 + rule.frequency * 0.05),
            matchedKeyword: rule.merchantKeyword,
            isLearnedFromUser: true,
          };
        }
      }
    }

    // 2. Check default built-in rules
    for (const [kw, catId] of Object.entries(DEFAULT_KEYWORD_RULES)) {
      if (text.includes(kw)) {
        const cat = availableCategories.find(c => c.id === catId);
        if (cat) {
          return {
            categoryId: cat.id,
            categoryName: cat.name,
            confidence: 0.90,
            matchedKeyword: kw,
            isLearnedFromUser: false,
          };
        }
      }
    }

    // 3. Fallback to frequency-based matching from past transaction history
    const transactions = StorageService.getTransactions();
    const words = text.split(/\s+/).filter(w => w.length > 2);

    const categoryScores: Record<string, number> = {};
    for (const tx of transactions) {
      const txText = `${tx.merchant} ${tx.notes || ''}`.toLowerCase();
      let matchScore = 0;

      for (const word of words) {
        if (txText.includes(word)) {
          matchScore += 1;
        }
      }

      if (matchScore > 0) {
        categoryScores[tx.categoryId] = (categoryScores[tx.categoryId] || 0) + matchScore;
      }
    }

    // Find highest score
    let bestCatId: string | null = null;
    let maxScore = 0;
    for (const [catId, score] of Object.entries(categoryScores)) {
      if (score > maxScore) {
        maxScore = score;
        bestCatId = catId;
      }
    }

    if (bestCatId) {
      const cat = availableCategories.find(c => c.id === bestCatId);
      if (cat) {
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          confidence: Math.min(0.85, 0.5 + maxScore * 0.1),
          isLearnedFromUser: false,
        };
      }
    }

    // Default fallback
    const defaultCat = availableCategories.find(c => c.id === 'cat-8') || availableCategories[0];
    return {
      categoryId: defaultCat.id,
      categoryName: defaultCat.name,
      confidence: 0.4,
      isLearnedFromUser: false,
    };
  }

  /**
   * Record user override / feedback to improve future predictions (FR-4.3)
   */
  static recordUserFeedback(merchant: string, assignedCategoryId: string): void {
    if (!merchant.trim()) return;

    // Use primary token or merchant name
    const keyword = merchant.trim().toLowerCase().split(/\s+/)[0];
    if (!keyword || keyword.length < 3) return;

    const rules = StorageService.getAIRules();
    const existing = rules.find(r => r.merchantKeyword === keyword);

    if (existing) {
      existing.assignedCategoryId = assignedCategoryId;
      existing.frequency += 1;
      existing.lastUpdated = new Date().toISOString();
    } else {
      rules.push({
        merchantKeyword: keyword,
        assignedCategoryId,
        frequency: 1,
        lastUpdated: new Date().toISOString(),
      });
    }

    StorageService.saveAIRules(rules);
  }
}
