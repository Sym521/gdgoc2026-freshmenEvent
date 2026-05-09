import { DecomposeRequest, DecomposeResponse } from '@/types/task';

/**
 * ユーザー入力のタスクをGemini APIに送信し、子タスクに分割する
 */
export async function decomposeTask(taskName: string): Promise<DecomposeResponse> {
  const reqBody: DecomposeRequest = { taskName };
  
  const response = await fetch('/api/tasks/decompose', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'タスクの細分化に失敗しました');
  }

  return response.json();
}
