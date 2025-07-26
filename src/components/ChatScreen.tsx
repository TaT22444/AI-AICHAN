import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningSession, Message } from '../types';
import { generateAIResponse } from '../services/aiService';
import { hintQuestions } from '../data/hints';

interface ChatScreenProps {
  session: LearningSession;
  onUpdateSession: (session: LearningSession) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ session, onUpdateSession }) => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...session.messages, userMessage];
    const updatedSession = { ...session, messages: updatedMessages };
    onUpdateSession(updatedSession);

    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(
        userMessage.text,
        session.aiPartner,
        updatedMessages
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      const finalSession = { ...session, messages: finalMessages };
      onUpdateSession(finalSession);
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHintClick = (hint: string) => {
    setInputMessage(hint);
    setShowHints(false);
  };

  const handleComplete = () => {
    const completedSession = {
      ...session,
      endTime: new Date()
    };
    onUpdateSession(completedSession);
    navigate('/summary');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-screen fade-in">
      <div className="card" style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* ヘッダー */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '1rem', 
          borderBottom: '2px solid #f0f0f0',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '2rem', marginRight: '1rem' }}>
            {session.aiPartner.avatar}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#333', margin: 0 }}>
              {session.aiPartner.name}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
              課題: {session.task}
            </p>
          </div>
        </div>

        {/* メッセージエリア */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {session.messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {session.aiPartner.avatar}
              </div>
              <p>こんにちは！一緒に頑張りましょう！</p>
              <p>何でも聞いてくださいね。</p>
            </div>
          )}

          {session.messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '1rem',
                  borderRadius: '20px',
                  backgroundColor: message.sender === 'user' ? '#667eea' : '#f0f0f0',
                  color: message.sender === 'user' ? 'white' : '#333',
                  position: 'relative'
                }}
              >
                {message.sender === 'ai' && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '-10px', 
                    left: '-10px',
                    fontSize: '1.5rem'
                  }}>
                    {session.aiPartner.avatar}
                  </div>
                )}
                <div style={{ 
                  paddingLeft: message.sender === 'ai' ? '1.5rem' : '0',
                  lineHeight: '1.5'
                }}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '20px',
                backgroundColor: '#f0f0f0',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                {session.aiPartner.name}が考え中...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ヒントボタン */}
        <div style={{ padding: '0 1rem 1rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowHints(!showHints)}
            style={{ marginBottom: '1rem', fontSize: '0.9rem' }}
          >
            なんて聞いたらいいかな？
          </button>

          {showHints && (
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>質問のヒント:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {hintQuestions.map((hint, index) => (
                  <button
                    key={index}
                    onClick={() => handleHintClick(hint)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #667eea',
                      borderRadius: '20px',
                      backgroundColor: 'white',
                      color: '#667eea',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#667eea';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '#667eea';
                    }}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 入力エリア */}
        <div style={{ 
          padding: '1rem',
          borderTop: '2px solid #f0f0f0',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          <textarea
            className="input-field"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            rows={1}
            style={{ flex: 1, resize: 'none' }}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{ 
              padding: '12px 20px',
              opacity: (!inputMessage.trim() || isLoading) ? 0.6 : 1
            }}
          >
            送信
          </button>
        </div>

        {/* 完了ボタン */}
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={handleComplete}
            style={{ fontSize: '1.1rem', padding: '12px 30px' }}
          >
            できた！学習完了
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen; 