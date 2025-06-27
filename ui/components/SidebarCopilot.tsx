import React, { useState, useRef, useEffect } from 'react';

interface ParsedData {
  carrier: string;
  premium: number;
  commission: number;
  lives: number;
  month: string;
  fileName: string;
  fileType: string;
  confidence: number;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SidebarCopilotProps {
  className?: string;
  parsedData?: ParsedData[];
}

const SidebarCopilot: React.FC<SidebarCopilotProps> = ({ 
  className = '', 
  parsedData = [] 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Need help? Ask me anything about a statement.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update welcome message when parsed data is available
  useEffect(() => {
    if (parsedData.length > 0) {
      const totalCommission = parsedData.reduce((sum, data) => sum + data.commission, 0);
      const totalPremium = parsedData.reduce((sum, data) => sum + data.premium, 0);
      const totalLives = parsedData.reduce((sum, data) => sum + data.lives, 0);
      
      const welcomeMessage: Message = {
        id: 'welcome-update',
        text: `Great! I can see ${parsedData.length} statement(s) with $${totalCommission.toLocaleString()} in commissions, $${totalPremium.toLocaleString()} in premium, and ${totalLives.toLocaleString()} total lives. Ask me anything about this data!`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        // Replace the first message if it's the default welcome
        if (prev[0]?.id === '1') {
          return [welcomeMessage, ...prev.slice(1)];
        }
        return prev;
      });
    }
  }, [parsedData]);

  const generateContextAwareResponse = (userQuestion: string): string => {
    if (parsedData.length === 0) {
      return "I don't see any parsed data yet. Please upload and process some statements first!";
    }

    const question = userQuestion.toLowerCase();
    
    // Context-aware responses based on parsed data
    if (question.includes('total') || question.includes('sum')) {
      const totalCommission = parsedData.reduce((sum, data) => sum + data.commission, 0);
      const totalPremium = parsedData.reduce((sum, data) => sum + data.premium, 0);
      return `Total commissions: $${totalCommission.toLocaleString()}\nTotal premium: $${totalPremium.toLocaleString()}`;
    }
    
    if (question.includes('carrier') || question.includes('carriers')) {
      const carriers = Array.from(new Set(parsedData.map(data => data.carrier)));
      return `I found data from ${carriers.length} carrier(s): ${carriers.join(', ')}`;
    }
    
    if (question.includes('month') || question.includes('period')) {
      const months = Array.from(new Set(parsedData.map(data => data.month)));
      return `Statements cover these periods: ${months.join(', ')}`;
    }
    
    if (question.includes('commission') || question.includes('rate')) {
      const avgRate = parsedData.reduce((sum, data) => sum + (data.commission / data.premium), 0) / parsedData.length;
      return `Average commission rate across all statements: ${(avgRate * 100).toFixed(1)}%`;
    }
    
    if (question.includes('lives') || question.includes('subscribers')) {
      const totalLives = parsedData.reduce((sum, data) => sum + data.lives, 0);
      return `Total lives covered: ${totalLives.toLocaleString()}`;
    }
    
    // Default response with available data summary
    const totalCommission = parsedData.reduce((sum, data) => sum + data.commission, 0);
    return `I can see ${parsedData.length} statement(s) with $${totalCommission.toLocaleString()} in total commissions. What specific information would you like to know about this data?`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Generate context-aware response
    setTimeout(() => {
      const response = generateContextAwareResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`sidebar-copilot ${className}`}>
      <div className="sidebar-header">
        <div className="header-content">
          <div className="copilot-icon">🤖</div>
          <h3>AI Assistant</h3>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="loading-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your uploaded files..."
            className="message-input"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .sidebar-copilot {
          position: fixed;
          top: 0;
          right: 0;
          width: 350px;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .sidebar-header {
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .copilot-icon {
          font-size: 24px;
        }

        .header-content h3 {
          margin: 0;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .messages-container {
          flex: 1;
          overflow: hidden;
          padding: 16px;
        }

        .messages-list {
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .messages-list::-webkit-scrollbar {
          width: 6px;
        }

        .messages-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .messages-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .message {
          display: flex;
          margin-bottom: 8px;
        }

        .user-message {
          justify-content: flex-end;
        }

        .bot-message {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
        }

        .user-message .message-content {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          border-bottom-right-radius: 4px;
        }

        .bot-message .message-content {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border-bottom-left-radius: 4px;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          text-align: right;
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 0;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .input-container {
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .input-form {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          font-size: 14px;
          resize: none;
          outline: none;
          font-family: inherit;
        }

        .message-input:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }

        .message-input::placeholder {
          color: #666;
        }

        .send-button {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          background: white;
          transform: scale(1.05);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .sidebar-copilot {
            width: 100%;
            height: 100vh;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarCopilot; 