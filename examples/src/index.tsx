import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <h1>Hello, World!</h1>;

createRoot(document.getElementById('app')!).render(<App />);
