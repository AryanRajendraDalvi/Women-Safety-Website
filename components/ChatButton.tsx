"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Shield, Heart } from 'lucide-react'
import SOSChatbot from './SOSChatbot'

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsChatOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-16 h-16 shadow-2xl border-2 border-white/20 hover:scale-110 transition-all duration-200"
          aria-label="Open SafeSpace Companion"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-48 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-sm">SafeSpace Companion</span>
          </div>
          <p className="text-xs text-gray-600">
            Confidential support for workplace safety. Click to chat with your AI companion.
          </p>
        </div>
      </div>

      {/* Chatbot Component */}
      <SOSChatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  )
} 