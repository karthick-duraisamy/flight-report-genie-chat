
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addMessage, setCurrentSession } from '@/store/slices/chatSlice';
import { addHistoryItem, updateHistoryTitle } from '@/store/slices/historySlice';
import { useGetReportsQuery, useGetTemplatesQuery } from '@/store/api/chatApi';
import { useTheme } from '@/hooks/useTheme';
import ThemeSelector from './ThemeSelector';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
}

const AirlineChatbot: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const { currentSession, messages } = useSelector((state: RootState) => state.chat);
  const { items: historyItems, isExpanded } = useSelector((state: RootState) => state.history);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const { data: reports } = useGetReportsQuery();
  const { data: templates } = useGetTemplatesQuery();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    chatInputRef.current?.focus();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
    const messageContent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response with animation delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Thank you for your inquiry. I\'m processing your airline report request...',
        timestamp: new Date(),
        data: reports?.[0], // Use first report as example
      };

      dispatch(addMessage(botMessage));
      setIsLoading(false);

      // Add to history if it's a new session
      if (!currentSession) {
        const sessionId = Date.now().toString();
        dispatch(setCurrentSession(sessionId));
        dispatch(addHistoryItem({
          id: sessionId,
          title: messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : ''),
          date: new Date(),
          messageCount: 2,
          lastMessage: botMessage.content.slice(0, 100) + '...'
        }));
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleHistoryItemClick = (itemId: string) => {
    dispatch(setCurrentSession(itemId));
    // In a real app, we would load the messages for this session
  };

  const handleHistoryTitleEdit = (itemId: string, newTitle: string) => {
    dispatch(updateHistoryTitle({ id: itemId, title: newTitle }));
    setEditingHistoryId(null);
  };

  const renderMessageContent = (message: Message) => {
    if (message.data && message.type === 'bot') {
      return (
        <div className="message-content">
          <p>{message.content}</p>
          {message.data.data && (
            <div className="table-container">
              <table className="chat-table">
                <thead>
                  <tr>
                    {Object.keys(message.data.data[0] || {}).map((header) => (
                      <th key={header}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {message.data.data.map((row: any, index: number) => (
                    <tr key={index}>
                      {Object.values(row).map((cell: any, cellIndex) => (
                        <td key={cellIndex}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    return <div className="message-content">{message.content}</div>;
  };

  return (
    <div className="whatsapp-container">
      {/* Sidebar */}
      <div className="whatsapp-sidebar">
        <div className="sidebar-header">
          <h2>Airline Assistant</h2>
        </div>

        <div className="recent-actions">
          <div className="section-header">
            <h3>Recent Actions</h3>
          </div>
          <div className="history-list">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className={`history-item ${currentSession === item.id ? 'active' : ''}`}
                onClick={() => handleHistoryItemClick(item.id)}
              >
                {editingHistoryId === item.id ? (
                  <input
                    className="history-title editing"
                    defaultValue={item.title}
                    onBlur={(e) => handleHistoryTitleEdit(item.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleHistoryTitleEdit(item.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div className="history-content">
                    <div
                      className="history-title"
                      onDoubleClick={() => setEditingHistoryId(item.id)}
                    >
                      {item.title}
                    </div>
                    <div className="history-preview">
                      {item.lastMessage || 'No messages yet'}
                    </div>
                    <div className="history-date">
                      {item.date.toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="whatsapp-chat-area">
        <div className="chat-header">
          <div className="header-left">
            <div className="contact-info">
              <h1 className="contact-name">Airline Report Assistant</h1>
              <span className="status">Online</span>
            </div>
          </div>
          <div className="header-right">
            <ThemeSelector />
          </div>
        </div>

        <div className="whatsapp-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-content">
                <h3>Welcome to Airline Report Assistant!</h3>
                <p>Ask me about airline reports, schedules, or analytics to get started.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`whatsapp-message ${message.type}`}
              >
                <div className="message-bubble">
                  {renderMessageContent(message)}
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="whatsapp-message bot">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="message-time">
                  {formatTime(new Date())}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="whatsapp-input">
          <div className="input-container">
            <input
              ref={chatInputRef}
              type="text"
              className="message-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineChatbot;
