<template>
  <div class="gauge-chart">
    <div ref="chartRef" style="width: 100%; height: 320px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  activityData: {
    type: Object,
    default: () => ({
      currentParticipants: 0,
      maxParticipants: 100,
      title: '活动报名进度'
    })
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

watch(() => props.activityData, () => {
  updateChart()
}, { deep: true })

const handleResize = () => {
  if (chart) chart.resize()
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return

  const { currentParticipants, maxParticipants, title } = props.activityData
  const percentage = maxParticipants > 0 ? (currentParticipants / maxParticipants) * 100 : 0
  const remaining = Math.max(0, maxParticipants - currentParticipants)

  // 根据百分比设置颜色
  let gaugeColor
  if (percentage < 50) {
    gaugeColor = '#48bb78' // 绿色 - 充裕
  } else if (percentage < 80) {
    gaugeColor = '#ed8936' // 橙色 - 适中
  } else if (percentage < 95) {
    gaugeColor = '#f687b3' // 粉色 - 紧张
  } else {
    gaugeColor = '#fc8181' // 红色 - 已满
  }

  const option = {
    title: {
      text: title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1e293b'
      }
    },
    series: [
      // 外圈装饰
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '85%',
        startAngle: 225,
        endAngle: -45,
        min: 0,
        max: 100,
        splitNumber: 12,
        itemStyle: {
          color: '#f1f5f9'
        },
        progress: {
          show: true,
          width: 8
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 8
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          show: false
        },
        data: [{ value: 100 }]
      },
      // 主仪表盘
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '75%',
        startAngle: 225,
        endAngle: -45,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: gaugeColor
        },
        progress: {
          show: true,
          width: 18,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: gaugeColor },
                { offset: 1, color: gaugeColor + 'dd' }
              ]
            }
          }
        },
        pointer: {
          icon: 'path://M11.834,24.468c0-1.355,1.093-2.452,2.445-2.452s2.445,1.097,2.445,2.452c0,1.355-1.093,2.452-2.445,2.452S11.834,25.823,11.834,24.468z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '5%'],
          itemStyle: {
            color: gaugeColor,
            shadowBlur: 5,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#f1f5f9']]
          }
        },
        axisTick: {
          splitNumber: 2,
          distance: -26,
          lineStyle: {
            width: 2,
            color: '#cbd5e0'
          }
        },
        splitLine: {
          distance: -30,
          length: 12,
          lineStyle: {
            width: 3,
            color: '#cbd5e0'
          }
        },
        axisLabel: {
          distance: -45,
          color: '#64748b',
          fontSize: 11,
          fontWeight: 500
        },
        title: {
          show: true,
          offsetCenter: [0, '-10%'],
          textStyle: {
            fontSize: 14,
            fontWeight: 500,
            color: '#475569'
          }
        },
        detail: {
          fontSize: 28,
          fontWeight: 700,
          color: gaugeColor,
          offsetCenter: [0, '25%'],
          formatter: function (value) {
            return `${value.toFixed(0)}%`
          },
          valueAnimation: true,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: gaugeColor,
          borderWidth: 2,
          borderRadius: 20,
          width: 80,
          height: 40,
          lineHeight: 40
        },
        data: [{
          value: percentage,
          name: `${currentParticipants}/${maxParticipants}人`
        }]
      },
      // 中心装饰圆
      {
        type: 'pie',
        center: ['50%', '60%'],
        radius: '8%',
        silent: true,
        itemStyle: {
          color: '#ffffff',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: { show: false },
        labelLine: { show: false },
        data: [1]
      }
    ]
  }

  chart.setOption(option)
}
</script>

<style scoped>
.gauge-chart {
  width: 100%;
}
</style>