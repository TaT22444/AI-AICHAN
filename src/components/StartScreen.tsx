import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningSession, AIPartner } from '../types';
import { aiPartners } from '../data/aiPartners';

interface StartScreenProps {
  onStartSession: (session: LearningSession) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartSession }) => {
  const navigate = useNavigate();
  const [task, setTask] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<AIPartner | null>(null);

  const handleStart = () => {
    if (!task.trim() || !selectedPartner) {
      alert('課題とAIパートナーを選んでください！');
      return;
    }

    const session: LearningSession = {
      id: Date.now().toString(),
      task: task.trim(),
      aiPartner: selectedPartner,
      messages: [],
      startTime: new Date(),
      selectedFeelings: []
    };

    onStartSession(session);
    navigate('/chat');
  };

  return (
    <div className="start-screen fade-in">
      <div className="card">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#667eea' }}>
          AIの"あいちゃん"と、わくわく相談ひろば
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            これからなにをがんばる？
          </h2>
          <textarea
            className="input-field"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例：算数の文章問題、読書感想文のアイデア出し..."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            AIパートナーを選んでね
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {aiPartners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                style={{
                  padding: '1.5rem',
                  border: `3px solid ${selectedPartner?.id === partner.id ? '#667eea' : '#e0e0e0'}`,
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedPartner?.id === partner.id ? '#f0f4ff' : 'white',
                  transform: selectedPartner?.id === partner.id ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  {partner.avatar}
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#333' }}>
                  {partner.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  {partner.character}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.4' }}>
                  {partner.personality}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleStart}
          disabled={!task.trim() || !selectedPartner}
          style={{
            fontSize: '1.2rem',
            padding: '15px 40px',
            opacity: (!task.trim() || !selectedPartner) ? 0.6 : 1,
            cursor: (!task.trim() || !selectedPartner) ? 'not-allowed' : 'pointer'
          }}
        >
          よし、はじめる！
        </button>
      </div>
    </div>
  );
};

export default StartScreen; 