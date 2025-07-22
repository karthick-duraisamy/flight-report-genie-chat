
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addMessage, setLoading, setCurrentSession, setInputValue } from '../store/slices/chatSlice';
import { addHistoryItem } from '../store/slices/historySlice';
import { useGetReportsQuery, useGetTemplatesQuery } from '../store/api/chatApi';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Send, Bot, User, Menu, Plus, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AirlineChatbot: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, isLoading, inputValue, currentSession } = useSelector((state: RootState) => state.chat);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data: reports } = useGetReportsQuery();
  const { data: templates } = useGetTemplatesQuery();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
    dispatch(setInputValue(''));
    dispatch(setLoading(true));

    // Simulate API response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about: "${inputValue}". As your Airline Report Assistant, I can help you with flight schedules, passenger analytics, route performance, and operational reports. What specific information would you like me to analyze?`,
        role: 'assistant',
        timestamp: new Date(),
      };
      dispatch(addMessage(botMessage));
      dispatch(setLoading(false));
    }, 1500);

    // Add to history
    if (!currentSession) {
      const sessionId = Date.now().toString();
      dispatch(setCurrentSession(sessionId));
      dispatch(addHistoryItem({
        id: sessionId,
        title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : ''),
        date: new Date(),
        messageCount: 1,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    dispatch(setCurrentSession(null));
    // Clear messages would be handled by chatSlice
  };

  return (
    <div className="chatbot-container">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="chatbot-sidebar"
          >
            <div className="sidebar-header">
              <Button
                onClick={startNewChat}
                className="new-chat-btn"
              >
                <Plus size={16} />
                New Chat
              </Button>
            </div>

            <ScrollArea className="sidebar-content">
              <div className="chat-history">
                <h3 className="history-title">Recent Conversations</h3>
                {[1, 2, 3].map((item) => (
                  <div key={item} className="history-item">
                    <MessageSquare size={14} />
                    <span>Flight Analytics Report {item}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className={`chat-main ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        {/* Header */}
        <div className="chat-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle"
          >
            <Menu size={20} />
          </Button>
          <h1 className="chat-title">✈️ Airline Report Assistant</h1>
        </div>

        {/* Messages Area */}
        <ScrollArea className="messages-container">
          <div className="messages-wrapper">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="welcome-screen"
                >
                  <div className="welcome-icon">✈️</div>
                  <h2 className="welcome-title">Welcome to Airline Report Assistant</h2>
                  <p className="welcome-description">
                    I can help you analyze flight data, generate reports, and provide insights about airline operations.
                  </p>
                  <div className="example-prompts">
                    <div className="example-prompt">📊 "Show me passenger analytics for this month"</div>
                    <div className="example-prompt">🛫 "Generate a route performance report"</div>
                    <div className="example-prompt">📈 "What are the trending flight patterns?"</div>
                  </div>
                </motion.div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`message ${message.role}`}
                  >
                    <div className="message-avatar">
                      {message.role === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.content}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="message assistant"
              >
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => dispatch(setInputValue(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder="Ask about airline reports, schedules, or analytics..."
              className="message-input"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="send-button"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineChatbot;
