/** ハンバーガーの具材タイプ */
export type IngredientType = 'lettuce' | 'tomato' | 'cheese' | 'patty' | 'onion' | 'bacon';

/** AIによって細分化された子タスク */
export interface SubTask {
  id: string;
  name: string;
  ingredient: IngredientType;
  completed: boolean;
}

/** ユーザーが入力した親タスク */
export interface ParentTask {
  id: string;
  name: string;
  subTasks: SubTask[];
  status: 'idle' | 'decomposing' | 'active' | 'completed';
}

/** タスク細分化 API リクエスト */
export interface DecomposeRequest {
  taskName: string;
}

/** タスク細分化 API レスポンス */
export interface DecomposeResponse {
  parentTask: ParentTask;
}
