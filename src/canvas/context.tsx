import { createContext } from 'react';

import {
  CanvasContextValuePopulated,
  CanvasContextValueUnpopulated,
} from './types';

export const CanvasContext = createContext<
  CanvasContextValueUnpopulated | CanvasContextValuePopulated | null
>(null);
