[根目录](../../../CLAUDE.md) > [components](../) > **charts**

# 图表组件库 (Charts)

## 模块职责

提供基于 ECharts 的数据可视化组件，包括日历热力图、雷达图、漏斗图和仪表盘等，用于数据展示和分析。

## 入口与启动

- **雷达图**: `RadarChart.vue` - 多维度数据对比展示
- **仪表盘**: `GaugeChart.vue` - 进度百分比展示
- **漏斗图**: `FunnelChart.vue` - 转化流程展示
- **日历热力图**: `CalendarHeatmap.vue` - 时间分布展示

## 对外接口

### RadarChart.vue
```vue
<template>
  <RadarChart :data="chartData" :options="chartOptions" />
</template>

<script setup>
const chartData = ref([...])
const chartOptions = ref({...})
</script>
```

### GaugeChart.vue
```vue
<template>
  <GaugeChart :value="percentage" :title="chartTitle" />
</template>
```

### FunnelChart.vue
```vue
<template>
  <FunnelChart :data="funnelData" />
</template>
```

### CalendarHeatmap.vue
```vue
<template>
  <CalendarHeatmap :data="heatmapData" :year="currentYear" />
</template>
```

## 关键依赖与配置

### 核心依赖
- ECharts 6.0.0 - 图表渲染引擎
- Vue 3 - 组件框架
- Element Plus - UI 辅助组件

### 工具函数
- `@/composables/useChartConfig.js` - 图表配置管理
- `@/composables/useDashboardData.js` - 数据处理逻辑

### 样式配置
- SCSS 变量控制图表主题色
- 响应式设计适配不同屏幕

## 数据模型

### 雷达图数据
```javascript
{
  indicators: [
    { name: '维度1', max: 100 },
    { name: '维度2', max: 100 }
  ],
  series: [
    {
      name: '数据集1',
      data: [80, 70]
    }
  ]
}
```

### 漏斗图数据
```javascript
{
  data: [
    { value: 100, name: '步骤1' },
    { value: 80, name: '步骤2' },
    { value: 60, name: '步骤3' }
  ]
}
```

### 日历热力图数据
```javascript
{
  '2024-01-01': 10,
  '2024-01-02': 20,
  // 日期: 数值
}
```

## 测试与质量

当前未配置测试。建议添加：
- 图表渲染测试
- 数据更新测试
- 响应式适配测试
- 性能优化测试

## 常见问题 (FAQ)

1. **图表不显示？**
   - 检查数据格式是否正确
   - 确认容器是否有固定高度
   - 验证 ECharts 是否正确初始化

2. **图表样式不统一？**
   - 使用 useChartConfig 统一配置
   - 检查 SCSS 变量是否正确引入

3. **性能问题？**
   - 使用防抖处理数据更新
   - 大数据量考虑数据分页或采样

## 相关文件清单

- `RadarChart.vue` - 雷达图组件
- `GaugeChart.vue` - 仪表盘组件
- `FunnelChart.vue` - 漏斗图组件
- `CalendarHeatmap.vue` - 日历热力图组件
- `../../composables/useChartConfig.js` - 图表配置工具
- `../../composables/useDashboardData.js` - 数据处理工具

## 变更记录 (Changelog)

### 2025-12-13 12:04:45
- 创建图表组件文档
- 定义组件接口和数据格式
- 梳理使用方式