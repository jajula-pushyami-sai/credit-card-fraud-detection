import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademicMode } from '../../core/context/AcademicModeContext';
import { GraduationCap, Info } from 'lucide-react';

interface AcademicTooltipProps {
  title: string;
  content: string;
  children: React.ReactNode;
}

export const AcademicTooltip: React.FC<AcademicTooltipProps> = ({ title, content, children }) => {
  const { isAcademicMode } = useAcademicMode();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {isAcademicMode && (
        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 dark:bg-primary-foreground/30 text-primary dark:text-indigo-400 cursor-help">
          <GraduationCap className="w-3 h-3" />
        </span>
      )}

      <AnimatePresence>
        {isAcademicMode && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 w-72 p-4 mt-2 top-full left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-primary/20 dark:border-indigo-800 rounded-xl shadow-xl pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
