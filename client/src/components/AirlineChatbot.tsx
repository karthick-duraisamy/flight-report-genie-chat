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
  const { items: historyItems } = useSelector((state: RootState) => state.history);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
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
          title: inputValue.slice(0, 50) + (inputValue.length > 50 ? '...' : ''),
          date: new Date(),
          messageCount: 2,
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
              <table className="ant-table">
                <thead className="ant-table-thead">
                  <tr>
                    {Object.keys(message.data.data[0] || {}).map((header) => (
                      <th key={header} className="ant-table-cell">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  {message.data.data.map((row: any, index: number) => (
                    <tr key={index}>
                      {Object.values(row).map((cell: any, cellIndex) => (
                        <td key={cellIndex} className="ant-table-cell">
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
    <div className="chatbot-container">
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>Airline Assistant</h2>
          <ThemeSelector />
        </div>

        <div className="history-list">
          <h3>Recent Conversations</h3>
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
                <div
                  className="history-title"
                  onDoubleClick={() => setEditingHistoryId(item.id)}
                >
                  {item.title}
                </div>
              )}
              <div className="history-date">
                {item.date.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="header-title">Airline Report Assistant</h1>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.type} message-enter`}
            >
              {renderMessageContent(message)}
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <div className="input-container">
            <input
              ref={chatInputRef}
              type="text"
              className="message-input"
              placeholder="Ask about airline reports, schedules, or analytics..."
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
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineChatbot;