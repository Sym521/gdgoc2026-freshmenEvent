import type { SubTask } from '@/types/task';

import { BottomBun } from './BottomBun';
import { TopBun } from './TopBun';
import { Ingredient } from './Ingredient';
import styles from './HamburgerStack.module.css';
import { AnimatePresence } from 'framer-motion';

// ---- Props 定義 ----
interface HamburgerStackProps {
  /** 親タスク名（上バンズに表示） */
  taskName?: string;
  /** 完了済みの子タスク（具材として積み上げる） */
  completedTasks: SubTask[];
  /** 全タスク完了状態（上バンズを乗せるか） */
  isCompleted?: boolean;
}

/**
 * ハンバーガースタックコンポーネント
 * 下バンズ＋積まれた具材＋上バンズを縦に組み合わせるコンテナ
 */
export function HamburgerStack({
  taskName,
  completedTasks,
  isCompleted = false,
}: HamburgerStackProps) {
  const hasIngredients = completedTasks.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.stack}>
        {/* 上バンズ: 未完了時は浮遊、完了時はスタック上に配置 */}
        <TopBun
          taskName={taskName}
          floating={!isCompleted}
          landed={isCompleted}
        />

        {/* 具材エリア */}
        <div className={styles.ingredients}>
          <AnimatePresence>
            {completedTasks.map((task) => (
              <Ingredient key={task.id} type={task.ingredient} taskId={task.id} />
            ))}
          </AnimatePresence>
        </div>

        {/* 下バンズ */}
        <BottomBun />
      </div>

      {/* プレート（影） */}
      <div className={styles.plate} />

      {/* 空状態のヒント */}
      {!hasIngredients && !isCompleted && (
        <div className={styles.emptyHint}>
          タスクを完了して
          <br />
          ハンバーガーを作ろう！🍔
        </div>
      )}
    </div>
  );
}
