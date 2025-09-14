
import React, { useState, useEffect, useRef } from 'react';
import type { VisualizationSpec, Layer, ShapeProps } from '../types';

interface VisualizationRendererProps {
  spec: VisualizationSpec | null;
}

const Arrow: React.FC<{ id: string } & ShapeProps> = ({ id, x1=0, y1=0, x2=0, y2=0, stroke = 'white', strokeWidth = 2, ...props }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const arrowHeadId = `arrowhead-${id}`;

  return (
    <g {...props}>
      <defs>
        <marker
          id={arrowHeadId}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={stroke} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${arrowHeadId})`}
      />
    </g>
  );
};


const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({ spec }) => {
  const [currentLayers, setCurrentLayers] = useState<Layer[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!spec) {
      setCurrentLayers([]);
      return;
    }

    let startTime: number | null = null;
    const initialLayers = JSON.parse(JSON.stringify(spec.layers));
    setCurrentLayers(initialLayers);

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsedTime = timestamp - startTime;

      const newLayers = spec.layers.map(layer => {
        const newProps: ShapeProps = { ...layer.props };
        
        layer.animations.forEach(anim => {
          if (elapsedTime >= anim.start && elapsedTime <= anim.end) {
            const duration = anim.end - anim.start;
            const progress = duration > 0 ? (elapsedTime - anim.start) / duration : 1;
            const value = anim.from + (anim.to - anim.from) * progress;
            newProps[anim.property] = value;
          } else if (elapsedTime > anim.end) {
            newProps[anim.property] = anim.to;
          } else {
             newProps[anim.property] = anim.from;
          }
        });

        return { ...layer, props: newProps };
      });

      setCurrentLayers(newLayers);

      if (elapsedTime < spec.duration) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [spec]);

  if (!spec) {
    return null;
  }
  
  const renderLayer = (layer: Layer) => {
    const { id, type, props } = layer;
    const transform = `rotate(${props.rotation || 0} ${props.x || 0} ${props.y || 0})`;
    
    switch (type) {
      case 'circle':
        return <circle key={id} cx={props.x} cy={props.y} r={props.r} fill={props.fill} stroke={props.stroke} strokeWidth={props.strokeWidth} opacity={props.opacity} transform={transform}/>;
      case 'rectangle':
        return <rect key={id} x={(props.x || 0) - (props.width || 0) / 2} y={(props.y || 0) - (props.height || 0) / 2} width={props.width} height={props.height} fill={props.fill} stroke={props.stroke} strokeWidth={props.strokeWidth} opacity={props.opacity} transform={transform}/>;
      case 'line':
        return <line key={id} x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke={props.stroke} strokeWidth={props.strokeWidth} opacity={props.opacity} />;
      case 'arrow':
        return <Arrow key={id} id={id} {...props} />;
      default:
        return null;
    }
  };


  return (
    <svg width="100%" height="100%" viewBox="0 0 500 300">
      {currentLayers.map(renderLayer)}
    </svg>
  );
};

export default VisualizationRenderer;
