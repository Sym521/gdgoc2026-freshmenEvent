import styles from './Skeleton.module.css';

// ---- Props 定義 ----
interface TaskListSkeletonProps {
  /** 表示するスケルトンカードの数（デフォルト: 4） */
  count?: number;
}

/** 遅延クラスのマッピング */
const delayClasses = [
  '',
  styles.delay1,
  styles.delay2,
  styles.delay3,
  styles.delay4,
];

/**
 * タスクカード スケルトンコンポーネント（単体）
 * API通信中に表示するタスクカードのプレースホルダー
 */
export function TaskCardSkeleton({ delay = 0 }: { delay?: number }) {
  const delayClass = delayClasses[delay % delayClasses.length] || '';

  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.bone} ${styles.badge} ${delayClass}`} />
      <div className={styles.content}>
        <div
          className={`${styles.bone} ${styles.textLine} ${styles.textLinePrimary} ${delayClass}`}
        />
        <div
          className={`${styles.bone} ${styles.textLine} ${styles.textLineSecondary} ${delayClass}`}
        />
      </div>
      <div className={`${styles.bone} ${styles.circle} ${delayClass}`} />
    </div>
  );
}

/**
 * タスクリスト スケルトンコンポーネント
 * API通信中にタスクリスト全体のプレースホルダーを表示する
 */
export function TaskListSkeleton({ count = 4 }: TaskListSkeletonProps) {
  return (
    <div
      className={styles.listContainer}
      role="status"
      aria-label="タスクを読み込み中..."
    >
      {/* ヘッダー スケルトン */}
      <div className={styles.header}>
        <div className={`${styles.bone} ${styles.headerTitle}`} />
        <div className={`${styles.bone} ${styles.headerCounter}`} />
      </div>

      {/* プログレスバー スケルトン */}
      <div className={`${styles.bone} ${styles.progressBar}`} />

      {/* カードリスト スケルトン */}
      <div className={styles.cardList}>
        {Array.from({ length: count }, (_, i) => (
          <TaskCardSkeleton key={i} delay={i} />
        ))}
      </div>
    </div>
  );
}
