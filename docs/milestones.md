# マイルストーン計画 — ハンバーガーUI・AIタスク細分化アプリ

## 🎯 最終ゴール

ユーザーが音声/テキストで入力した親タスクを Gemini API が子タスクに細分化し、
ハンバーガーの具材として積み上げ→完成→食べるアニメーションで消化する
**ゲーミフィケーション型タスク管理アプリ** を Next.js で完成させる。

---

## 開発ストリーム構成（並列開発マップ）

```
Phase 0 (基盤)  ─── 全員共通 ─── 型定義・デザイントークン・ディレクトリ構造
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  Stream A          Stream B         Stream C
  ハンバーガーUI     API / AI連携      音声入力
  (フロントエンド)   (バックエンド)     (フロントエンド)
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                    Phase 2 (結合)
                  ストリーム統合・状態管理接続
                         │
                         ▼
                    Phase 3 (完成)
                  アニメーション仕上げ・テスト・デプロイ
```

---

## Phase 0: 基盤構築（全ストリームの前提）

> **担当**: 全員 / **期間目安**: 0.5 日
> **ブランチ**: `feature/foundation`

### 成果物

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| 0-1 | 共通型定義の作成 | `src/types/task.ts` | `ParentTask`, `SubTask`, `IngredientType` 等の型がエクスポートされている |
| 0-2 | デザイントークン定義 | `src/app/globals.css` | カラーパレット・フォント・spacing が CSS 変数で定義されている |
| 0-3 | ディレクトリスキャフォールド | `src/components/`, `src/hooks/`, `src/lib/`, `src/types/` | 空の index.ts とディレクトリが存在する |
| 0-4 | 具材アセット定義 | `src/lib/ingredients.ts` | 具材マスターデータ（レタス, トマト, チーズ, パティ 等）が定数として定義されている |

### 型定義の概要（`src/types/task.ts`）

```typescript
export type IngredientType = 'lettuce' | 'tomato' | 'cheese' | 'patty' | 'onion' | 'bacon';

export interface SubTask {
  id: string;
  name: string;
  ingredient: IngredientType;
  completed: boolean;
}

export interface ParentTask {
  id: string;
  name: string;
  subTasks: SubTask[];
  status: 'idle' | 'decomposing' | 'active' | 'completed';
}

// API Request / Response
export interface DecomposeRequest {
  taskName: string;
}

export interface DecomposeResponse {
  parentTask: ParentTask;
}
```

---

## Stream A: ハンバーガー UI（フロントエンド）

> **担当**: フロントエンド担当
> **依存**: Phase 0 完了後に開始
> **ブランチ**: `feature/hamburger-ui`

### A-1: 静的ハンバーガーコンポーネント

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| A-1-1 | 下バンズコンポーネント | `src/components/hamburger/BottomBun.tsx` | 画面中央に 2D ポップな下バンズが描画される |
| A-1-2 | 上バンズコンポーネント | `src/components/hamburger/TopBun.tsx` | 画面上部に親タスク名を表示した上バンズが浮遊描画される |
| A-1-3 | 具材コンポーネント | `src/components/hamburger/Ingredient.tsx` | `IngredientType` に応じた具材ビジュアルが描画される |
| A-1-4 | ハンバーガースタック | `src/components/hamburger/HamburgerStack.tsx` | 下バンズ＋積まれた具材＋上バンズを縦に組み合わせるコンテナ |

### A-2: タスクリスト UI

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| A-2-1 | タスクカードコンポーネント | `src/components/task/TaskCard.tsx` | 具材アイコン付きの子タスクカードが描画される |
| A-2-2 | タスクリストコンポーネント | `src/components/task/TaskList.tsx` | 未完了タスク一覧がリスト表示される |
| A-2-3 | ローディングスケルトン | `src/components/ui/Skeleton.tsx` | API 通信中のスケルトン UI が表示される |

### A-3: アニメーション

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| A-3-1 | 具材積み上げアニメーション | `src/components/hamburger/Ingredient.tsx` に追加 | Framer Motion で具材がリストからスタックへ飛ぶアニメーション (60fps) |
| A-3-2 | 上バンズ合体アニメーション | `src/components/hamburger/TopBun.tsx` に追加 | 全完了時に上バンズがスタック上に降りてくる |
| A-3-3 | 「食べる」完了アニメーション | `src/components/hamburger/EatAnimation.tsx` | パーティクルエフェクトでハンバーガーが食べられる演出 |

---

## Stream B: API / AI 連携（バックエンド）

> **担当**: バックエンド担当
> **依存**: Phase 0 完了後に開始
> **ブランチ**: `feature/api-gemini`

### B-1: Gemini API 連携

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| B-1-1 | Gemini クライアント初期化 | `src/lib/gemini.ts` | 環境変数から API キーを読み込み、GenerativeModel インスタンスを生成 |
| B-1-2 | タスク細分化プロンプト設計 | `src/lib/prompts.ts` | 親タスク→子タスク(3〜5個)+具材割当を JSON で返すプロンプトテンプレート |
| B-1-3 | レスポンスパーサー | `src/lib/parser.ts` | Gemini の生テキスト応答を `SubTask[]` 型に安全にパースする関数 |

### B-2: API Route

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| B-2-1 | POST /api/tasks/decompose | `src/app/api/tasks/decompose/route.ts` | 親タスク文字列を受け取り、子タスク配列を JSON 返却。エラーハンドリング含む |
| B-2-2 | バリデーション・エラー処理 | 同上 | 空文字、長すぎる入力、API エラー時に適切な HTTP ステータスとメッセージを返す |
| B-2-3 | レート制限（任意） | `src/lib/rateLimit.ts` | 簡易的な IP ベースのレート制限（任意、Phase 3 でも可） |

---

## Stream C: 音声入力（フロントエンド）

> **担当**: フロントエンド担当
> **依存**: Phase 0 完了後に開始
> **ブランチ**: `feature/voice-input`

### C-1: 音声認識

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| C-1-1 | Web Speech API フック | `src/hooks/useSpeechRecognition.ts` | 録音開始/停止、認識テキスト取得、エラーハンドリングをカスタムフックで提供 |
| C-1-2 | マイクボタン UI | `src/components/input/MicButton.tsx` | 長押し/タップで録音開始・停止。録音中のビジュアルフィードバック（波形アニメーション等） |
| C-1-3 | テキスト入力フォールバック | `src/components/input/TaskInput.tsx` | テキスト入力欄＋マイクボタンを統合した入力コンポーネント |

### タスク入力画面 (TaskInput) 要件詳細

#### 機能要件
*   **テキスト入力機能**: ユーザーがキーボードから「親タスク」をテキスト入力できる。Enterキーまたは送信ボタン押下で入力を確定・送信。
*   **音声入力機能**: `MicButton` をタップ（または長押し）で音声録音開始・停止。`useSpeechRecognition` フックで音声をテキスト変換して入力欄に反映。
*   **タスク送信処理 (Phase 2連携)**: 確定後、API（`/api/tasks/decompose`）呼び出しトリガーを引く。通信中は入力を非活性化。

#### UI/UX・デザイン要件
*   **デザイン**: モダンでポップなデザイン（CSS変数を利用）。
*   **ビジュアルフィードバック**: 録音中であることを示す視覚効果（ボタンのアニメーション等）。
*   **状態表示**: API通信中は処理中であることがわかるようにする。

#### エラーハンドリング要件
*   **音声認識エラー**: 非対応ブラウザではマイクボタン非活性。アクセス拒否時はエラー表示しテキスト入力を促す。
*   **バリデーション**: 空文字のみの送信をブロック。

---

## Phase 2: 結合（ストリーム統合）

> **担当**: 全員 / **期間目安**: 1 日
> **依存**: Stream A, B, C がすべて単体完成
> **ブランチ**: `feature/integration`

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| 2-1 | 状態管理の実装 | `src/hooks/useTaskManager.ts` | ParentTask の CRUD、SubTask の完了切替、全完了検知をカスタムフックで管理 |
| 2-2 | メインページ統合 | `src/app/page.tsx` | TaskInput → API 呼び出し → TaskList + HamburgerStack が連動して動作 |
| 2-3 | API クライアント | `src/lib/apiClient.ts` | フロントエンドから `/api/tasks/decompose` を呼ぶ fetch ラッパー |
| 2-4 | E2E フロー確認 | — | TC-01 〜 TC-04 のテストケースが手動で通ること |

---

## Phase 3: 仕上げ・デプロイ

> **担当**: 全員 / **期間目安**: 0.5〜1 日
> **ブランチ**: `feature/polish`

| # | タスク | ファイル | 完了条件 |
|---|--------|----------|----------|
| 3-1 | アニメーション調整 | 各コンポーネント | 全アニメーションが 60fps で滑らかに動作 |
| 3-2 | レスポンシブ対応 | `globals.css` + 各コンポーネント | モバイル / タブレット / デスクトップで破綻しない |
| 3-3 | SEO / メタデータ | `src/app/layout.tsx` | title, description, OGP 等が適切に設定されている |
| 3-4 | Dockerfile 作成 | `Dockerfile` | Cloud Run 向けのコンテナビルドが成功する |
| 3-5 | パフォーマンス検証 | — | Lighthouse スコア 90+ (Performance) |

---

## ディレクトリ構造（最終形）

```
app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tasks/
│   │   │       └── decompose/
│   │   │           └── route.ts        # Stream B
│   │   ├── globals.css                 # Phase 0
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Phase 2
│   ├── components/
│   │   ├── hamburger/                  # Stream A
│   │   │   ├── BottomBun.tsx
│   │   │   ├── TopBun.tsx
│   │   │   ├── Ingredient.tsx
│   │   │   ├── HamburgerStack.tsx
│   │   │   └── EatAnimation.tsx
│   │   ├── task/                       # Stream A
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskList.tsx
│   │   ├── input/                      # Stream C
│   │   │   ├── MicButton.tsx
│   │   │   └── TaskInput.tsx
│   │   └── ui/                         # Stream A
│   │       └── Skeleton.tsx
│   ├── hooks/                          # Stream C + Phase 2
│   │   ├── useSpeechRecognition.ts
│   │   └── useTaskManager.ts
│   ├── lib/                            # Stream B + Phase 0
│   │   ├── gemini.ts
│   │   ├── prompts.ts
│   │   ├── parser.ts
│   │   ├── ingredients.ts
│   │   └── apiClient.ts
│   └── types/                          # Phase 0
│       └── task.ts
├── public/
├── .env.local
├── package.json
└── tsconfig.json
```
