import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burger Task — AIタスク細分化アプリ",
  description: "タスクをハンバーガーの具材に見立てて消化するゲーミフィケーション型タスク管理アプリ",
  keywords: ["タスク管理", "ゲーミフィケーション", "Gemini", "AI", "ハンバーガー", "ToDo"],
  authors: [{ name: "GDG on Campus Japan" }],
  openGraph: {
    title: "Burger Task — AIタスク細分化",
    description: "タスクをハンバーガーの具材に見立てて消化するゲーミフィケーション型タスク管理アプリ。",
    url: "https://burger-task.gdgoc.jp",
    siteName: "Burger Task",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burger Task",
    description: "AIを使ってタスクを細分化し、ハンバーガーを完成させよう！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
