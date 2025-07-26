import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningSession } from '../types';
import { generateSummary } from '../services/aiService';
import { feelings } from '../data/feelings';

interface SummaryScreenProps {
  session: LearningSession;
  onReset: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ session, onReset }) => {
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState('');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(true);

  useEffect(() => {
    const generateAISummary = async () => {
      setIsGeneratingSummary(true);
      try {
        const summary = generateSummary(session.messages, session.aiPartner);
        setAiSummary(summary);
      } catch (error) {
        console.error('Summary generation error:', error);
        setAiSummary('一生懸命に学習に取り組んでいました！');
      } finally {
        setIsGeneratingSummary(false);
      }
    };

    generateAISummary();
  }, [session]);

  const handleFeelingToggle = (feelingId: string) => {
    setSelectedFeelings(prev => 
      prev.includes(feelingId)
        ? prev.filter(id => id !== feelingId)
        : prev.length < 2
          ? [...prev, feelingId]
          : prev
    );
  };

  const handleGenerateReport = () => {
    if (selectedFeelings.length === 0) {
      alert('がんばったポイントを1つ以上選んでください！');
      return;
    }
    setShowReport(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewSession = () => {
    onReset();
    navigate('/');
  };

  const sessionDuration = session.endTime 
    ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)
    : 0;

  const messageCount = session.messages.length;

  return (
    <div className="summary-screen fade-in">
      {!showReport ? (
        <div className="card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#667eea' }}>
            学習のまとめ
          </h1>

          {/* AIからのまとめ */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
              {session.aiPartner.avatar} {session.aiPartner.name}からのメッセージ
            </h2>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '2px solid #e0e0e0'
            }}>
              {isGeneratingSummary ? (
                <div style={{ textAlign: 'center', color: '#666' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {session.aiPartner.avatar}
                  </div>
                  <p>まとめを作成中...</p>
                </div>
              ) : (
                <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                  <strong>きみは、こんなにがんばったね！</strong><br /><br />
                  {aiSummary}
                </div>
              )}
            </div>
          </div>

          {/* 気持ちの選択 */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
              がんばったポイントは？（1〜2個選んでね）
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {feelings.map((feeling) => (
                <button
                  key={feeling.id}
                  onClick={() => handleFeelingToggle(feeling.id)}
                  style={{
                    padding: '1rem',
                    border: `3px solid ${selectedFeelings.includes(feeling.id) ? '#667eea' : '#e0e0e0'}`,
                    borderRadius: '15px',
                    backgroundColor: selectedFeelings.includes(feeling.id) ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{feeling.emoji}</span>
                  <span>{feeling.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* レポート生成ボタン */}
          <button
            className="btn btn-primary"
            onClick={handleGenerateReport}
            disabled={selectedFeelings.length === 0}
            style={{
              fontSize: '1.2rem',
              padding: '15px 40px',
              opacity: selectedFeelings.length === 0 ? 0.6 : 1
            }}
          >
            先生に見せるレポートを完成させる
          </button>
        </div>
      ) : (
        /* レポート表示 */
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#667eea', marginBottom: '0.5rem' }}>
              学習レポート
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              {new Date().toLocaleDateString('ja-JP')}
            </p>
          </div>

          <div style={{ 
            border: '3px solid #667eea', 
            borderRadius: '20px', 
            padding: '2rem',
            backgroundColor: '#f8f9fa'
          }}>
            {/* 1. 取り組んだ課題 */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#667eea', 
                borderBottom: '2px solid #667eea',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}>
                1. 取り組んだ課題
              </h2>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                {session.task}
              </p>
            </div>

            {/* 2. AIからのまとめ */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#667eea', 
                borderBottom: '2px solid #667eea',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}>
                2. AIからのまとめ
              </h2>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '15px',
                border: '2px solid #e0e0e0'
              }}>
                <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                  <strong>きみは、こんなにがんばったね！</strong><br /><br />
                  {aiSummary}
                </div>
              </div>
            </div>

            {/* 3. 児童が選んだ気持ち */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                color: '#667eea', 
                borderBottom: '2px solid #667eea',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}>
                3. がんばったポイント
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {selectedFeelings.map((feelingId) => {
                  const feeling = feelings.find(f => f.id === feelingId);
                  return feeling ? (
                    <div
                      key={feeling.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.8rem 1.2rem',
                        backgroundColor: 'white',
                        borderRadius: '25px',
                        border: '2px solid #667eea',
                        fontSize: '1rem'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{feeling.emoji}</span>
                      <span>{feeling.text}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* 学習統計 */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '15px',
              border: '2px solid #e0e0e0',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>学習の記録</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {sessionDuration}分
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>学習時間</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {messageCount}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>やり取り回数</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {session.aiPartner.avatar}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>AIパートナー</div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            <button
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ fontSize: '1.1rem', padding: '12px 30px' }}
            >
              印刷する
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleNewSession}
              style={{ fontSize: '1.1rem', padding: '12px 30px' }}
            >
              新しい学習を始める
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryScreen; 