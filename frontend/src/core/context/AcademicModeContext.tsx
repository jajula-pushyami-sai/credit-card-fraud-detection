import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AcademicModeContextType {
  isAcademicMode: boolean;
  toggleAcademicMode: () => void;
}

const AcademicModeContext = createContext<AcademicModeContextType | undefined>(undefined);

export const AcademicModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAcademicMode, setIsAcademicMode] = useState(false);

  const toggleAcademicMode = () => setIsAcademicMode(prev => !prev);

  return (
    <AcademicModeContext.Provider value={{ isAcademicMode, toggleAcademicMode }}>
      {children}
    </AcademicModeContext.Provider>
  );
};

export const useAcademicMode = () => {
  const context = useContext(AcademicModeContext);
  if (context === undefined) {
    throw new Error('useAcademicMode must be used within an AcademicModeProvider');
  }
  return context;
};
