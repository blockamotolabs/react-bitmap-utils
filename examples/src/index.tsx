import { Canvas } from '@bitmapland/react-bitmap-utils';
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <>
      <h1>Hello, World!</h1>
      <div style={{ width: 500, height: (500 / 16) * 9 }}>
        <Canvas></Canvas>
      </div>
    </>
  );
};

createRoot(document.getElementById('app')!).render(<App />);
