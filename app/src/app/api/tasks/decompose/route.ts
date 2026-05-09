import { NextResponse } from 'next/server';
import { DecomposeRequest, DecomposeResponse, ParentTask } from '@/types/task';
import { checkRateLimit } from '@/lib/rateLimit';
import { geminiModel } from '@/lib/gemini';
import { buildDecomposeTaskPrompt } from '@/lib/prompts';
import { parseGeminiResponse } from '@/lib/parser';

export async function POST(request: Request) {
  try {
    // B-2-3: レート制限のチェック
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429 }
      );
    }

    // JSONボディのパース
    let body: any;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { taskName } = body as Partial<DecomposeRequest>;

    // B-2-2: バリデーション
    if (!taskName || typeof taskName !== 'string') {
      return NextResponse.json(
        { error: 'taskName is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedTaskName = taskName.trim();
    if (trimmedTaskName.length === 0) {
      return NextResponse.json(
        { error: 'taskName cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedTaskName.length > 100) {
      return NextResponse.json(
        { error: 'taskName is too long (maximum is 100 characters)' },
        { status: 400 }
      );
    }

    // B-1のGemini API連携を呼び出す (B-2-1)
    const prompt = buildDecomposeTaskPrompt(trimmedTaskName);
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    const subTasks = parseGeminiResponse(responseText);

    const parentTask: ParentTask = {
      id: crypto.randomUUID(),
      name: trimmedTaskName,
      subTasks,
      status: 'active'
    };

    const response: DecomposeResponse = {
      parentTask
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('API Error /tasks/decompose:', error);
    // B-2-2: API エラー時に適切な HTTP ステータスとメッセージを返す
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
