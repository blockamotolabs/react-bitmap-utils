import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface TextProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  fontVariant?: 'normal' | 'small-caps';
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center';
  verticalAlign?:
    | 'top'
    | 'hanging'
    | 'middle'
    | 'alphabetic'
    | 'ideographic'
    | 'bottom';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  children: number | string | readonly (number | string)[];
}

export const Text = CanvasElementType.Text;
