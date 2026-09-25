import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CopilotContextType {
  activeRole: 'Customer' | 'Analyst' | 'Admin';
  setActiveRole: (role: 'Customer' | 'Analyst' | 'Admin') => void;
  activeTransactionId: string | null;
  setActiveTransactionId: (id: string | null) => void;
  currentPage: string;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const CopilotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<'Customer' | 'Analyst' | 'Admin'>('Analyst');
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Automatically infer role based on route for demonstration
    if (location.pathname.includes('dashboard')) setActiveRole('Customer');
    else if (location.pathname.includes('workspace') || location.pathname.includes('explainability')) setActiveRole('Analyst');
    else if (location.pathname.includes('admin') || location.pathname.includes('mlops')) setActiveRole('Admin');
  }, [location.pathname]);

  return (
    <CopilotContext.Provider value={{
      activeRole,
      setActiveRole,
      activeTransactionId,
      setActiveTransactionId,
      currentPage: location.pathname
    }}>
      {children}
    </CopilotContext.Provider>
  );
};

export const useCopilotContext = () => {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilotContext must be used within a CopilotProvider');
  }
  return context;
};
