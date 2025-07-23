
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addMessage, setCurrentSession, loadConversationMessages } from '@/store/slices/chatSlice';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if ((!inputValue.trim() && !selectedFile) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim() || (selectedFile ? `📎 ${selectedFile.name}` : ''),
      timestamp: new Date(),
      data: selectedFile ? { fileName: selectedFile.name, fileSize: selectedFile.size } : undefined,
    };

    dispatch(addMessage(userMessage));
    const messageContent = inputValue.trim();
    setInputValue('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    dispatch(loadConversationMessages(itemId));
  };

  const handleHistoryTitleEdit = (itemId: string, newTitle: string) => {
    dispatch(updateHistoryTitle({ id: itemId, title: newTitle }));
    setEditingHistoryId(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderAvatar = (type: 'user' | 'bot') => {
    if (type === 'user') {
      return (
        <div className="message-avatar user-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="message-avatar bot-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
          </svg>
        </div>
      );
    }
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
                {renderAvatar(message.type)}
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
              {renderAvatar('bot')}
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
          {selectedFile && (
            <div className="attachment-preview">
              <div className="file-info">
                <span className="file-icon">📎</span>
                <span className="file-name">{selectedFile.name}</span>
                <button 
                  className="remove-file"
                  onClick={removeSelectedFile}
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          <div className="input-container">
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />
            <button
              className="attachment-button"
              onClick={handleAttachmentClick}
              disabled={isLoading}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
              </svg>
            </button>
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
              disabled={(!inputValue.trim() && !selectedFile) || isLoading}
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
