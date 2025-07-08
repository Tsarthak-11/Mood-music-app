import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as faceapi from 'face-api.js/dist/face-api.min.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  width: 100%;
`;

const WebcamContainer = styled.div`
  position: relative;
  width: 640px;
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 700px) {
    width: 98vw;
    max-width: 98vw;
    height: auto;
    min-width: 0;
  }
`;

const Video = styled.video`
  width: 640px;
  height: 480px;
  border-radius: 8px;
  margin-bottom: 0;
  background-color: #000;
  display: block;
  @media (max-width: 700px) {
    width: 98vw;
    max-width: 98vw;
    height: auto;
    min-width: 0;
  }
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
  pointer-events: none;
  @media (max-width: 700px) {
    width: 98vw;
    max-width: 98vw;
    height: auto;
    min-width: 0;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #1db954;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 18px;
  margin-bottom: 0;
  align-self: center;
  @media (max-width: 700px) {
    width: 90vw;
    max-width: 320px;
    font-size: 1.1rem;
    padding: 12px 0;
  }
`;

const Status = styled.div`
  margin-top: 10px;
  color: #666;
  text-align: center;
`;

const WebcamCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('Click "Start Analysis" to begin');
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus('Loading face detection models...');
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        setStatus('Models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
        setStatus('Error loading models. Please refresh the page.');
      }
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setStatus('Error accessing webcam. Please check your camera permissions.');
    }
  };

  const stopVideo = (clearStream = false) => {
    if (videoRef.current && videoRef.current.srcObject) {
      if (clearStream) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      } else {
        // Just pause the video, keep the last frame
        videoRef.current.pause();
      }
    }
  };

  const detectEmotions = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        let dominantEmotion = Object.entries(expressions)
          .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        // Prefer sad or happy over neutral if both are present
        if (dominantEmotion === 'neutral') {
          if ('sad' in expressions) {
            dominantEmotion = 'sad';
          } else if ('happy' in expressions) {
            dominantEmotion = 'happy';
          }
        }
        setLastDetectedEmotion(dominantEmotion);
        // Draw detections on canvas
        const displaySize = { width: 640, height: 480 };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      }
    } catch (error) {
      console.error('Error detecting emotions:', error);
    }
  };

  const toggleAnalysis = async () => {
    if (!isAnalyzing) {
      await startVideo();
      setIsAnalyzing(true);
      setStatus('Analysis in progress...');
      intervalRef.current = setInterval(detectEmotions, 1000);
    } else {
      stopVideo(false); // Only pause, don't clear stream
      setIsAnalyzing(false);
      setStatus('Analysis stopped');
      if (lastDetectedEmotion) {
        // Dispatch custom event with the last detected emotion
        const event = new CustomEvent('emotionDetected', {
          detail: lastDetectedEmotion
        });
        window.dispatchEvent(event);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  // On unmount, clear the stream
  useEffect(() => {
    return () => {
      stopVideo(true);
    };
  }, []);

  return (
    <Container>
      <WebcamContainer>
        <Video
          ref={videoRef}
          autoPlay
          muted
          playsInline
        />
        <Canvas ref={canvasRef} />
      </WebcamContainer>
      <Button onClick={toggleAnalysis}>
        {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
      </Button>
      <Status>{status}</Status>
    </Container>
  );
};

export default WebcamCapture;
