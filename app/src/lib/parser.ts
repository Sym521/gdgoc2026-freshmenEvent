import { SubTask, IngredientType } from '@/types/task';

export function parseGeminiResponse(responseText: string): SubTask[] {
  try {
    // 応答テキストからJSON部分を抽出する（Markdownが含まれていた場合の対策）
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const jsonString = jsonMatch[0];
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      throw new Error('Parsed result is not an array');
    }

    const validIngredients: IngredientType[] = ['lettuce', 'tomato', 'cheese', 'patty', 'onion', 'bacon'];

    return parsed.map((item, index) => {
      // 具材の検証
      let ingredient: IngredientType = 'lettuce'; // デフォルト
      if (item.ingredient && validIngredients.includes(item.ingredient as IngredientType)) {
        ingredient = item.ingredient as IngredientType;
      }

      return {
        id: crypto.randomUUID(), // Node.js (v19+) / ブラウザ標準で利用可能
        name: item.name || `サブタスク ${index + 1}`,
        ingredient,
        completed: false,
      };
    });
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    // パース失敗時のフォールバック
    return [
      {
        id: crypto.randomUUID(),
        name: 'タスクの細分化に失敗しました。手動で確認してください。',
        ingredient: 'patty',
        completed: false,
      }
    ];
  }
}
