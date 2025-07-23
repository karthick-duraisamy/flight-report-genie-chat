import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addMessage,
  setCurrentSession,
  loadConversationMessages,
} from "@/store/slices/chatSlice";
import { useGetReportsQuery, useGetTemplatesQuery } from "@/store/api/chatApi";
import { useTheme } from "@/hooks/useTheme";
import ThemeSelector from "./ThemeSelector";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  data?: any;
}

const AirlineChatbot: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const { currentSession, messages } = useState<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: reports } = useGetReportsQuery();
  const { data: templates } = useGetTemplatesQuery();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    chatInputRef.current?.focus();
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getUserInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedFile) || isLoading) return;

    let messageContent = inputValue.trim();
    let attachmentData = undefined;

    if (selectedFile) {
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(selectedFile);
      attachmentData = {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        fileUrl: fileUrl,
        isImage: selectedFile.type.startsWith("image/"),
        isPdf: selectedFile.type === "application/pdf",
      };

      if (!messageContent) {
        messageContent = `📎 Shared ${selectedFile.name}`;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageContent,
      timestamp: new Date(),
      data: attachmentData,
    };

    dispatch(addMessage(userMessage));
    setInputValue("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsLoading(true);

    // Simulate bot response with animation delay
    setTimeout(() => {
      // Simulate different types of AI responses
      let botContent = "";

      if (
        messageContent.toLowerCase().includes("table") ||
        messageContent.toLowerCase().includes("report")
      ) {
        // Table response
        botContent = JSON.stringify({
          type: "table",
          title: "Airline Performance Report",
          content: "<p>Here is the airline performance report:</p>",
          data: reports?.[0]?.data || [
            {
              Flight: "AA101",
              Route: "NYC-LAX",
              Status: "On Time",
              Passengers: 150,
            },
            {
              Flight: "AA102",
              Route: "LAX-NYC",
              Status: "Delayed",
              Passengers: 145,
            },
            {
              Flight: "AA103",
              Route: "NYC-MIA",
              Status: "On Time",
              Passengers: 160,
            },
          ],
        });
      } else if (
        messageContent.toLowerCase().includes("chart") ||
        messageContent.toLowerCase().includes("graph")
      ) {
        // Chart response
        botContent = JSON.stringify({
          type: "chart",
          content: "<p>Flight performance chart:</p>",
          data: {
            type: "bar",
            data: [
              { name: "On Time", value: 85, fill: "#10b981" },
              { name: "Delayed", value: 12, fill: "#f59e0b" },
              { name: "Cancelled", value: 3, fill: "#ef4444" },
            ],
            config: {
              title: "Flight Performance Analysis",
              showTooltip: true,
              showLegend: true,
            },
          },
        });
      } else {
        // HTML text response
        botContent = JSON.stringify({
          type: "html",
          content:
            "<p>Thank you for your inquiry. I'm processing your airline report request...</p><p><strong>Key Information:</strong></p><ul><li>✈️ Flight data available</li><li>📊 Analytics ready</li><li>📈 Reports generated</li></ul>",
        });
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botContent,
        timestamp: new Date(),
      };

      dispatch(addMessage(botMessage));
      setIsLoading(false);

      // Add to history if it's a new session
      if (!currentSession) {
        const sessionId = Date.now().toString();
        dispatch(setCurrentSession(sessionId));
        // dispatch(
        //   addHistoryItem({
        //     id: sessionId,
        //     title:
        //       messageContent.slice(0, 50) +
        //       (messageContent.length > 50 ? "..." : ""),
        //     date: new Date(),
        //     messageCount: 2,
        //     lastMessage: botMessage.content.slice(0, 100) + "...",
        //   }),
        // );
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleHistoryItemClick = (sessionId: string) => {
    setCurrentSession(sessionId);
    // Load messages for this session
    // This will be implemented when backend API is ready
  };

  const handleHistoryTitleEdit = (sessionId: string, newTitle: string) => {
    // if (newTitle.trim() && newTitle !== historyItems.find(item => item.id === sessionId)?.title) {
    //   dispatch(updateHistoryTitle({ id: sessionId, title: newTitle.trim() }));
    // }
    // setEditingHistoryId(null);
  };

  const handleNewChat = () => {
    // Clear current conversation context
    // setMessages([]);
    setCurrentSession(null);
    setInputValue('');
    setSelectedFile(null);
    setIsLoading(false);
    // Focus on input for immediate use
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
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
      fileInputRef.current.value = "";
    }
  };

  const downloadTableAsCSV = (
    tableData: any[],
    filename: string = "table-data",
  ) => {
    if (!tableData || tableData.length === 0) return;

    const headers = Object.keys(tableData[0]);
    const csvContent = [
      headers.join(","),
      ...tableData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            const escapedValue = String(value).replace(/"/g, '""');
            return escapedValue.includes(",")
              ? `"${escapedValue}"`
              : escapedValue;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTableAsExcel = (
    tableData: any[],
    filename: string = "table-data",
  ) => {
    if (!tableData || tableData.length === 0) return;

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert table data to worksheet
    const ws = XLSX.utils.json_to_sheet(tableData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Report Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const renderAvatar = (type: "user" | "bot") => {
    if (type === "user") {
      // Mock user name - in real app, get from user context/auth
      const userName = "John Doe"; // Replace with actual user name from authentication
      const userInitials = getUserInitials(userName);

      return (
        <div className="message-avatar user-avatar">
          <span className="avatar-initials">{userInitials}</span>
        </div>
      );
    } else {
      return (
        <div className="message-avatar bot-avatar">
          <div className="ai-avatar-animation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ai-icon">
              <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
            </svg>
            <div className="ai-pulse-ring"></div>
          </div>
        </div>
      );
    }
  };

  const renderChart = (chartData: any) => {
    if (!chartData || !chartData.type || !chartData.data) return null;

    const { type, data, config } = chartData;
    const chartTitle = config?.title || "";

    // Enhanced color palette for better visual distinction
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#00ff00",
      "#0088fe",
      "#ff8042",
      "#ffbb28",
      "#8dd1e1",
      "#d084d0",
    ];

    const renderChartComponent = () => {
      switch (type) {
        case "bar":
          return (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--whatsapp-border-color)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--whatsapp-text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--whatsapp-border-color)" }}
              />
              <YAxis
                tick={{ fill: "var(--whatsapp-text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--whatsapp-border-color)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--whatsapp-chat-bg)",
                  border: "1px solid var(--whatsapp-border-color)",
                  borderRadius: "6px",
                  color: "var(--whatsapp-text-primary)",
                }}
              />
              <Legend />
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          );
        case "line":
          return (
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--whatsapp-border-color)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--whatsapp-text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--whatsapp-border-color)" }}
              />
              <YAxis
                tick={{ fill: "var(--whatsapp-text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--whatsapp-border-color)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--whatsapp-chat-bg)",
                  border: "1px solid var(--whatsapp-border-color)",
                  borderRadius: "6px",
                  color: "var(--whatsapp-text-primary)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors[1]}
                strokeWidth={3}
                dot={{ fill: colors[1], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[1], strokeWidth: 2 }}
              />
            </LineChart>
          );
        case "area":
          return (
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--whatsapp-border-color)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--whatsapp-text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--whatsapp-border-color)" }}
              />
              <YAxis
                tick={{ fill: "var(--whatsapp-text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--whatsapp-border-color)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--whatsapp-chat-bg)",
                  border: "1px solid var(--whatsapp-border-color)",
                  borderRadius: "6px",
                  color: "var(--whatsapp-text-primary)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors[2]}
                fill={colors[2]}
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </AreaChart>
          );
        default:
          return (
            <div className="chart-placeholder">
              <p>Unsupported chart type: {type}</p>
            </div>
          );
      }
    };

    return (
      <div className="chart-container">
        {chartTitle && (
          <div className="chart-title">
            <h4>{chartTitle}</h4>
          </div>
        )}
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            {renderChartComponent()}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTable = (tableData: any, tableTitle?: string) => {
    if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
      return <p>No table data available</p>;
    }

    const headers = Object.keys(tableData[0] || {});
    const hasHorizontalScroll = headers.length > 5; // Support wide tables with many columns

    // Generate meaningful title based on content or use provided title
    const getTableTitle = () => {
      if (tableTitle) return tableTitle;

      // Infer title from table headers and content
      if (headers.some((h) => h.toLowerCase().includes("flight"))) {
        return "Airline Performance Report";
      } else if (headers.some((h) => h.toLowerCase().includes("passenger"))) {
        return "Passenger Analytics Report";
      } else if (headers.some((h) => h.toLowerCase().includes("route"))) {
        return "Route Performance Report";
      } else if (headers.some((h) => h.toLowerCase().includes("crew"))) {
        return "Crew Scheduling Report";
      } else {
        return "Airline Data Report";
      }
    };

    const reportTitle = getTableTitle();

    return (
      <div className="table-wrapper">
        <div className="table-header">
          <div className="table-info">
            <h4 className="table-title">{reportTitle}</h4>
          </div>
          <div className="table-actions">
            <button
              className="download-btn csv"
              onClick={() =>
                downloadTableAsCSV(
                  tableData,
                  reportTitle.toLowerCase().replace(/\s+/g, "-"),
                )
              }
              title="Download as CSV"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              CSV
            </button>
            <button
              className="download-btn excel"
              onClick={() =>
                downloadTableAsExcel(
                  tableData,
                  reportTitle.toLowerCase().replace(/\s+/g, "-"),
                )
              }
              title="Download as Excel"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              Excel
            </button>
          </div>
        </div>
        <div
          className={`table-container ${hasHorizontalScroll ? "horizontal-scroll" : ""}`}
        >
          <table className="chat-table">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row: any, index: number) => (
                <tr key={index}>
                  {headers.map((header, cellIndex) => (
                    <td key={cellIndex}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const parseAIResponse = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      // If not valid JSON, treat as plain text
      return { type: "text", content };
    }
  };

  const renderMessageContent = (message: Message) => {
    // Handle AI responses with JSON format
    if (message.type === "bot" && message.content) {
      const aiResponse = parseAIResponse(message.content);

      if (aiResponse.type) {
        switch (aiResponse.type) {
          case "text":
          case "html":
            return (
              <div className="message-content">
                <div
                  className="ai-html-content"
                  dangerouslySetInnerHTML={{ __html: aiResponse.content }}
                />
              </div>
            );

          case "table":
            return (
              <div className="message-content">
                {aiResponse.content && (
                  <div
                    className="ai-html-content"
                    dangerouslySetInnerHTML={{ __html: aiResponse.content }}
                  />
                )}
                {aiResponse.data &&
                  renderTable(aiResponse.data, aiResponse.title)}
              </div>
            );

          case "chart":
            return (
              <div className="message-content">
                {aiResponse.content && (
                  <div
                    className="ai-html-content"
                    dangerouslySetInnerHTML={{ __html: aiResponse.content }}
                  />
                )}
                {aiResponse.data && renderChart(aiResponse.data)}
              </div>
            );

          default:
            return (
              <div className="message-content">
                <div
                  className="ai-html-content"
                  dangerouslySetInnerHTML={{ __html: aiResponse.content }}
                />
              </div>
            );
        }
      }
    }

    // Handle legacy table data format
    if (message.data && message.type === "bot" && message.data.data) {
      return (
        <div className="message-content">
          <p>{message.content}</p>
          {renderTable(message.data.data, message.data.title)}
        </div>
      );
    }

    // Handle user messages with file attachments (no download option)
    if (message.data && message.type === "user") {
      return (
        <div className="message-content">
          <p>{message.content}</p>
          {message.data.isImage && (
            <div className="attachment-preview">
              <img
                src={message.data.fileUrl}
                alt={message.data.fileName}
                className="attached-image"
                onClick={() => window.open(message.data.fileUrl, "_blank")}
              />
              <div className="file-details">
                <span className="file-name">{message.data.fileName}</span>
                <span className="file-size">
                  ({(message.data.fileSize / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}
          {message.data.isPdf && (
            <div className="attachment-preview">
              <div className="pdf-preview">
                <div className="pdf-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{message.data.fileName}</span>
                  <span className="file-size">
                    ({(message.data.fileSize / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            </div>
          )}
          {message.data && !message.data.isImage && !message.data.isPdf && (
            <div className="attachment-preview">
              <div className="file-preview">
                <div className="file-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{message.data.fileName}</span>
                  <span className="file-size">
                    ({(message.data.fileSize / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Handle bot messages with file attachments (with download option)
    if (message.data && message.type === "bot") {
      return (
        <div className="message-content">
          <p>{message.content}</p>
          {message.data.isImage && (
            <div className="attachment-preview">
              <img
                src={message.data.fileUrl}
                alt={message.data.fileName}
                className="attached-image"
                onClick={() => window.open(message.data.fileUrl, "_blank")}
              />
              <div className="file-details">
                <span className="file-name">{message.data.fileName}</span>
                <span className="file-size">
                  ({(message.data.fileSize / 1024).toFixed(1)} KB)
                </span>
                <button
                  className="download-file-btn"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = message.data.fileUrl;
                    link.download = message.data.fileName;
                    link.click();
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          )}
          {message.data.isPdf && (
            <div className="attachment-preview">
              <div className="pdf-preview">
                <div className="pdf-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{message.data.fileName}</span>
                  <span className="file-size">
                    ({(message.data.fileSize / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    className="download-file-btn"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = message.data.fileUrl;
                      link.download = message.data.fileName;
                      link.click();
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
          {message.data && !message.data.isImage && !message.data.isPdf && (
            <div className="attachment-preview">
              <div className="file-preview">
                <div className="file-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{message.data.fileName}</span>
                  <span className="file-size">
                    ({(message.data.fileSize / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    className="download-file-btn"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = message.data.fileUrl;
                      link.download = message.data.fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
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
            {/* {historyItems.map((item) => (
              <div
                key={item.id}
                className={`history-item ${currentSession === item.id ? "active" : ""}`}
                onClick={() => handleHistoryItemClick(item.id)}
              >
                {editingHistoryId === item.id ? (
                  <input
                    className="history-title editing"
                    defaultValue={item.title}
                    onBlur={(e) =>
                      handleHistoryTitleEdit(item.id, e.target.value)
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
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
                      {item.lastMessage || "No messages yet"}
                    </div>
                    <div className="history-date">
                      {item.date.toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="whatsapp-chat-area">
        <div className="chat-header">
          <div className="header-left">
            <div className="contact-info">
              <h1 className="contact-name">Airline Report Assistant</h1>
              <span className={`status ${isOnline ? "online" : "offline"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
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
                <p>
                  Ask me about airline reports, schedules, or analytics to get
                  started.
                </p>
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
              {renderAvatar("bot")}
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="message-time">{formatTime(new Date())}</div>
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
              style={{ display: "none" }}
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.svg,.webp,.mp4,.mp3,.zip,.rar,.xlsx,.csv"
            />
            <button
              className="attachment-button"
              onClick={handleAttachmentClick}
              disabled={isLoading}
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
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