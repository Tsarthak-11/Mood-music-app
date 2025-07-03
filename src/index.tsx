import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
 
// Initialize TensorFlow.js backends
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
const initTensorFlow = async () => {
  try {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('TensorFlow.js initialized with backend:', tf.getBackend());
  } catch (error) {
    console.error('Error initializing TensorFlow.js:', error);
    // Fallback to WASM
    try {
      await tf.setBackend('wasm');
      await tf.ready();
      console.log('TensorFlow.js initialized with WASM backend');
    } catch (wasmError) {
      console.error('Error initializing TensorFlow.js WASM backend:', wasmError);
    }
  }
};

// Initialize TensorFlow.js before rendering the app
initTensorFlow().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
