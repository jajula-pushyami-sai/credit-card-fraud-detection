import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';

interface ModelComparison {
  name: string;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

export const ModelRadarChart = ({ models }: { models: ModelComparison[] }) => {
  const indicator = [
    { name: 'Precision', max: 1 },
    { name: 'Recall', max: 1 },
    { name: 'F1 Score', max: 1 },
    { name: 'ROC AUC', max: 1 },
  ];

  const seriesData = models.map(m => ({
    value: [m.precision, m.recall, m.f1, m.roc_auc],
    name: m.name,
    areaStyle: { opacity: 0.2 },
    lineStyle: { width: 2 }
  }));

  const option = {
    tooltip: {},
    legend: {
      data: models.map(m => m.name),
      bottom: 0,
      textStyle: { color: 'rgba(255, 255, 255, 0.7)' }
    },
    radar: {
      indicator: indicator,
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [{ type: 'radar', data: seriesData }],
    backgroundColor: 'transparent'
  };

  return <ReactEChartsCore echarts={echarts} option={option} style={{ height: '450px', width: '100%' }} />;
};
