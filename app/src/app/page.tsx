'use client';

import { useState } from 'react';
import { HamburgerStack } from '@/components/hamburger/HamburgerStack';
import { TaskList } from '@/components/task/TaskList';
import { TaskInput } from '@/components/input/TaskInput';
import { EatAnimation } from '@/components/hamburger/EatAnimation';
import { useTaskManager } from '@/hooks/useTaskManager';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { parentTask, isLoading, error, createTask, toggleSubTask, resetTask } = useTaskManager();
  const [isEating, setIsEating] = useState(false);

  const handleTaskSubmit = async (taskName: string) => {
    setIsEating(false);
    await createTask(taskName);
  };

  const handleReset = () => {
    setIsEating(false);
    resetTask();
  };

  const isCompleted = parentTask?.status === 'completed';

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>🍔 Burger Task</h1>
      <p className={styles.subtitle}>
        タスクを食べて消化しよう
      </p>

      <AnimatePresence mode="wait">
        {!parentTask ? (
          <motion.div 
            key="input-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <TaskInput onSubmit={handleTaskSubmit} isLoading={isLoading} />
            {error && (
              <p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
                {error}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="task-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.taskSection}
          >
            <div className={styles.taskHeader}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {parentTask.name}
              </h2>
              <div className={styles.taskHeaderButtons}>
                <AnimatePresence>
                  {isCompleted && !isEating && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setIsEating(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: 'var(--space-sm) var(--space-lg)',
                        backgroundColor: 'var(--color-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'var(--color-text-inverse)',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      ハンバーガーを食べる 🍔
                    </motion.button>
                  )}
                </AnimatePresence>
                <button 
                  onClick={handleReset}
                  style={{
                    padding: 'var(--space-sm) var(--space-lg)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: 'var(--color-text-light)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  新しいタスクを作る
                </button>
              </div>
            </div>
            
            <div className={styles.gridContainer}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <TaskList 
                  tasks={parentTask.subTasks} 
                  onCompleteTask={toggleSubTask} 
                />
              </div>
              
              <motion.div 
                animate={isEating ? { scale: [1, 1.1, 0], opacity: [1, 1, 0], y: [0, -20, 50] } : {}}
                transition={isEating ? { duration: 0.6, ease: 'easeIn', times: [0, 0.2, 1] } : {}}
                className={styles.burgerWrapper}
              >
                <HamburgerStack
                  taskName={parentTask.name}
                  completedTasks={parentTask.subTasks.filter(t => t.completed)}
                  isCompleted={isCompleted}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EatAnimation 
        isActive={isEating} 
        ingredientTypes={parentTask?.subTasks.filter(t => t.completed).map(t => t.ingredient) || []} 
        onComplete={() => { /* アニメーション完了後に何かする場合はここ（今回は表示をそのまま維持） */ }}
      />
    </main>
  );
}
