'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

import type { IngredientType } from '@/types/task';
import { INGREDIENTS } from '@/lib/ingredients';

import styles from './EatAnimation.module.css';

// ---- 定数 ----
/** パーティクルの生成数 */
const PARTICLE_COUNT = 24;

/** パーティクル発射後の完了待ち時間 (ms) */
const ANIMATION_DURATION = 1800;

// ---- 型定義 ----
interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  emoji: string;
  delay: number;
}

interface EatAnimationProps {
  /** アニメーションを開始するか */
  isActive: boolean;
  /** 完了したタスクの具材タイプ一覧（パーティクルの色に使用） */
  ingredientTypes: IngredientType[];
  /** アニメーション完了時のコールバック */
  onComplete?: () => void;
}

/**
 * ランダムなパーティクルデータを生成する
 */
function generateParticles(ingredientTypes: IngredientType[]): Particle[] {
  const particles: Particle[] = [];
  const availableIngredients = ingredientTypes.length > 0
    ? ingredientTypes
    : (['lettuce', 'tomato', 'cheese', 'patty'] as IngredientType[]);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ingredientType = availableIngredients[i % availableIngredients.length];
    const ingredientData = INGREDIENTS[ingredientType];
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const radius = 80 + Math.random() * 120;

    particles.push({
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius - 40,
      rotation: Math.random() * 720 - 360,
      scale: 0.4 + Math.random() * 0.8,
      color: ingredientData.color,
      emoji: ingredientData.emoji,
      delay: Math.random() * 0.15,
    });
  }

  return particles;
}

/**
 * ハンバーガーの全体崩壊アニメーション variants
 * ハンバーガーが縮小→消滅する
 */
const burgerCollapseVariants: Variants = {
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
  },
  eaten: {
    scale: [1, 1.1, 0.8, 0],
    opacity: [1, 1, 0.8, 0],
    y: [0, -10, 5, 20],
    transition: {
      duration: 0.6,
      ease: 'easeIn',
      times: [0, 0.2, 0.5, 1],
    },
  },
};

/**
 * パーティクル1つ分のアニメーション variants
 */
const particleVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 0,
    rotate: 0,
  },
  burst: (particle: Particle) => ({
    opacity: [0, 1, 1, 0],
    x: [0, particle.x * 0.3, particle.x],
    y: [0, particle.y * 0.3 - 30, particle.y + 60],
    scale: [0, particle.scale * 1.4, particle.scale, 0],
    rotate: [0, particle.rotation * 0.5, particle.rotation],
    transition: {
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.4 + particle.delay,
      times: [0, 0.3, 0.7, 1],
    },
  }),
};

/**
 * テキストフィードバックの variants
 */
const feedbackVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
      delay: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * 「食べる」完了アニメーションコンポーネント（A-3-3）
 * パーティクルエフェクトでハンバーガーが食べられる演出を行う
 *
 * - ハンバーガーが縮小→消滅
 * - 具材カラーのパーティクルが放射状に飛び散る
 * - 完了メッセージが表示される
 */
export function EatAnimation({
  isActive,
  ingredientTypes,
  onComplete,
}: EatAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnimationStart = useCallback(() => {
    const newParticles = generateParticles(ingredientTypes);
    setParticles(newParticles);

    // フィードバックテキストを遅延表示
    const feedbackTimer = setTimeout(() => {
      setShowFeedback(true);
    }, 600);

    // アニメーション完了を通知
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, ANIMATION_DURATION);

    return () => {
      clearTimeout(feedbackTimer);
      clearTimeout(completeTimer);
    };
  }, [ingredientTypes, onComplete]);

  useEffect(() => {
    if (isActive) {
      const cleanup = handleAnimationStart();
      return cleanup;
    }

    // 非アクティブ時はリセット
    setParticles([]);
    setShowFeedback(false);
  }, [isActive, handleAnimationStart]);

  if (!isActive) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      {/* パーティクルコンテナ */}
      <div className={styles.particleContainer}>
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={styles.particle}
              custom={particle}
              variants={particleVariants}
              initial="hidden"
              animate="burst"
              style={{
                color: particle.color,
              }}
            >
              <span className={styles.particleEmoji}>{particle.emoji}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* スパークルエフェクト */}
        <AnimatePresence>
          {particles.slice(0, 8).map((particle) => (
            <motion.div
              key={`sparkle-${particle.id}`}
              className={styles.sparkle}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                x: particle.x * 0.6,
                y: particle.y * 0.6 - 20,
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 0.5 + particle.delay,
                ease: 'easeOut',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 完了フィードバック */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className={styles.feedback}
            variants={feedbackVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className={styles.feedbackEmoji}>🎉</span>
            <span className={styles.feedbackText}>完食！</span>
            <span className={styles.feedbackSub}>タスク完了おめでとう！</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
