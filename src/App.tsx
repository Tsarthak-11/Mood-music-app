import React, { useState, useEffect } from 'react';
import './App.css';
import WebcamCapture from './components/WebcamCapture';
import SongRecommendations from './components/SongRecommendations';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState<string>('');

  useEffect(() => {
    const handleEmotionDetected = (event: CustomEvent) => {
      console.log('Emotion detected:', event.detail);
      setCurrentEmotion(event.detail);
    };

    window.addEventListener('emotionDetected', handleEmotionDetected as EventListener);

    return () => {
      window.removeEventListener('emotionDetected', handleEmotionDetected as EventListener);
    };
  }, []);

  // Set body class for animated background based on emotion
  useEffect(() => {
    const body = document.body;
    body.classList.remove('bg-happy', 'bg-sad');
    if (currentEmotion === 'happy') {
      body.classList.add('bg-happy');
    } else if (currentEmotion === 'sad') {
      body.classList.add('bg-sad');
  }
    // Remove on unmount
    return () => {
      body.classList.remove('bg-happy', 'bg-sad');
    };
  }, [currentEmotion]);

  // Generate random stars for the background
  // const stars = Array.from({ length: 60 }).map((_, i) => (
  //   <span
  //     key={i}
  //     style={{
  //       left: `${Math.random() * 100}vw`,
  //       top: `${Math.random() * 100}vh`,
  //       animationDelay: `${Math.random() * 2}s`,
  //     }}
  //   />
  // ));

  return (
    <div className="App">
      {/* Abstract blurred shapes for extra depth */}
      <div className="bg-abstract bg-circle1" />
      <div className="bg-abstract bg-circle2" />
      <div className="bg-abstract bg-line1" />
      <div className="bg-abstract bg-line2" />
      {/* Top left and right decorative waves (original size) */}
      <div className="bg-wave-topleft">
        <svg viewBox="0 0 600 120" width="320" height="120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveTopLeftGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#e85d8e" />
            </linearGradient>
          </defs>
          <path fill="url(#waveTopLeftGradient)" fillOpacity="0.13" d="M0,80 Q120,40 300,80 T600,60 L600,0 L0,0 Z" />
        </svg>
      </div>
      <div className="bg-wave-topright">
        <svg viewBox="0 0 600 120" width="320" height="120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveTopRightGradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#e85d8e" />
            </linearGradient>
          </defs>
          <path fill="url(#waveTopRightGradient)" fillOpacity="0.13" d="M0,60 Q180,100 300,80 T600,80 L600,0 L0,0 Z" />
        </svg>
      </div>
      {/* Modern, music-themed stickers in corners only */}
      {/* Top left: Musical note cluster */}
      <div className="bg-sticker-corner bg-sticker-notecluster">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#e85d8e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 38a5 5 0 1 1-3.5-4.8V16.5l18-3.5v18.5a5 5 0 1 1-3.5-4.8" />
          <circle cx="14" cy="38" r="5" />
          <circle cx="29" cy="38" r="5" />
        </svg>
      </div>
      {/* Bottom left: Piano keys */}
      <div className="bg-sticker-corner bg-sticker-piano">
        <svg width="60" height="44" viewBox="0 0 60 44" fill="none" stroke="#e85d8e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="8" width="52" height="32" rx="4" />
          <rect x="8" y="12" width="6" height="20" rx="2" fill="#fff" />
          <rect x="18" y="12" width="6" height="20" rx="2" fill="#fff" />
          <rect x="28" y="12" width="6" height="20" rx="2" fill="#fff" />
          <rect x="38" y="12" width="6" height="20" rx="2" fill="#fff" />
          <rect x="48" y="12" width="6" height="20" rx="2" fill="#fff" />
        </svg>
      </div>
      {/* Right side: Headphones sticker */}
      <div className="bg-sticker-headphones2">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#e85d8e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 32v-4a16 16 0 1 1 32 0v4" />
          <rect x="4" y="32" width="8" height="12" rx="4" />
          <rect x="36" y="32" width="8" height="12" rx="4" />
        </svg>
      </div>
      {/* Right side: Waveform sticker */}
      <div className="bg-sticker-waveform2">
        <svg width="56" height="24" viewBox="0 0 56 24" fill="none" stroke="#e85d8e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,12 8,12 12,2 16,22 20,12 24,18 28,6 32,22 36,8 40,20 44,12 48,16 54,12" />
        </svg>
      </div>
      {/* Animated gradient waves background */}
      <div className="bg-waves">
        <svg viewBox="0 0 1440 320" width="100%" height="320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e85d8e" />
              <stop offset="100%" stopColor="#6b1e23" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#e85d8e" />
            </linearGradient>
          </defs>
          <path className="wave1" fill="url(#waveGradient1)" fillOpacity="0.22" d="M0,160L60,170C120,180,240,200,360,192C480,184,600,144,720,128C840,112,960,120,1080,128C1200,136,1320,144,1380,148L1440,152L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path className="wave2" fill="url(#waveGradient2)" fillOpacity="0.18" d="M0,200L80,210C160,220,320,240,480,232C640,224,800,184,960,176C1120,168,1280,192,1360,204L1440,216L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
        </svg>
      </div>
      {/* Main content */}
      <header className="App-header">
        <h1 className="App-title">Mood Music App</h1>
        <p className="App-subtitle">Discover music that matches your mood</p>
      </header>
      <div className="container">
        <WebcamCapture />
        {currentEmotion && (
          <SongRecommendations currentEmotion={currentEmotion} />
        )}
      </div>
    </div>
  );
}

export default App; 