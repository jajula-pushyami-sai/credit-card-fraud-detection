/**
 * Modular ECharts setup — import only the chart types, components, and renderers
 * that are actually used in this application. This dramatically reduces bundle size
 * compared to `import * as echarts from 'echarts'`.
 *
 * Chart types used in this app:
 *   - Line  (PredictionTimelineChart, CustomerDashboard, AnalyticsCenter, ModelRegistry)
 *   - Bar   (AnalyticsCenter, ExplainabilityStudio)
 *   - Gauge    (SystemGauge)
 *   - Radar    (ModelRadarChart)
 *   - Candlestick (ShapWaterfallChart)
 *
 * IMPORTANT: Keep this list minimal — only add a chart type here if it is actually
 * rendered. Adding the full echarts import here defeats the purpose of this file.
 */
import * as echarts from 'echarts/core';

// Chart types
import { LineChart } from 'echarts/charts';
import { BarChart } from 'echarts/charts';
import { HeatmapChart } from 'echarts/charts';
import { GaugeChart } from 'echarts/charts';
import { RadarChart } from 'echarts/charts';
import { CandlestickChart } from 'echarts/charts';
import { PieChart } from 'echarts/charts';

// Components
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  AxisPointerComponent,
  TitleComponent,
} from 'echarts/components';

// Renderer — Canvas is lighter than SVG for most charting use cases
import { CanvasRenderer } from 'echarts/renderers';

// Register all components at module initialization time (once)
echarts.use([
  LineChart,
  BarChart,
  HeatmapChart,
  GaugeChart,
  RadarChart,
  CandlestickChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  AxisPointerComponent,
  TitleComponent,
  CanvasRenderer,
]);

export default echarts;
