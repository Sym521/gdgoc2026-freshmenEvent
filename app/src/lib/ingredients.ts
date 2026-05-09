import type { IngredientType } from '@/types/task';

/** 具材の表示情報 */
export interface IngredientData {
  type: IngredientType;
  label: string;
  emoji: string;
  color: string;
  height: number;
}

/** 具材マスターデータ */
export const INGREDIENTS: Record<IngredientType, IngredientData> = {
  lettuce: {
    type: 'lettuce',
    label: 'レタス',
    emoji: '🥬',
    color: '#7CB342',
    height: 18,
  },
  tomato: {
    type: 'tomato',
    label: 'トマト',
    emoji: '🍅',
    color: '#E53935',
    height: 14,
  },
  cheese: {
    type: 'cheese',
    label: 'チーズ',
    emoji: '🧀',
    color: '#FFB300',
    height: 10,
  },
  patty: {
    type: 'patty',
    label: 'パティ',
    emoji: '🥩',
    color: '#6D4C41',
    height: 24,
  },
  onion: {
    type: 'onion',
    label: 'オニオン',
    emoji: '🧅',
    color: '#E8D5F5',
    height: 12,
  },
  bacon: {
    type: 'bacon',
    label: 'ベーコン',
    emoji: '🥓',
    color: '#C62828',
    height: 10,
  },
};

/** 具材タイプの一覧 */
export const INGREDIENT_TYPES: IngredientType[] = Object.keys(INGREDIENTS) as IngredientType[];
