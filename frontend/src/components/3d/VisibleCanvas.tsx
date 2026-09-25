import React, { useRef, useState, useEffect } from 'react';
import { Canvas, CanvasProps } from '@react-three/fiber';

export const VisibleCanvas: React.FC<CanvasProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { rootMargin: '200px' });
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas frameloop={visible ? 'always' : 'demand'} {...props} />
    </div>
  );
};
