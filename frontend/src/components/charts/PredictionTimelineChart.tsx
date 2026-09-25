import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';

interface PredictionTimelineProps {
  labels: string[];
  legitimate: number[];
  fraudulent: number[];
}

export const PredictionTimelineChart = ({ labels, legitimate, fraudulent }: PredictionTimelineProps) => {
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } } },
    legend: { data: ['Legitimate', 'Fraudulent'], textStyle: { color: 'rgba(255,255,255,0.7)' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }
      }
    ],
    series: [
      {
        name: 'Legitimate',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(16, 185, 129, 0.5)' }, { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }]
          }
        },
        itemStyle: { color: '#10b981' },
        data: legitimate
      },
      {
        name: 'Fraudulent',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(239, 68, 68, 0.8)' }, { offset: 1, color: 'rgba(239, 68, 68, 0.1)' }]
          }
        },
        itemStyle: { color: '#ef4444' },
        data: fraudulent
      }
    ],
    backgroundColor: 'transparent'
  };

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '350px', width: '100%' }} />;
};
