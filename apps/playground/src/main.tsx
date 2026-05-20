import './reset.css';

import { createRoot } from 'react-dom/client';

import { App } from './app';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('Root container #root not found in index.html');
}

createRoot(container).render(<App />);
