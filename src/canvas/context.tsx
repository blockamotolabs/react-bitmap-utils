import { createContext } from 'react';

import { CanvasContextValue } from './types';

export const CanvasContext = createContext<CanvasContextValue | null>(null);
