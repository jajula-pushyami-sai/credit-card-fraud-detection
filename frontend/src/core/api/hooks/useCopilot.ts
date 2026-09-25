import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { useCopilotContext } from '../../context/CopilotContext';

export function useCopilotChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const copilotContext = useCopilotContext();

  const sendMessage = useCallback(async (query: string) => {
    setMessages(prev => [...prev, { role: 'user', content: query }, { role: 'assistant', content: '' }]);
    setIsTyping(true);

    try {
      const baseURL = apiClient.defaults.baseURL || 'http://localhost:5000/api/v1';
      const endpoint = baseURL.endsWith('/api/v1') ? baseURL + '/copilot/chat' : baseURL + '/api/v1/copilot/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          context: {
            role: copilotContext.activeRole,
            page: copilotContext.currentPage,
            transactionId: copilotContext.activeTransactionId
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.replace('data: ', ''));
              if (data.done) {
                done = true;
                break;
              }
              if (data.token) {
                setMessages(prev => {
                  const newMsgs = [...prev];
                  const lastIdx = newMsgs.length - 1;
                  if (lastIdx >= 0) {
                    newMsgs[lastIdx] = {
                      ...newMsgs[lastIdx],
                      content: newMsgs[lastIdx].content + data.token
                    };
                  }
                  return newMsgs;
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Copilot Stream Error:', error);
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (lastIdx >= 0 && !newMsgs[lastIdx].content) {
          newMsgs[lastIdx] = {
            ...newMsgs[lastIdx],
            content: "Copilot unavailable. Request failed. Please retry."
          };
        }
        return newMsgs;
      });
    } finally {
      setIsTyping(false);
    }
  }, [copilotContext.activeRole, copilotContext.currentPage, copilotContext.activeTransactionId]);

  return { messages, sendMessage, isTyping };
}

export function useCopilotSummary(txId: string) {
  return useQuery({
    queryKey: ['copilot', 'summary', txId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/copilot/summarize/${txId}`);
      return data.data.summary as string;
    },
    enabled: !!txId,
  });
}
