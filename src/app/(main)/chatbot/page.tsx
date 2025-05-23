"use client";

import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { useTranslations } from '@/lib/translations';

export default function ChatbotPage() {
  const t = useTranslations();
  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">{t.chatbotTitle}</h1>
      <ChatInterface />
    </div>
  );
}
