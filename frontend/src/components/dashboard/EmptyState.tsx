import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  imageSrc: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, imageSrc, actionText, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-64 h-64 mb-6 relative">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
        <img loading="lazy" src={imageSrc} alt={title} className="w-full h-full object-contain relative z-10 drop-shadow-sm mix-blend-overlay opacity-90" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
