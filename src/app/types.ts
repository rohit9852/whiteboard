export type Tool =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'text'
  | 'sticky';

export interface Point {
  x: number;
  y: number;
}

export type ElementType =
  | 'stroke'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'text'
  | 'sticky';

export interface StrokeElement {
  id: string;
  type: 'stroke';
  points: Point[];
  color: string;
  lineWidth: number;
  opacity: number;
}

export interface RectangleElement {
  id: string;
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  lineWidth: number;
  fill: string | null;
  opacity: number;
}

export interface CircleElement {
  id: string;
  type: 'circle';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: string;
  lineWidth: number;
  fill: string | null;
  opacity: number;
}

export interface LineElement {
  id: string;
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  lineWidth: number;
  opacity: number;
}

export interface ArrowElement {
  id: string;
  type: 'arrow';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  lineWidth: number;
  opacity: number;
}

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  opacity: number;
}

export interface StickyElement {
  id: string;
  type: 'sticky';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  bgColor: string;
  opacity: number;
}

export type WhiteboardElement =
  | StrokeElement
  | RectangleElement
  | CircleElement
  | LineElement
  | ArrowElement
  | TextElement
  | StickyElement;

export interface ViewTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}
