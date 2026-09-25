import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';

export const SystemGauge = ({ name, value, color }: { name: string, value: number, color?: string }) => {
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 100,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, color || '#10b981'],
              [0.7, '#f59e0b'],
              [1, '#ef4444']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: { color: color || 'auto' }
        },
        axisTick: { length: 12, lineStyle: { color: 'auto', width: 2 } },
        splitLine: { length: 20, lineStyle: { color: 'auto', width: 5 } },
        axisLabel: { color: '#999', distance: -60, fontSize: 14 },
        title: { offsetCenter: [0, '-20%'], fontSize: 16, color: 'rgba(255,255,255,0.7)' },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '20%'],
          valueAnimation: true,
          formatter: '{value}%',
          color: 'auto'
        },
        data: [{ value, name }]
      }
    ],
    backgroundColor: 'transparent',
    animationEasing: 'elasticOut',
    animationDuration: 2000,
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'elasticOut',
  };

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '250px', width: '100%' }} />;
};
