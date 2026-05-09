'use client';

import { HamburgerStack } from '@/components/hamburger/HamburgerStack';
import { TaskList } from '@/components/task/TaskList';
import { TaskInput } from '@/components/input/TaskInput';
import { useTaskManager } from '@/hooks/useTaskManager';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { parentTask, isLoading, error, createTask, toggleSubTask, resetTask } = useTaskManager();

  const handleTaskSubmit = async (taskName: string) => {
    await createTask(taskName);
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
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', width: '100%', maxWidth: '1000px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--space-md)' }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {parentTask.name}
              </h2>
              <button 
                onClick={resetTask}
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <TaskList 
                  tasks={parentTask.subTasks} 
                  onCompleteTask={toggleSubTask} 
                />
              </div>
              
              <div style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HamburgerStack
                  taskName={parentTask.name}
                  completedTasks={parentTask.subTasks.filter(t => t.completed)}
                  isCompleted={isCompleted}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
