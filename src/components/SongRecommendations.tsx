import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getRecommendations } from '../services/musicService';
import SongPlayer from './SongPlayer';

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
}

const Container = styled.div`
  margin-top: 2rem;
`;

const Title = styled.h2`
  color: #fff;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  color: #b3b3b3;
  text-align: center;
  margin: 1rem 0;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  margin: 1rem 0;
`;

const ShowMoreButton = styled.button`
  margin: 2rem auto 0 auto;
  display: block;
  background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 24px;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(30,60,114,0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #185a9d 0%, #43cea2 100%);
    box-shadow: 0 4px 16px 0 rgba(30,60,114,0.18);
    transform: translateY(-2px) scale(1.04);
  }
`;

interface SongRecommendationsProps {
  currentEmotion: string;
}

const SongRecommendations: React.FC<SongRecommendationsProps> = ({ currentEmotion }) => {
  const [songs, setSongs] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!currentEmotion) return;
    setLoading(true);
    setError(null);
    setSongs([]);
    setNextPageToken(undefined);
    getRecommendations(currentEmotion)
      .then((res) => {
        setSongs(res.videos);
        setNextPageToken(res.nextPageToken);
        setLoading(false);
        if (res.videos.length === 0) {
          setError('No recommendations received');
        }
      })
      .catch((err) => {
        setError('Error fetching recommendations');
        setLoading(false);
      });
  }, [currentEmotion]);

  const handleShowMore = () => {
    if (!nextPageToken) return;
    setLoading(true);
    getRecommendations(currentEmotion, nextPageToken)
      .then((res) => {
        setSongs((prev) => {
          const existingIds = new Set(prev.map((v) => v.videoId));
          const newUnique = res.videos.filter((v) => !existingIds.has(v.videoId));
          return [...prev, ...newUnique];
        });
        setNextPageToken(res.nextPageToken);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <Container>
      <Title>Songs recommended for your {currentEmotion} mood</Title>
      {loading && <LoadingMessage>Loading recommendations...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && <SongPlayer songs={songs} />}
      {!loading && nextPageToken && (
        <ShowMoreButton onClick={handleShowMore}>Show More</ShowMoreButton>
      )}
    </Container>
  );
};

export default SongRecommendations; 