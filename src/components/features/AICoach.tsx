'use client'

import { useState, useRef, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { aiService } from '@/lib/ai'
import { generateId } from '@/lib/utils'
import { Send, Bot, User, Loader2, Lightbulb, Heart, Zap, Apple } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ChatMessage, ChatSession } from '@/types'

const quickQuestions = [
  { icon: Apple, text: "What's a healthy snack under 200 calories?" },
  { icon: Zap, text: "Suggest a protein-rich breakfast" },
  { icon: Heart, text: "How can I improve my heart health?" },
  { icon: Lightbulb, text: "Tips for staying hydrated" }
]

export default function AICoach() {
  const { profile, chatSessions, activeChatSession, addChatSession, setActiveChatSession } = useUserStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load active chat session or create a new one
    if (activeChatSession) {
      const session = chatSessions.find(s => s.id === activeChatSession)
      if (session) {
        setMessages(session.messages)
      }
    } else {
      // Create initial welcome message
      const welcomeMessage: ChatMessage = {
        id: generateId(),
        content: `Hello${profile?.name ? ` ${profile.name}` : ''}! I'm your AI nutrition coach. I'm here to help you with healthy eating advice, meal suggestions, and answer any nutrition questions you might have. How can I assist you today?`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages([welcomeMessage])
    }
  }, [activeChatSession, chatSessions, profile])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim()
    if (!messageText || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      content: messageText,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputMessage('')
    setIsLoading(true)

    try {
      // Get context from recent messages
      const recentContext = updatedMessages
        .slice(-5) // Last 5 messages for context
        .filter(m => m.role === 'assistant')
        .map(m => m.content)

      const response = await aiService.getChatResponse(messageText, profile || undefined, recentContext)

      const assistantMessage: ChatMessage = {
        id: generateId(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)

      // Save chat session
      if (!activeChatSession) {
        const newSession: ChatSession = {
          id: generateId(),
          userId: profile?.id || 'anonymous',
          messages: finalMessages,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        addChatSession(newSession)
        setActiveChatSession(newSession.id)
      } else {
        // Update existing session - this would typically be done via API
        const sessionIndex = chatSessions.findIndex(s => s.id === activeChatSession)
        if (sessionIndex >= 0) {
          chatSessions[sessionIndex].messages = finalMessages
          chatSessions[sessionIndex].updatedAt = new Date()
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: ChatMessage = {
        id: generateId(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages([...updatedMessages, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <Card className="h-[700px] flex flex-col glass-panel border-0 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      <CardHeader className="flex-shrink-0 border-b border-border/10 bg-background/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary animate-pulse">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Personal AI Coach
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              Online and ready to assist
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-6 p-6 scroll-smooth">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''
                }`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${message.role === 'user'
                  ? 'gradient-primary text-primary-foreground'
                  : 'glass-panel bg-background/50 text-primary border-primary/20'
                  }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className={`rounded-3xl px-6 py-4 shadow-sm ${message.role === 'user'
                    ? 'gradient-primary text-primary-foreground rounded-tr-none'
                    : 'glass-panel bg-white/50 dark:bg-muted/30 text-foreground rounded-tl-none border-border/50'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className={`text-[10px] uppercase tracking-wider font-bold opacity-40 ${message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl glass-panel bg-background/50 text-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="glass-panel bg-white/30 dark:bg-muted/20 rounded-3xl rounded-tl-none px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Coach is typing...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-6 pt-0 border-t border-border/10">
            <p className="text-sm font-semibold text-muted-foreground mb-4 px-2">Suggestions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickQuestion(question.text)}
                  className="justify-start h-auto py-3 px-4 glass-panel bg-background/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all border-border/40 group"
                  disabled={isLoading}
                >
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 group-hover:bg-primary/20 transition-colors">
                    <question.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium line-clamp-1">{question.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-border/10 bg-background/20 backdrop-blur-md">
          <div className="relative flex items-center gap-2 glass-panel p-2 rounded-2xl shadow-inner border-border/20">
            <Input
              ref={inputRef}
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={isLoading}
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base py-6 px-4 flex-1"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="rounded-xl h-12 w-12 flex-shrink-0 gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-widest opacity-60">
            NutraGenAI Assistant • Knowledgeable & Secure
          </p>
        </div>
      </CardContent>

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
    </Card>
  )
}