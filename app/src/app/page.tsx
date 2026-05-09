import type { SubTask } from '@/types/task';

import { HamburgerStack } from '@/components/hamburger/HamburgerStack';
import styles from './page.module.css';

/**
 * デモ用のダミーデータ — 完了済みタスク（具材として表示）
 * Phase 2 で実際の状態管理に置き換える
 */
const demoCompletedTasks: SubTask[] = [
  { id: '1', name: '領収書をまとめる', ingredient: 'lettuce', completed: true },
  { id: '2', name: 'システムに入力する', ingredient: 'patty', completed: true },
  { id: '3', name: '書類を確認する', ingredient: 'cheese', completed: true },
  { id: '4', name: '提出する', ingredient: 'tomato', completed: true },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>🍔 Burger Task</h1>
      <p className={styles.subtitle}>
        タスクを食べて消化しよう
      </p>

      <HamburgerStack
        taskName="確定申告を終わらせる"
        completedTasks={demoCompletedTasks}
        isCompleted={false}
      />
    </main>
  );
}
