import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';

interface Feature {
  name: string;
  value: number;
  contribution: number;
}

interface ShapWaterfallChartProps {
  baseValue: number;
  features: Feature[];
}

export const ShapWaterfallChart = ({ baseValue, features }: ShapWaterfallChartProps) => {
  let runningTotal = baseValue;
  const sortedFeatures = [...features].sort((a, b) => Math.abs(a.contribution) - Math.abs(b.contribution));

  const data = sortedFeatures.map((f) => {
    const isPositive = f.contribution > 0;
    const previousTotal = runningTotal;
    runningTotal += f.contribution;

    return {
      name: f.name,
      value: [previousTotal, runningTotal, previousTotal, runningTotal],
      itemStyle: {
        color: isPositive ? '#ef4444' : '#10b981', // Rose for positive (fraud), Emerald for negative (legit)
        borderColor: isPositive ? '#ef4444' : '#10b981'
      }
    };
  });

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: sortedFeatures.map(f => f.name) },
    series: [
      {
        type: 'candlestick',
        data: data,
        itemStyle: { opacity: 0.8 },
      }
    ],
    backgroundColor: 'transparent'
  };

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '400px', width: '100%' }} theme="dark" />;
};
