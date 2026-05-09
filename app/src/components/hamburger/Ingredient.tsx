'use client';

import { motion } from 'framer-motion';

import type { IngredientType } from '@/types/task';

import styles from './Ingredient.module.css';

// ---- Props 定義 ----
interface IngredientProps {
  /** 具材の種類 */
  type: IngredientType;
  /** 子タスクID（layoutId に使用して飛ぶアニメーションを実現） */
  taskId?: string;
}

/** IngredientType から CSS クラス名へのマッピング */
const ingredientClassMap: Record<IngredientType, string> = {
  lettuce: styles.lettuce,
  tomato: styles.tomato,
  cheese: styles.cheese,
  patty: styles.patty,
  onion: styles.onion,
  bacon: styles.bacon,
};

/**
 * 具材の積み上げアニメーション variants
 * Framer Motion でリストからスタックへ飛ぶ演出を行う
 */
const ingredientVariants = {
  hidden: {
    opacity: 0,
    y: -80,
    scale: 0.3,
    rotateZ: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateZ: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 18,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn' as const,
    },
  },
};

/**
 * 着地時のバウンス（squash & stretch）
 * 具材がスタックに乗る瞬間の弾力感を演出する
 */
const squashVariants = {
  hidden: {
    scaleX: 1,
    scaleY: 1,
  },
  visible: {
    scaleX: [1, 1.15, 0.95, 1.03, 1],
    scaleY: [1, 0.85, 1.08, 0.97, 1],
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
      times: [0, 0.3, 0.5, 0.7, 1],
    },
  },
};

/**
 * 具材コンポーネント（A-1-3 + A-3-1）
 * IngredientType に応じた2Dポップな具材ビジュアルを描画し、
 * Framer Motion でスタックへの積み上げアニメーションを実行する
 */
export function Ingredient({ type, taskId }: IngredientProps) {
  const ingredientClass = ingredientClassMap[type];

  return (
    <motion.div
      className={styles.wrapper}
      variants={ingredientVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layoutId={taskId ? `ingredient-${taskId}` : undefined}
    >
      <motion.div
        className={`${styles.ingredient} ${ingredientClass}`}
        variants={squashVariants}
        initial="hidden"
        animate="visible"
        aria-label={`具材: ${type}`}
      />
    </motion.div>
  );
}
