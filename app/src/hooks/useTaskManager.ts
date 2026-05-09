import { useState, useCallback } from 'react';
import { ParentTask } from '@/types/task';
import { decomposeTask } from '@/lib/apiClient';

export function useTaskManager(apiKey?: string) {
  const [parentTask, setParentTask] = useState<ParentTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 親タスクを作成し、API経由で子タスクに分解する
   */
  const createTask = useCallback(async (taskName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await decomposeTask(taskName, apiKey);
      setParentTask(response.parentTask);
    } catch (err: any) {
      console.error('Task decomposition error:', err);
      setError(err.message || 'タスクの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 子タスクの完了状態を切り替える
   */
  const toggleSubTask = useCallback((subTaskId: string) => {
    setParentTask((prev) => {
      if (!prev) return prev;
      
      const newSubTasks = prev.subTasks.map(task => 
        task.id === subTaskId ? { ...task, completed: !task.completed } : task
      );

      const isAllCompleted = newSubTasks.every(t => t.completed);
      
      return {
        ...prev,
        subTasks: newSubTasks,
        status: isAllCompleted ? 'completed' : 'active'
      };
    });
  }, []);

  /**
   * 現在のタスクをリセットする
   */
  const resetTask = useCallback(() => {
    setParentTask(null);
    setError(null);
  }, []);

  return {
    parentTask,
    isLoading,
    error,
    createTask,
    toggleSubTask,
    resetTask
  };
}
