
export type ShapeType = 'circle' | 'rectangle' | 'line' | 'arrow';

export interface ShapeProps {
  [key: string]: any; 
  // Common properties
  x?: number;
  y?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;

  // Circle-specific
  r?: number;

  // Rectangle-specific
  width?: number;
  height?: number;

  // Line/Arrow specific
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface AnimationProps {
  property: string;
  from: number;
  to: number;
  start: number;
  end: number;
}

export interface Layer {
  id: string;
  type: ShapeType;
  props: ShapeProps;
  animations: AnimationProps[];
}

export interface VisualizationSpec {
  id: string;
  duration: number;
  fps: number;
  layers: Layer[];
}

export interface ExplanationResponse {
    text: string;
    visualization: VisualizationSpec;
}
