"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, X, Shield, Heart, Lock, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export default function SOSChatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your SafeSpace companion. I'm here to listen, support, and help you navigate through difficult situations. You can share anything with me - I'm designed to provide a safe, non-judgmental space for you. What's on your mind?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: 'workplace_safety_support'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Chatbot API error:', error)
      return "I'm having trouble connecting right now, but I want you to know that you're not alone. If you're in immediate danger, please call emergency services. For support, you can reach the National Women's Helpline at 181 or contact a trusted friend, family member, or counselor."
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const botResponse = await generateResponse(userMessage.text)
      
      // Remove typing indicator and add actual response
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickResponses = [
    "I need help with workplace harassment",
    "How do I report an incident?",
    "What are my legal rights?",
    "I'm feeling scared and alone",
    "How can I stay safe?",
    "I need emotional support"
  ]

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]">
      <Card className="shadow-2xl border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle className="text-lg">SafeSpace Companion</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm opacity-90 mt-1">
            Your confidential, supportive space
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea 
            ref={scrollAreaRef}
            className="h-96 p-4"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm ml-2">SafeSpace is typing...</span>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Response Buttons */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => {
                      setInputText(response)
                      setTimeout(() => handleSendMessage(), 100)
                    }}
                    disabled={isLoading}
                  >
                    {response}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Safety Notice */}
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">Your safety is our priority</p>
                  <p>If you're in immediate danger, call emergency services. This chat is confidential but not a substitute for professional help.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 