import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { NeuralLoader } from '@/components/motion/NeuralLoader';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
      
      <div className="mb-8 transform scale-75">
        <NeuralLoader />
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold tracking-tighter text-slate-900 dark:text-white mb-4"
      >
        404
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-slate-500 mb-8 max-w-md"
      >
        The node you are looking for does not exist in the current neural mapping. It may have been deprecated or moved.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
        <Button onClick={() => navigate('/dashboard')} className="gap-2 bg-primary hover:bg-primary text-white">
          <Home className="w-4 h-4" /> Return to Dashboard
        </Button>
      </motion.div>

    </div>
  );
};
