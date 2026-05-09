export function buildDecomposeTaskPrompt(taskName: string): string {
  return `
あなたはタスク分解の専門家です。
以下の親タスクを、実行可能な具体的な子タスク（3〜5個）に分割してください。
各子タスクには、ハンバーガーの具材（'lettuce', 'tomato', 'cheese', 'patty', 'onion', 'bacon' のいずれか）を1つずつ割り当ててください。

親タスク: "${taskName}"

出力は以下のJSON配列形式のみとしてください。Markdownのコードブロック（\`\`\`json）やその他の文章は一切含めないでください。

[
  {
    "name": "子タスクの名前",
    "ingredient": "具材名"
  }
]
  `.trim();
}
