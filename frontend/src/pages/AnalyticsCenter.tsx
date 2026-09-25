import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';
import { PageHeader } from "@/components/layout/PageHeader";

export const AnalyticsCenter = () => {

  const areaOptions = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#64748b' }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLabel: { color: '#64748b' }
      }
    ],
    series: [
      {
        name: 'Transaction Volume',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3, color: '#0f766e' },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(15,118,110,0.3)' }, { offset: 1, color: 'rgba(15,118,110,0)' }]
          }
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Fraud Attempts',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3, color: '#e11d48' },
        showSymbol: false,
        data: [20, 12, 11, 34, 20, 30, 10]
      }
    ]
  };

  const barOptions = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        data: ['Electronics', 'Travel', 'Retail', 'Digital', 'Food'],
        axisTick: { alignWithLabel: true, show: false },
        axisLine: { show: false },
        axisLabel: { color: '#64748b' }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLabel: { color: '#64748b' }
      }
    ],
    series: [
      {
        name: 'Risk Exposure',
        type: 'bar',
        barWidth: '40%',
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#f59e0b' },
        data: [390, 330, 220, 110, 80]
      }
    ]
  };

  const pieOptions = {
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center', textStyle: { color: '#64748b' } },
    series: [
      {
        name: 'Alert Types',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: '18', fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: [
          { value: 1048, name: 'Velocity', itemStyle: { color: '#0f766e' } },
          { value: 735, name: 'Location', itemStyle: { color: '#14b8a6' } },
          { value: 580, name: 'Amount', itemStyle: { color: '#f59e0b' } },
          { value: 484, name: 'Device', itemStyle: { color: '#e11d48' } }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      <PageHeader title="Analytics" description="Deep insights into geographical and temporal risk patterns." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Volume vs Fraud</h3>
          <div className="h-[300px]">
            <ReactEChartsCore echarts={echarts} option={areaOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Alert Composition</h3>
          <div className="h-[300px]">
            <ReactEChartsCore echarts={echarts} option={pieOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm lg:col-span-3">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Risk Exposure by Category</h3>
          <div className="h-[300px]">
            <ReactEChartsCore echarts={echarts} option={barOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

      </div>
    </div>
  );
};
