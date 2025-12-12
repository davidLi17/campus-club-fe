<template>
  <div class="funnel-chart">
    <div ref="chartRef" style="width: 100%; height: 350px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  applications: {
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

watch(() => props.applications, () => {
  updateChart()
}, { deep: true })

const handleResize = () => {
  if (chart) chart.resize()
}

// 处理申请数据，统计各阶段转化情况
const processApplicationData = () => {
  const total = props.applications.length
  if (total === 0) {
    return [
      { value: 0, name: '提交申请' },
      { value: 0, name: '待审核' },
      { value: 0, name: '面试中' },
      { value: 0, name: '通过审核' },
      { value: 0, name: '正式入社' }
    ]
  }

  // 统计各阶段数量
  const pending = props.applications.filter(app => app.status === 'PENDING').length
  const interviewing = props.applications.filter(app => app.status === 'INTERVIEWING').length
  const approved = props.applications.filter(app => app.status === 'APPROVED').length
  const joined = props.applications.filter(app => app.status === 'JOINED').length

  // 模拟历史累计数据（更真实的漏斗效果）
  const submitted = total
  const pendingCount = pending + interviewing + approved + joined
  const interviewCount = interviewing + approved + joined
  const approvedCount = approved + joined
  const joinedCount = joined

  return [
    { value: submitted, name: '提交申请' },
    { value: pendingCount, name: '待审核' },
    { value: interviewCount, name: '面试中' },
    { value: approvedCount, name: '通过审核' },
    { value: joinedCount, name: '正式入社' }
  ]
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return

  const funnelData = processApplicationData()
  const total = funnelData[0]?.value || 0

  const option = {
    title: {
      text: '入社申请转化漏斗',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1e293b'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const percent = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0
        return `${params.name}<br/>
                人数: ${params.value}人<br/>
                转化率: ${percent}%`
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
    legend: {
      data: funnelData.map(item => item.name),
      bottom: 0,
      itemGap: 20,
      textStyle: {
        color: '#64748b',
        fontSize: 12
      }
    },
    series: [{
      name: '申请转化',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      max: total,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'right',
        formatter: function (params) {
          const percent = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0
          return `${params.name}\n${params.value}人 (${percent}%)`
        },
        color: '#1e293b',
        fontSize: 13,
        fontWeight: 500
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid',
          color: '#e2e8f0'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
        shadowBlur: 5,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffsetY: 2
      },
      emphasis: {
        label: {
          fontSize: 14,
          fontWeight: 600
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      data: funnelData.map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: ['#667eea', '#48bb78', '#ed8936', '#f687b3', '#38b2ac'][index] },
            { offset: 1, color: ['#764ba2', '#38a169', '#dd6b20', '#d53f8c', '#319795'][index] }
          ])
        }
      }))
    }]
  }

  chart.setOption(option)
}
</script>

<style scoped>
.funnel-chart {
  width: 100%;
}
</style>