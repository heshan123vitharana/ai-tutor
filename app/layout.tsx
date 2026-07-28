import type { Metadata } from 'next';
import 'highlight.js/styles/github-dark.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Tutor — Learn Anything with Aria',
  description: 'An intelligent AI tutor powered by Groq and LLaMA 3.3. Ask questions, get explanations, and learn any subject at your own pace.',
  keywords: ['AI tutor', 'learning', 'education', 'Groq', 'LLaMA', 'chatbot'],
  openGraph: {
    title: 'AI Tutor — Learn Anything with Aria',
    description: 'Intelligent AI tutoring powered by Groq LLaMA 3.3',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
