import React, { useState } from 'react';
import styled from 'styled-components';

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
}

interface SongPlayerProps {
  songs: YouTubeVideo[];
}

const SongGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem 2rem;
  margin: 2.5rem auto 0 auto;
  max-width: 1200px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    max-width: 98vw;
    gap: 1.5rem 0.5rem;
    justify-items: center;
  }
`;

const SongCard = styled.div`
  background: rgba(255,255,255,0.85);
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(109,74,255,0.08);
  padding: 1.2rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  max-width: 320px;
  min-width: 0;
  word-break: break-word;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 32px 0 rgba(109,74,255,0.16);
    transform: translateY(-4px) scale(1.04);
  }
`;

const SongImage = styled.img`
  width: 100%;
  max-width: 280px;
  height: 160px;
  object-fit: cover;
  border-radius: 14px;
`;

const SongTitle = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  margin: 0.7rem 0 0.3rem 0;
  text-align: center;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerWrapper = styled.div`
  margin-top: 0;
  width: 100%;
  max-width: 260px;
  aspect-ratio: 16 / 9;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResponsiveIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
  position: absolute;
  top: 0;
  left: 0;
`;

const SongPlayer: React.FC<SongPlayerProps> = ({ songs }) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  return (
    <SongGrid>
      {songs.map((song) => (
        <SongCard key={song.videoId} onClick={() => setPlayingVideoId(song.videoId)} title={song.title}>
          {playingVideoId === song.videoId ? (
            <PlayerWrapper>
              <ResponsiveIframe
                src={`https://www.youtube.com/embed/${song.videoId}`}
                title={song.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </PlayerWrapper>
          ) : (
            <SongImage src={song.thumbnail} alt={song.title} />
          )}
          <SongTitle title={song.title}>{song.title}</SongTitle>
        </SongCard>
      ))}
    </SongGrid>
  );
};

export default SongPlayer; 