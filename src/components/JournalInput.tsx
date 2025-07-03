import React, { useState, useEffect } from 'react';
import styled from 'styled-components';     //  cd\MyReact\mood-music-app

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const SentimentDisplay = styled.div`
  color: #1DB954;
  font-style: italic;
  text-align: center;
`;

const JournalInput: React.FC = () => {
  const [text, setText] = useState('');
  const [sentimentScore, setSentimentScore] = useState(0);

  const analyzeSentiment = (text: string): number => {
    // Simple sentiment analysis based on positive and negative words
    const positiveWords = ['happy', 'joy', 'love', 'great', 'wonderful', 'excellent', 'amazing', 'beautiful', 'fantastic', 'good'];
    const negativeWords = ['sad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'bad', 'disappointing', 'upset', 'depressed'];

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });

    // Normalize score between -1 and 1
    return Math.max(-1, Math.min(1, score / 5));
  };

  useEffect(() => {
    if (text.trim()) {
      const score = analyzeSentiment(text);
      setSentimentScore(score);
    } else {
      setSentimentScore(0);
    }
  }, [text]);

  return (
    <Container>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write about your day, your feelings, or anything on your mind..."
      />
      {text.trim() && (
        <SentimentDisplay>
          Sentiment: {sentimentScore > 0 ? 'Positive' : sentimentScore < 0 ? 'Negative' : 'Neutral'}
        </SentimentDisplay>
      )}
    </Container>
  );
};

export default JournalInput; 