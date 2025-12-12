import * as echarts from 'echarts'

// 通用图表配置
export const commonTooltip = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  textStyle: {
    color: '#1e293b',
    fontSize: 13,
  },
  padding: 12,
  extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);',
}

// 折线图配置
export const getLineChartOption = () => ({
  tooltip: {
    ...commonTooltip,
    trigger: 'axis',
  },
  legend: {
    data: ['活动数量', '参与人数'],
    top: 10,
    textStyle: {
      color: '#64748b',
      fontSize: 13,
      fontWeight: 500,
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '18%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    axisLine: {
      lineStyle: {
        color: '#e2e8f0',
      },
    },
    axisLabel: {
      color: '#64748b',
      fontSize: 12,
      fontWeight: 500,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#f1f5f9',
        type: 'dashed',
      },
    },
    axisLabel: {
      color: '#64748b',
      fontSize: 12,
    },
  },
  series: [
    {
      name: '活动数量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [5, 8, 12, 15, 18, 20],
      itemStyle: {
        color: '#667eea',
        borderWidth: 2,
        borderColor: '#ffffff',
      },
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' },
          ],
        },
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.35)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.02)' },
        ]),
      },
      emphasis: {
        itemStyle: {
          scale: 1.5,
          shadowBlur: 10,
          shadowColor: 'rgba(102, 126, 234, 0.5)',
        },
      },
    },
    {
      name: '参与人数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [120, 180, 250, 320, 380, 450],
      itemStyle: {
        color: '#48bb78',
        borderWidth: 2,
        borderColor: '#ffffff',
      },
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#48bb78' },
            { offset: 1, color: '#38a169' },
          ],
        },
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(72, 187, 120, 0.35)' },
          { offset: 1, color: 'rgba(72, 187, 120, 0.02)' },
        ]),
      },
      emphasis: {
        itemStyle: {
          scale: 1.5,
          shadowBlur: 10,
          shadowColor: 'rgba(72, 187, 120, 0.5)',
        },
      },
    },
  ],
})

// 饼图配置
export const getPieChartOption = () => ({
  tooltip: {
    ...commonTooltip,
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}个 ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: '8%',
    top: 'center',
    itemGap: 16,
    textStyle: {
      color: '#64748b',
      fontSize: 13,
      fontWeight: 500,
    },
    icon: 'circle',
    itemWidth: 12,
    itemHeight: 12,
  },
  series: [
    {
      name: '社团类型',
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 12,
        borderColor: '#fff',
        borderWidth: 3,
        shadowBlur: 8,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 22,
          fontWeight: 'bold',
          color: '#1e293b',
        },
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
        },
        scale: true,
        scaleSize: 8,
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 4, name: '学术科技类', itemStyle: { color: '#667eea' } },
        { value: 3, name: '文化艺术类', itemStyle: { color: '#48bb78' } },
        { value: 2, name: '体育健身类', itemStyle: { color: '#ed8936' } },
        { value: 2, name: '志愿服务类', itemStyle: { color: '#f687b3' } },
        { value: 1, name: '其他类型', itemStyle: { color: '#a0aec0' } },
      ],
    },
  ],
})