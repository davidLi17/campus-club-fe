<template>
  <div class="calendar-heatmap">
    <div ref="chartRef" style="width: 100%; height: 280px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let chart = null

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) chart.dispose()
})

watch(() => props.activities, () => {
  updateChart()
}, { deep: true })

const handleResize = () => {
  if (chart) chart.resize()
}

// 将活动数据转换为热力图数据格式
const processActivityData = () => {
  const dataMap = new Map()
  const currentYear = new Date().getFullYear()

  // 初始化整年的数据
  const startDate = dayjs(`${currentYear}-01-01`)
  const endDate = dayjs(`${currentYear}-12-31`)

  // 按日期统计活动数量
  props.activities.forEach(activity => {
    const date = dayjs(activity.activityTime || activity.createTime).format('YYYY-MM-DD')
    dataMap.set(date, (dataMap.get(date) || 0) + 1)
  })

  // 生成热力图数据
  const heatmapData = []
  for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate); d = d.add(1, 'day')) {
    const dateStr = d.format('YYYY-MM-DD')
    const count = dataMap.get(dateStr) || 0
    heatmapData.push([
      dateStr,
      count
    ])
  }

  return heatmapData
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return

  const heatmapData = processActivityData()
  const currentYear = new Date().getFullYear()

  const option = {
    title: {
      text: `${currentYear}年社团活动热力图`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1e293b'
      }
    },
    tooltip: {
      position: 'top',
      formatter: function (params) {
        const date = params.value[0]
        const count = params.value[1]
        return `${date}<br/>活动数量: ${count}个`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
        fontSize: 13
      },
      padding: 12,
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);'
    },
    visualMap: {
      min: 0,
      max: 5,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 30,
      pieces: [
        { min: 0, max: 0, label: '0', color: '#f0f9ff' },
        { min: 1, max: 1, label: '1', color: '#bae6fd' },
        { min: 2, max: 2, label: '2', color: '#38bdf8' },
        { min: 3, max: 3, label: '3', color: '#0ea5e9' },
        { min: 4, max: 4, label: '4', color: '#0284c7' },
        { min: 5, label: '5+', color: '#075985' }
      ]
    },
    calendar: {
      top: 70,
      left: 30,
      right: 30,
      cellSize: ['auto', 18],
      range: currentYear,
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 4
      },
      dayLabel: {
        firstDay: 1,
        nameMap: 'cn',
        color: '#64748b',
        fontSize: 11
      },
      monthLabel: {
        nameMap: 'cn',
        color: '#475569',
        fontSize: 12,
        fontWeight: 500
      },
      yearLabel: {
        show: false
      }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: heatmapData,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      }
    }
  }

  chart.setOption(option)
}
</script>

<style scoped>
.calendar-heatmap {
  width: 100%;
}
</style>