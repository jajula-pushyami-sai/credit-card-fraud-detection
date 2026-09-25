import React from 'react';
import { InteractiveCard } from '../motion/InteractiveCard';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export interface KPI {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  trendLabel?: string;
  sparklineData?: number[]; // Simple array of 10 numbers for mini chart
}

interface GlobalKPIHeaderProps {
  kpis: KPI[];
}

export const GlobalKPIHeader: React.FC<GlobalKPIHeaderProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-[var(--shadow-elevated)] transition-shadow duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between h-full rounded-2xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {kpi.label}
              </span>
              {kpi.trend && (
                <div className={`flex items-center text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                  kpi.trend === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' :
                  kpi.trend === 'down' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' :
                  'text-slate-600 bg-slate-50 dark:bg-slate-800'
                }`}>
                  {kpi.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                  {kpi.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                  {kpi.trend === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
                  {kpi.trendValue}
                </div>
              )}
            </div>
            
            <div className="flex items-end justify-between mt-2">
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                <AnimatedNumber 
                  value={kpi.value} 
                  prefix={kpi.prefix} 
                  suffix={kpi.suffix} 
                  decimals={kpi.decimals}
                  duration={1500 + (i * 200)}
                />
              </div>

              {/* Mini Sparkline */}
              {kpi.sparklineData && kpi.sparklineData.length > 0 && (
                <div className="w-16 h-8 flex items-end justify-between gap-[2px]">
                  {kpi.sparklineData.map((val, idx) => {
                    const max = Math.max(...kpi.sparklineData!);
                    const min = Math.min(...kpi.sparklineData!);
                    const range = max - min || 1;
                    const heightPct = Math.max(10, ((val - min) / range) * 100);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.5, delay: 0.3 + (idx * 0.05) }}
                        className={`w-full rounded-t-sm ${
                          kpi.trend === 'up' ? 'bg-emerald-500/40' :
                          kpi.trend === 'down' ? 'bg-rose-500/40' :
                          'bg-primary/40'
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {kpi.trendLabel && (
              <p className="text-[11px] text-slate-400 mt-2">{kpi.trendLabel}</p>
            )}
          </InteractiveCard>
        </motion.div>
      ))}
    </div>
  );
};
