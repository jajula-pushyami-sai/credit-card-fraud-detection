import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export * from './FadeIn';
export const SlideUp: React.FC<HTMLMotionProps<"div"> & { delay?: number }> = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const HoverLift: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export * from './StaggerContainer';
export * from './AnimatedNumber';
export * from './InteractiveCard';
