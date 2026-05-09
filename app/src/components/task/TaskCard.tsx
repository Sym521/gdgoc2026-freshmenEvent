'use client';

import type { SubTask } from '@/types/task';
import { INGREDIENTS } from '@/lib/ingredients';

import styles from './TaskCard.module.css';

// ---- Props 定義 ----
interface TaskCardProps {
  /** 表示する子タスク */
  task: SubTask;
  /** タスク完了時のコールバック */
  onComplete: (taskId: string) => void;
}

/**
 * タスクカードコンポーネント
 * 具材アイコン付きの子タスクカードを描画する。
 * クリックで完了状態をトグルする。
 */
export function TaskCard({ task, onComplete }: TaskCardProps) {
  const ingredient = INGREDIENTS[task.ingredient];

  const handleClick = () => {
    if (!task.completed) {
      onComplete(task.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const cardClassName = [
    styles.card,
    task.completed ? styles.completed : '',
  ].filter(Boolean).join(' ');

  const checkmarkClassName = [
    styles.checkmark,
    task.completed ? styles.checkmarkCompleted : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={task.completed}
      aria-label={`タスク: ${task.name}${task.completed ? ' (完了)' : ''}`}
      id={`task-card-${task.id}`}
    >
      {/* 具材バッジ */}
      <div
        className={styles.ingredientBadge}
        style={{
          backgroundColor: `${ingredient.color}18`,
        }}
      >
        {ingredient.emoji}
      </div>

      {/* テキスト領域 */}
      <div className={styles.content}>
        <span className={styles.taskName}>{task.name}</span>
        <span className={styles.ingredientLabel}>{ingredient.label}</span>
      </div>

      {/* チェックマーク */}
      <div className={checkmarkClassName}>
        <svg className={styles.checkmarkIcon} viewBox="0 0 24 24">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </div>
    </div>
  );
}
