import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  shape?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', shape = 'rect' }) => {
  const baseClasses = "bg-muted/40 relative overflow-hidden";
  
  const shapeClasses = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  return (
    <div className={`${baseClasses} ${shapeClasses[shape]} ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={{ translateX: ['-100%', '100%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
