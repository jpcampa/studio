
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sendMessageToKnowledgeAssistant } from '@/actions/knowledge-assistant';
import type { ServerKnowledgeAssistantResult } from '@/actions/knowledge-assistant';
import { useTranslations } from '@/lib/translations';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function KnowledgeAssistantInterface() {
  const t = useTranslations();
  const { user: currentUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) {
        return [
          {
            id: crypto.randomUUID(),
            text: "Hola, soy tu asistente de conocimiento. Pregúntame cualquier cosa sobre los documentos proporcionados.",
            sender: 'bot',
            timestamp: new Date(),
          },
        ];
      }
      return prevMessages;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const context = messages
      .slice(-5)
      .map(msg => `${msg.sender === 'user' ? 'Usuario' : 'Asistente'}: ${msg.text}`)
      .join('\n');

    const result: ServerKnowledgeAssistantResult = await sendMessageToKnowledgeAssistant({ question: userMessage.text, context });

    setIsLoading(false);
    if (result.success) {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: result.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: `${t.errorOccurred} ${result.error}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  const userInitials = currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : "US";
  const userAvatarSrc = `https://placehold.co/100x100.png?text=${userInitials}`;

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-h-[700px] w-full max-w-2xl mx-auto bg-card shadow-xl rounded-lg">
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2 max-w-[85%]",
              msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={msg.sender === 'user' ? userAvatarSrc : `https://placehold.co/100x100.png?text=AI`} data-ai-hint={msg.sender === 'user' ? 'user avatar' : 'chatbot avatar'}/>
              <AvatarFallback>
                {msg.sender === 'user' ? <User className="h-4 w-4"/> : <Bot className="h-4 w-4"/>}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "p-3 rounded-lg shadow",
                msg.sender === 'user'
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none"
              )}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <p className={cn(
                  "text-xs mt-1",
                  msg.sender === 'user' ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                )}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 mr-auto">
             <Avatar className="h-8 w-8">
               <AvatarImage src={`https://placehold.co/100x100.png?text=AI`} data-ai-hint="chatbot avatar" />
               <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg shadow bg-muted text-foreground rounded-tl-none">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pregunta sobre los documentos..."
          className="flex-grow"
          disabled={isLoading}
          aria-label="Chat input for knowledge assistant"
        />
        <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
