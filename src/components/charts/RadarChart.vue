<template>
  <div class="radar-chart">
    <div ref="chartRef" style="width: 100%; height: 350px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  clubs: {
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

watch(() => props.clubs, () => {
  updateChart()
}, { deep: true })

const handleResize = () => {
  if (chart) chart.resize()
}

// 处理社团数据，计算各项指标
const processClubData = () => {
  if (!props.clubs.length) return []

  return props.clubs.map(club => {
    // 活跃度评分 (0-100)
    const activityScore = Math.min((club.activityCount || 0) * 10, 100)

    // 成员数评分 (对数缩放，0-100)
    const memberScore = club.memberCount ? Math.min(Math.log10(club.memberCount + 1) * 20, 100) : 0

    // 活动质量评分 (基于参与度，0-100)
    const qualityScore = club.avgParticipation ? Math.min(club.avgParticipation * 10, 100) : 50

    // 预算使用评分 (模拟数据，0-100)
    const budgetScore = club.budgetUsage || Math.floor(Math.random() * 40) + 60

    // 影响力评分 (综合评分，0-100)
    const influenceScore = (activityScore + memberScore + qualityScore) / 3

    // 成长性评分 (基于近期增长，0-100)
    const growthScore = club.growthRate ? Math.min(club.growthRate * 100, 100) : 50

    return {
      name: club.name,
      value: [
        activityScore.toFixed(1),
        memberScore.toFixed(1),
        qualityScore.toFixed(1),
        budgetScore.toFixed(1),
        influenceScore.toFixed(1),
        growthScore.toFixed(1)
      ]
    }
  })
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return

  const seriesData = processClubData()

  const option = {
    title: {
      text: '社团综合能力评估',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1e293b'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
        fontSize: 13
      },
      padding: 12,
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);',
      formatter: function (params) {
        const indicators = ['活跃度', '成员规模', '活动质量', '预算管理', '影响力', '成长性']
        let html = `<div style="font-weight: 600; margin-bottom: 8px; color: #1e293b;">${params.name}</div>`
        params.value.forEach((value, index) => {
          html += `
            <div style="display: flex; justify-content: space-between; margin: 4px 0; min-width: 180px;">
              <span style="color: #64748b;">${indicators[index]}:</span>
              <span style="color: #1e293b; font-weight: 500;">${value}分</span>
            </div>
          `
        })
        return html
      }
    },
    legend: {
      data: seriesData.map(item => item.name),
      bottom: 0,
      itemGap: 20,
      textStyle: {
        color: '#64748b',
        fontSize: 12
      }
    },
    radar: {
      center: ['50%', '48%'],
      radius: '65%',
      indicator: [
        { name: '活跃度', max: 100, color: '#667eea' },
        { name: '成员规模', max: 100, color: '#48bb78' },
        { name: '活动质量', max: 100, color: '#ed8936' },
        { name: '预算管理', max: 100, color: '#f687b3' },
        { name: '影响力', max: 100, color: '#38b2ac' },
        { name: '成长性', max: 100, color: '#9f7aea' }
      ],
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#475569',
        fontSize: 12,
        fontWeight: 500
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          type: 'dashed'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#f8fafc', '#ffffff']
        }
      }
    },
    series: [{
      type: 'radar',
      data: seriesData.map((item, index) => ({
        name: item.name,
        value: item.value,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 2.5,
          color: [
            '#667eea', '#48bb78', '#ed8936', '#f687b3', '#38b2ac', '#9f7aea',
            '#4299e1', '#fc8181', '#63b3ed', '#f6ad55', '#68d391', '#b794f4'
          ][index % 12]
        },
        areaStyle: {
          opacity: 0.2,
          color: [
            '#667eea', '#48bb78', '#ed8936', '#f687b3', '#38b2ac', '#9f7aea',
            '#4299e1', '#fc8181', '#63b3ed', '#f6ad55', '#68d391', '#b794f4'
          ][index % 12]
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#ffffff'
        },
        emphasis: {
          lineStyle: {
            width: 4,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          },
          areaStyle: {
            opacity: 0.4
          }
        }
      }))
    }]
  }

  chart.setOption(option)
}
</script>

<style scoped>
.radar-chart {
  width: 100%;
}
</style>