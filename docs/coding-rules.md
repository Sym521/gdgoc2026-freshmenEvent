# コーディングルール — ハンバーガーUI・AIタスク細分化アプリ

> このドキュメントはチーム全員が従うべきコーディング規約です。
> PRレビュー時のチェックリストとしても使用してください。

---

## 1. プロジェクト構成

### ディレクトリ規約

```
src/
├── app/          # Next.js App Router（ページ & API Routes のみ）
├── components/   # React コンポーネント（機能ドメインごとにサブディレクトリ）
├── hooks/        # カスタムフック（use〇〇.ts）
├── lib/          # ユーティリティ・外部サービスクライアント・定数
└── types/        # 型定義（インターフェース・型エイリアス）
```

### ファイル命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | **PascalCase** `.tsx` | `TopBun.tsx`, `TaskCard.tsx` |
| フック | **camelCase** `use` プレフィックス `.ts` | `useSpeechRecognition.ts` |
| ユーティリティ / lib | **camelCase** `.ts` | `gemini.ts`, `parser.ts` |
| 型定義 | **camelCase** `.ts` | `task.ts` |
| CSS モジュール | **PascalCase** `.module.css` | `TopBun.module.css` |
| API Routes | `route.ts`（Next.js 規約に従う） | `api/tasks/decompose/route.ts` |

---

## 2. TypeScript ルール

### 基本方針

- **`strict: true`** を維持する（tsconfig.json で設定済み）
- **`any` 型は原則禁止**。やむを得ない場合は `// eslint-disable-next-line` + コメントで理由を明記
- **型定義は `src/types/` に集約**し、コンポーネント内でのインライン型定義は Props のみ許可

### 型の書き方

```typescript
// ✅ Good: interface で Props を定義
interface TaskCardProps {
  task: SubTask;
  onComplete: (taskId: string) => void;
}

// ✅ Good: 共通型は types/ からインポート
import type { SubTask, IngredientType } from '@/types/task';

// ❌ Bad: コンポーネント内で共通型を再定義
type SubTask = { id: string; name: string; /* ... */ };
```

### import 順序

```typescript
// 1. React / Next.js
import { useState, useCallback } from 'react';
import Image from 'next/image';

// 2. 外部ライブラリ
import { motion, AnimatePresence } from 'framer-motion';

// 3. 内部モジュール（@ エイリアス使用）
import { SubTask } from '@/types/task';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

// 4. 同階層・相対パス
import styles from './TaskCard.module.css';
```

---

## 3. React コンポーネントルール

### 基本構造

```typescript
'use client'; // クライアントコンポーネントの場合のみ記載

import { useState } from 'react';
import type { SubTask } from '@/types/task';
import styles from './TaskCard.module.css';

// ---- Props 定義 ----
interface TaskCardProps {
  task: SubTask;
  onComplete: (taskId: string) => void;
}

// ---- コンポーネント本体（名前付きエクスポート） ----
export function TaskCard({ task, onComplete }: TaskCardProps) {
  // state
  const [isAnimating, setIsAnimating] = useState(false);

  // handlers
  const handleClick = () => {
    setIsAnimating(true);
    onComplete(task.id);
  };

  // render
  return (
    <div className={styles.card} onClick={handleClick}>
      {/* ... */}
    </div>
  );
}
```

### 重要なルール

| ルール | 詳細 |
|--------|------|
| エクスポート方式 | **名前付きエクスポート** (`export function`) を使用。`export default` は `page.tsx`, `layout.tsx` のみ |
| `'use client'` ディレクティブ | useState, useEffect, イベントハンドラを使うコンポーネントに **必ず** 記載 |
| Props の受け渡し | 分割代入で受け取る。5 個以上の Props がある場合はオブジェクトにまとめることを検討 |
| コンポーネントサイズ | 1 ファイル **150 行以下** を目安。超える場合はサブコンポーネントに分割 |

---

## 4. スタイリングルール

### 方針: CSS Modules + CSS カスタムプロパティ

- **CSS Modules** (`.module.css`) をコンポーネントごとに使用
- **グローバル変数** は `globals.css` の `:root` で定義（デザイントークン）
- **Tailwind CSS はプロトタイピング時のみ許可**。本番コードでは CSS Modules を優先

### デザイントークン（`globals.css`）

```css
:root {
  /* カラーパレット */
  --color-primary: #FF6B35;       /* オレンジ（ハンバーガーテーマ） */
  --color-secondary: #FFD700;     /* ゴールド */
  --color-bg: #FFF8F0;            /* ウォームホワイト */
  --color-bg-dark: #2D1B0E;       /* ダークブラウン */
  --color-text: #3D2B1F;          /* テキスト */
  --color-text-light: #8B7355;    /* サブテキスト */
  --color-success: #4CAF50;       /* 完了 */
  --color-error: #E53935;         /* エラー */

  /* スペーシング */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* フォント */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* ボーダー */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* シャドウ */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);

  /* アニメーション */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

### CSS の書き方

```css
/* ✅ Good: CSS 変数を使用 */
.card {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-fast) var(--ease-smooth);
}

/* ❌ Bad: マジックナンバー */
.card {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

---

## 5. アニメーションルール

### Framer Motion 使用ガイドライン

```typescript
// ✅ Good: variants を使ってアニメーションを定義
const ingredientVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.5 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.4 } },
  exit: { opacity: 0, scale: 0, transition: { duration: 0.2 } },
};

<motion.div variants={ingredientVariants} initial="hidden" animate="visible" exit="exit">
  {/* 具材コンテンツ */}
</motion.div>

// ❌ Bad: インラインで直接指定（再利用不可）
<motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -50 }}>
```

| ルール | 詳細 |
|--------|------|
| パフォーマンス | `transform` と `opacity` のみアニメーションする（レイアウトシフト禁止） |
| FPS 目標 | **60fps を維持**。Chrome DevTools の Performance タブで検証 |
| `AnimatePresence` | 要素の出入りには必ず `AnimatePresence` + `exit` を使用 |
| `layoutId` | ハンバーガースタックへの移動アニメーションには `layoutId` を活用 |

---

## 6. API ルート / バックエンドルール

### API Route の構造

```typescript
// src/app/api/tasks/decompose/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. リクエストバリデーション
    const body = await request.json();
    if (!body.taskName || typeof body.taskName !== 'string') {
      return NextResponse.json(
        { error: 'taskName is required and must be a string' },
        { status: 400 }
      );
    }

    // 2. ビジネスロジック
    const result = await decomposeTask(body.taskName);

    // 3. レスポンス
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // 4. エラーハンドリング（内部エラーの詳細はクライアントに露出させない）
    console.error('Task decomposition failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### セキュリティ

| ルール | 詳細 |
|--------|------|
| API キー | **環境変数**（`GEMINI_API_KEY`）で管理。`NEXT_PUBLIC_` プレフィックス **禁止** |
| バリデーション | 全ての API Route でリクエストボディをバリデーション |
| エラーメッセージ | 内部エラーの詳細（スタックトレース等）をクライアントに返さない |

---

## 7. Git ルール

### ブランチ戦略

```
main                    # 本番ブランチ（直接 push 禁止）
├── feature/foundation  # Phase 0: 基盤
├── feature/hamburger-ui # Stream A: ハンバーガー UI
├── feature/api-gemini  # Stream B: API / AI 連携
├── feature/voice-input # Stream C: 音声入力
├── feature/integration # Phase 2: 結合
└── feature/polish      # Phase 3: 仕上げ
```

### コミットメッセージ

**フォーマット**: `<type>(<scope>): <description>`

| type | 用途 |
|------|------|
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `style` | スタイル変更（ロジック変更なし） |
| `refactor` | リファクタリング |
| `docs` | ドキュメント |
| `chore` | ビルド・設定変更 |

```bash
# 例
feat(hamburger): 下バンズコンポーネントを追加
feat(api): POST /api/tasks/decompose エンドポイントを実装
fix(voice): Chrome での音声認識エラーハンドリングを修正
style(task): タスクカードの hover アニメーションを調整
```

### PR ルール

- **1 PR = 1 タスク番号**（milestones.md のタスク番号を PR タイトルに含める）
- セルフレビュー後に PR 作成
- マージ先は対応する feature ブランチ（最終的に `main` へ）

---

## 8. コード品質

### 禁止事項

| 禁止 | 理由 |
|------|------|
| `console.log` を本番コードに残す | `console.error` のみ許可（エラーハンドリング用） |
| `// TODO` を放置 | Issue に起票するか、その場で解決 |
| マジックナンバー / マジックストリング | 定数 or CSS 変数に切り出す |
| `!important` の使用 | CSS 設計の問題。セレクタの詳細度で解決 |

### 推奨事項

| 推奨 | 詳細 |
|------|------|
| Early return | ネストを減らすために条件分岐は早期リターン |
| 関数の単一責任 | 1 関数 = 1 責任。30 行を超えたら分割を検討 |
| 意味のある変数名 | `data`, `temp`, `res` ではなく `decomposedTasks`, `ingredientType` |
| JSDoc コメント | 公開関数・カスタムフックには JSDoc を付与 |

---

## 9. テスト方針

| フェーズ | テスト内容 | 手法 |
|----------|-----------|------|
| Stream 単体 | 各コンポーネントが正しく描画されるか | 目視 + Storybook（任意） |
| Phase 2 | TC-01 〜 TC-04 の手動テスト | ブラウザで手動操作 |
| Phase 3 | パフォーマンス | Lighthouse, Chrome DevTools |

---

## 10. 環境変数

| 変数名 | 用途 | 必須 |
|--------|------|------|
| `GEMINI_API_KEY` | Gemini API の認証キー | ✅ |

> **注意**: `.env.local` は `.gitignore` に含まれており、リポジトリにはコミットされません。
> 新しいメンバーは `.env.local` を手動で作成し、API キーを設定してください。
