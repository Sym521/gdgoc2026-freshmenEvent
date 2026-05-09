type RateLimitRecord = {
  count: number;
  lastReset: number;
};

const rateLimits = new Map<string, RateLimitRecord>();
const WINDOW_MS = 60 * 1000; // 1分
const MAX_REQUESTS = 5; // 1分あたりの最大リクエスト数

/**
 * 簡易的なインメモリのレート制限ユーティリティ (B-2-3)
 * 指定されたIPアドレスのリクエストをチェックし、制限を超えていなければtrueを返します。
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record) {
    rateLimits.set(ip, { count: 1, lastReset: now });
    return true;
  }

  // ウィンドウ期間を過ぎていたらリセット
  if (now - record.lastReset > WINDOW_MS) {
    rateLimits.set(ip, { count: 1, lastReset: now });
    return true;
  }

  // 制限を超過している場合
  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  // カウントアップ
  record.count += 1;
  return true;
}
