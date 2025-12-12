import { ref } from 'vue'
import { getActivityList } from '@/api/activity'
import { getClubList } from '@/api/club'
import { getMyApplications } from '@/api/club'

// 图表数据
export const useDashboardData = () => {
  const stats = ref({
    totalClubs: 0,
    totalActivities: 0,
    pendingApprovals: 0,
  })

  const mockActivities = ref([])
  const mockClubs = ref([])
  const mockApplications = ref([])
  const gaugeData = ref({
    currentParticipants: 0,
    maxParticipants: 100,
    title: '热门活动报名进度'
  })

  // 加载统计数据
  const loadStats = async () => {
    try {
      // TODO: 替换为实际的API调用
      // const res = await getActivityList({ pageSize: 1000 })
      // stats.value.totalActivities = res.data.total || 0

      // 临时使用mock数据
      stats.value = {
        totalClubs: 12,
        totalActivities: 45,
        pendingApprovals: 8,
      }

      // 生成活动数据（用于日历热力图）
      const activities = []
      const currentYear = new Date().getFullYear()
      for (let i = 0; i < 45; i++) {
        const date = new Date(currentYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        activities.push({
          id: i + 1,
          name: `活动${i + 1}`,
          activityTime: date.toISOString(),
          createTime: date.toISOString()
        })
      }
      mockActivities.value = activities

      // 生成社团数据（用于雷达图）
      const clubNames = ['电子竞技社', '志愿者协会', '摄影协会', '音乐社', '舞蹈团', '篮球社']
      mockClubs.value = clubNames.map((name, index) => ({
        id: index + 1,
        name,
        memberCount: Math.floor(Math.random() * 100) + 20,
        activityCount: Math.floor(Math.random() * 10) + 1,
        avgParticipation: Math.floor(Math.random() * 10) + 1,
        budgetUsage: Math.floor(Math.random() * 40) + 60,
        growthRate: Math.random() * 0.5
      }))

      // 生成申请数据（用于漏斗图）
      const statuses = ['PENDING', 'PENDING', 'PENDING', 'INTERVIEWING', 'APPROVED', 'JOINED']
      const applications = []
      for (let i = 0; i < 100; i++) {
        applications.push({
          id: i + 1,
          studentId: 1000 + i,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        })
      }
      mockApplications.value = applications

      // 生成仪表盘数据
      gaugeData.value = {
        currentParticipants: 85,
        maxParticipants: 100,
        title: '热门活动报名进度'
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  return {
    stats,
    mockActivities,
    mockClubs,
    mockApplications,
    gaugeData,
    loadStats
  }
}

// 图表配置数据
export const lineChartData = {
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
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.35)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.02)' },
          ],
        },
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
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(72, 187, 120, 0.35)' },
            { offset: 1, color: 'rgba(72, 187, 120, 0.02)' },
          ],
        },
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
}

export const pieChartData = [
  { value: 4, name: '学术科技类', itemStyle: { color: '#667eea' } },
  { value: 3, name: '文化艺术类', itemStyle: { color: '#48bb78' } },
  { value: 2, name: '体育健身类', itemStyle: { color: '#ed8936' } },
  { value: 2, name: '志愿服务类', itemStyle: { color: '#f687b3' } },
  { value: 1, name: '其他类型', itemStyle: { color: '#a0aec0' } },
]