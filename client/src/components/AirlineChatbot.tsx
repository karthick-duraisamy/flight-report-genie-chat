import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, List, Avatar, Typography, Space, Spin, Tooltip, Table, Dropdown, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, DownloadOutlined, FileExcelOutlined, FileOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isHTML?: boolean;
  tableData?: any[];
  tableColumns?: any[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

const AirlineChatbot: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentConversation]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Report Request',
      messages: [{
        id: Date.now().toString(),
        type: 'bot',
        content: 'Hello! I\'m your airline report assistant. I can help you generate detailed reports by walking through the process conversationally. What type of report would you like to create today?',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      lastActivity: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation.id);
  };

  const getCurrentMessages = (): Message[] => {
    if (!currentConversation) return [];
    return conversations.find(c => c.id === currentConversation)?.messages || [];
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastActivity: new Date(),
          title: conv.messages.length === 1 ? message.content.slice(0, 50) + '...' : conv.title
        };
      }
      return conv;
    }));
  };

  const simulateBackendResponse = async (userMessage: string): Promise<Omit<Message, 'id' | 'timestamp'>> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock different types of responses
    if (userMessage.toLowerCase().includes('report') || userMessage.toLowerCase().includes('generate')) {
      const mockTableData = [
        { key: '1', groupId: 'GRP001', groupName: 'Business Travel Team', requestType: 'Group Booking', tripType: 'Round Trip', currency: 'USD', requestedFare: 2500, status: 'Approved' },
        { key: '2', groupId: 'GRP002', groupName: 'Conference Attendees', requestType: 'Bulk Booking', tripType: 'One Way', currency: 'EUR', requestedFare: 1800, status: 'Pending' },
        { key: '3', groupId: 'GRP003', groupName: 'Sales Team', requestType: 'Corporate Booking', tripType: 'Round Trip', currency: 'GBP', requestedFare: 3200, status: 'Approved' },
      ];

      const mockTableColumns = [
        { title: 'Group ID', dataIndex: 'groupId', key: 'groupId' },
        { title: 'Group Name', dataIndex: 'groupName', key: 'groupName' },
        { title: 'Request Type', dataIndex: 'requestType', key: 'requestType' },
        { title: 'Trip Type', dataIndex: 'tripType', key: 'tripType' },
        { title: 'Currency', dataIndex: 'currency', key: 'currency' },
        { title: 'Requested Fare', dataIndex: 'requestedFare', key: 'requestedFare', render: (value: number, record: any) => `${record.currency} ${value}` },
        { title: 'Status', dataIndex: 'status', key: 'status' },
      ];

      return {
        type: 'bot',
        content: 'Here\'s your airline report based on your criteria. The table below shows the filtered results:',
        tableData: mockTableData,
        tableColumns: mockTableColumns
      };
    }

    // Default response
    const responses = [
      'I understand you\'re looking for airline report information. Could you please specify what type of report you need? For example: Group bookings, fare analysis, or passenger manifests?',
      'Great! To generate an accurate report, I\'ll need a few details. What date range are you interested in?',
      'Perfect! I can help you with that. Would you like to filter by any specific criteria such as sector, currency, or agent?',
      'Let me gather that information for you. Are there any specific fields you\'d like to include in your report?'
    ];

    return {
      type: 'bot',
      content: responses[Math.floor(Math.random() * responses.length)]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!currentConversation) {
      createNewConversation();
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    });

    try {
      // Simulate backend call
      const botResponse = await simulateBackendResponse(userMessage);
      addMessage(botResponse);
    } catch (error) {
      addMessage({
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const downloadData = (format: 'excel' | 'csv', data: any[]) => {
    if (!data || data.length === 0) {
      message.warning('No data to download');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const fileName = `airline_report_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}`;
    
    if (format === 'excel') {
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } else {
      XLSX.writeFile(workbook, `${fileName}.csv`);
    }

    message.success(`Report downloaded as ${format.toUpperCase()}`);
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.type === 'user';
    
    return (
      <div key={msg.id} style={{ 
        display: 'flex', 
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16 
      }}>
        <div style={{ 
          maxWidth: '70%',
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: isUser ? 'row-reverse' : 'row',
          gap: 8
        }}>
          <Avatar 
            size="small" 
            icon={isUser ? <UserOutlined /> : <RobotOutlined />}
            style={{ 
              backgroundColor: isUser ? '#1890ff' : '#52c41a',
              flexShrink: 0
            }}
          />
          <div style={{
            backgroundColor: isUser ? '#1890ff' : '#f6f6f6',
            color: isUser ? 'white' : 'black',
            padding: '8px 12px',
            borderRadius: '12px',
            borderTopLeftRadius: isUser ? '12px' : '4px',
            borderTopRightRadius: isUser ? '4px' : '12px',
            maxWidth: '100%'
          }}>
            {msg.isHTML ? (
              <div dangerouslySetInnerHTML={{ __html: msg.content }} />
            ) : (
              <Text style={{ color: isUser ? 'white' : 'inherit' }}>
                {msg.content}
              </Text>
            )}
            
            {msg.tableData && msg.tableColumns && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong style={{ color: isUser ? 'white' : 'inherit' }}>
                    Report Results ({msg.tableData.length} records)
                  </Text>
                  <Dropdown menu={{
                    items: [
                      {
                        key: 'excel',
                        label: 'Download Excel',
                        icon: <FileExcelOutlined />,
                        onClick: () => downloadData('excel', msg.tableData!)
                      },
                      {
                        key: 'csv',
                        label: 'Download CSV', 
                        icon: <FileOutlined />,
                        onClick: () => downloadData('csv', msg.tableData!)
                      }
                    ]
                  }}>
                    <Button 
                      type="primary" 
                      size="small" 
                      icon={<DownloadOutlined />}
                      style={{ backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : undefined }}
                    >
                      Download
                    </Button>
                  </Dropdown>
                </div>
                <Table 
                  dataSource={msg.tableData}
                  columns={msg.tableColumns}
                  size="small"
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: true }}
                />
              </div>
            )}
            
            <div style={{ 
              fontSize: '11px', 
              opacity: 0.7, 
              marginTop: 4,
              textAlign: isUser ? 'left' : 'right'
            }}>
              {dayjs(msg.timestamp).format('HH:mm')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredConversations = conversations.filter(conv => {
    const daysSinceActivity = dayjs().diff(dayjs(conv.lastActivity), 'day');
    return daysSinceActivity <= 14; // Keep conversations for 14 days
  });

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider 
        collapsible
        collapsed={siderCollapsed}
        onCollapse={setSiderCollapsed}
        width={280}
        style={{ 
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #d9d9d9'
        }}
      >
        <div style={{ padding: 16 }}>
          <Title level={5} style={{ margin: 0, textAlign: siderCollapsed ? 'center' : 'left' }}>
            {siderCollapsed ? <HistoryOutlined /> : 'Conversation History'}
          </Title>
          {!siderCollapsed && (
            <Button 
              type="primary" 
              block 
              style={{ marginTop: 8 }}
              onClick={createNewConversation}
            >
              New Report Request
            </Button>
          )}
        </div>
        
        {!siderCollapsed && (
          <List
            style={{ height: 'calc(100vh - 120px)', overflow: 'auto' }}
            dataSource={filteredConversations}
            renderItem={(conv) => (
              <List.Item
                style={{ 
                  padding: '8px 16px',
                  cursor: 'pointer',
                  backgroundColor: currentConversation === conv.id ? '#e6f7ff' : 'transparent',
                  borderLeft: currentConversation === conv.id ? '3px solid #1890ff' : '3px solid transparent'
                }}
                onClick={() => setCurrentConversation(conv.id)}
              >
                <List.Item.Meta
                  title={
                    <Text ellipsis style={{ fontSize: 14 }}>
                      {conv.title}
                    </Text>
                  }
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(conv.lastActivity).format('MMM D, HH:mm')}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Sider>

      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        {currentConversation ? (
          <>
            {/* Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #d9d9d9',
              backgroundColor: 'white'
            }}>
              <Title level={4} style={{ margin: 0 }}>
                ✈️ Airline Report Assistant
              </Title>
              <Text type="secondary">
                Generate comprehensive airline reports through conversation
              </Text>
            </div>

            {/* Messages */}
            <div style={{ 
              flex: 1, 
              padding: 24, 
              overflow: 'auto',
              backgroundColor: '#fafafa'
            }}>
              {getCurrentMessages().map(renderMessage)}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size="small" icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                    <div style={{
                      backgroundColor: '#f6f6f6',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      borderTopLeftRadius: '4px'
                    }}>
                      <Spin size="small" />
                      <Text style={{ marginLeft: 8 }}>Generating report...</Text>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ 
              padding: 16, 
              borderTop: '1px solid #d9d9d9',
              backgroundColor: 'white'
            }}>
              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  style={{ resize: 'none' }}
                  disabled={isLoading}
                />
                <Tooltip title="Send message">
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={isLoading}
                    disabled={!inputValue.trim()}
                    style={{ height: 'auto' }}
                  />
                </Tooltip>
              </Space.Compact>
            </div>
          </>
        ) : (
          // Welcome screen
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 48,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>✈️</div>
            <Title level={2}>Airline Report Assistant</Title>
            <Text type="secondary" style={{ fontSize: 16, marginBottom: 32, maxWidth: 480 }}>
              Welcome to your intelligent airline reporting system. Start a new conversation to generate 
              custom reports through our AI-powered chatbot interface.
            </Text>
            <Button type="primary" size="large" onClick={createNewConversation}>
              Start New Report Request
            </Button>
            
            <div style={{ marginTop: 48, maxWidth: 600 }}>
              <Title level={4}>What can I help you with?</Title>
              <Text type="secondary">
                • Generate group booking reports<br/>
                • Analyze fare trends and pricing<br/>
                • Create passenger manifests<br/>
                • Export data in Excel or CSV format<br/>
                • Filter by dates, sectors, currencies, and more
              </Text>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default AirlineChatbot;