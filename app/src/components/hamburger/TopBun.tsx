'use client';

import { motion, type Variants } from 'framer-motion';

import styles from './TopBun.module.css';

// ---- Props 定義 ----
interface TopBunProps {
  /** 親タスク名（バンズに表示） */
  taskName?: string;
  /** 浮遊アニメーションを有効にするか（デフォルト: true） */
  floating?: boolean;
  /** 全タスク完了時にスタック上に降ろすか */
  landed?: boolean;
}

/**
 * 上バンズの合体（着地）アニメーション variants（A-3-2）
 * 全タスク完了時に上バンズがスタック上にストンと降りてくる
 */
const landingVariants: Variants = {
  floating: {
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  landing: {
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
      mass: 1.2,
    },
  },
};

/**
 * 着地時の squash & stretch 演出
 * バンズがスタックに乗った瞬間の重量感を表現する
 */
const squashOnLand: Variants = {
  floating: {
    scaleX: 1,
    scaleY: 1,
  },
  landing: {
    scaleX: [1, 1.12, 0.96, 1.04, 1],
    scaleY: [1, 0.88, 1.06, 0.98, 1],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      times: [0, 0.25, 0.45, 0.65, 1],
    },
  },
};

/**
 * 上バンズコンポーネント（A-1-2 + A-3-2）
 * - 通常時: CSS の浮遊アニメーション
 * - 全完了時: Framer Motion でスタック上に着地する合体アニメーション
 */
export function TopBun({ taskName, floating = true, landed = false }: TopBunProps) {
  const bunClassName = [
    styles.bun,
    floating && !landed ? styles.floating : '',
  ].filter(Boolean).join(' ');

  const animateState = landed ? 'landing' : 'floating';

  return (
    <motion.div
      className={styles.wrapper}
      variants={landingVariants}
      initial="floating"
      animate={animateState}
    >
      <motion.div
        className={bunClassName}
        variants={squashOnLand}
        initial="floating"
        animate={animateState}
        aria-label="上のバンズ"
      >
        {/* ゴマ粒 */}
        <span className={styles.sesame} />
        <span className={styles.sesame} />
        <span className={styles.sesame} />
        <span className={styles.sesame} />
        <span className={styles.sesame} />
        {taskName && (
          <span className={styles.label}>{taskName}</span>
        )}
      </motion.div>
    </motion.div>
  );
}
