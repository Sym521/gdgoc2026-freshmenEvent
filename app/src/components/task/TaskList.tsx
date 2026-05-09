'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';

import type { SubTask } from '@/types/task';

import { TaskCard } from './TaskCard';
import styles from './TaskList.module.css';

// ---- Props 定義 ----
interface TaskListProps {
  /** 子タスクの配列 */
  tasks: SubTask[];
  /** タスク完了時のコールバック */
  onCompleteTask: (taskId: string) => void;
}

/** リストアイテムのアニメーション variants */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', bounce: 0.3, duration: 0.5 },
  },
  exit: {
    opacity: 0,
    x: 60,
    scale: 0.9,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

/**
 * タスクリストコンポーネント
 * 未完了タスク一覧をリスト表示し、進捗状況を可視化する。
 */
export function TaskList({ tasks, onCompleteTask }: TaskListProps) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  // 空状態
  if (totalCount === 0) {
    return (
      <div className={styles.container} id="task-list">
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🍔</span>
          <p className={styles.emptyText}>タスクがありません</p>
          <p className={styles.emptySubtext}>
            音声またはテキストでタスクを入力してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} id="task-list">
      {/* ヘッダー */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>📋</span>
          タスク
        </h2>
        <div className={styles.counter}>
          <span className={styles.counterCurrent}>{completedCount}</span>
          <span className={styles.counterSeparator}>/</span>
          <span>{totalCount}</span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className={styles.progressBar} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 全完了メッセージ */}
      {allCompleted && (
        <motion.div
          className={styles.allDone}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <span className={styles.allDoneIcon}>🎉</span>
          <span className={styles.allDoneText}>
            全タスク完了！ハンバーガー完成！
          </span>
        </motion.div>
      )}

      {/* タスクカードリスト */}
      <div className={styles.list} role="list">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: index * 0.05 }}
              layout
              role="listitem"
            >
              <TaskCard task={task} onComplete={onCompleteTask} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
