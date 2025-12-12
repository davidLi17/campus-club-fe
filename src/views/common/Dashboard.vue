<template>
  <div class="dashboard">
    <el-row :gutter="20" class="welcome-row">
      <el-col :span="24">
        <el-card class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-text">
              <h2>欢迎回来，{{ userStore.userInfo?.realName }}！</h2>
              <p>{{ greeting }}，今天是 {{ currentDate }}</p>
            </div>
            <div class="welcome-icon">
              <el-icon :size="80" color="#409eff"><User /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="8" v-if="userStore.isAdmin">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background: #409eff">
              <el-icon :size="32"><OfficeBuilding /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ stats.totalClubs }}</div>
              <div class="stats-label">社团总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8" v-if="userStore.isAdmin">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background: #67c23a">
              <el-icon :size="32"><Calendar /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ stats.totalActivities }}</div>
              <div class="stats-label">活动总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="stats-card">
          <div class="stats-content">
            <div class="stats-icon" style="background: #e6a23c">
              <el-icon :size="32"><Document /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ stats.pendingApprovals }}</div>
              <div class="stats-label">待审核</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>📈 社团活动趋势</span>
            </div>
          </template>
          <div ref="lineChartRef" style="width: 100%; height: 320px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>🎯 社团类型分布</span>
            </div>
          </template>
          <div ref="pieChartRef" style="width: 100%; height: 320px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>

          <div class="quick-actions">
            <el-button
              v-if="userStore.isAdmin"
              type="primary"
              size="large"
              @click="router.push('/admin/clubs')"
            >
              <el-icon><OfficeBuilding /></el-icon>
              社团管理
            </el-button>

            <el-button
              v-if="userStore.isAdmin"
              type="success"
              size="large"
              @click="router.push('/admin/activities')"
            >
              <el-icon><Calendar /></el-icon>
              活动审核
            </el-button>

            <el-button
              v-if="userStore.isClubAdmin"
              type="primary"
              size="large"
              @click="router.push('/club-admin/members')"
            >
              <el-icon><User /></el-icon>
              成员管理
            </el-button>

            <el-button
              v-if="userStore.isClubAdmin"
              type="success"
              size="large"
              @click="router.push('/club-admin/activities')"
            >
              <el-icon><Calendar /></el-icon>
              活动管理
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import dayjs from "dayjs";
import * as echarts from "echarts";

const router = useRouter();
const userStore = useUserStore();

const stats = ref({
  totalClubs: 0,
  totalActivities: 0,
  pendingApprovals: 0,
});

const lineChartRef = ref(null);
const pieChartRef = ref(null);
let lineChart = null;
let pieChart = null;

const currentDate = computed(() => {
  return dayjs().format("YYYY年MM月DD日 dddd");
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "早上好";
  if (hour < 18) return "下午好";
  return "晚上好";
});

onMounted(() => {
  loadStats();
  initCharts();

  // 监听窗口大小变化
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (lineChart) lineChart.dispose();
  if (pieChart) pieChart.dispose();
});

const handleResize = () => {
  if (lineChart) lineChart.resize();
  if (pieChart) pieChart.resize();
};

// Mock数据加载
const loadStats = () => {
  stats.value = {
    totalClubs: 12,
    totalActivities: 45,
    pendingApprovals: 8,
  };
};

// 初始化图表
const initCharts = () => {
  initLineChart();
  initPieChart();
};

// 折线图 - 活动趋势
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChart = echarts.init(lineChartRef.value);

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      textStyle: {
        color: "#1e293b",
        fontSize: 13,
      },
      padding: 12,
      extraCssText:
        "border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);",
    },
    legend: {
      data: ["活动数量", "参与人数"],
      top: 10,
      textStyle: {
        color: "#64748b",
        fontSize: 13,
        fontWeight: 500,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "18%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
      axisLine: {
        lineStyle: {
          color: "#e2e8f0",
        },
      },
      axisLabel: {
        color: "#64748b",
        fontSize: 12,
        fontWeight: 500,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#f1f5f9",
          type: "dashed",
        },
      },
      axisLabel: {
        color: "#64748b",
        fontSize: 12,
      },
    },
    series: [
      {
        name: "活动数量",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        data: [5, 8, 12, 15, 18, 20],
        itemStyle: {
          color: "#667eea",
          borderWidth: 2,
          borderColor: "#ffffff",
        },
        lineStyle: {
          width: 3,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#667eea" },
              { offset: 1, color: "#764ba2" },
            ],
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(102, 126, 234, 0.35)" },
            { offset: 1, color: "rgba(102, 126, 234, 0.02)" },
          ]),
        },
        emphasis: {
          itemStyle: {
            scale: 1.5,
            shadowBlur: 10,
            shadowColor: "rgba(102, 126, 234, 0.5)",
          },
        },
      },
      {
        name: "参与人数",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        data: [120, 180, 250, 320, 380, 450],
        itemStyle: {
          color: "#48bb78",
          borderWidth: 2,
          borderColor: "#ffffff",
        },
        lineStyle: {
          width: 3,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#48bb78" },
              { offset: 1, color: "#38a169" },
            ],
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(72, 187, 120, 0.35)" },
            { offset: 1, color: "rgba(72, 187, 120, 0.02)" },
          ]),
        },
        emphasis: {
          itemStyle: {
            scale: 1.5,
            shadowBlur: 10,
            shadowColor: "rgba(72, 187, 120, 0.5)",
          },
        },
      },
    ],
  };

  lineChart.setOption(option);
};

// 饼图 - 社团类型分布
const initPieChart = () => {
  if (!pieChartRef.value) return;

  pieChart = echarts.init(pieChartRef.value);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c}个 ({d}%)",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      textStyle: {
        color: "#1e293b",
        fontSize: 13,
      },
      padding: 12,
      extraCssText:
        "border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);",
    },
    legend: {
      orient: "vertical",
      right: "8%",
      top: "center",
      itemGap: 16,
      textStyle: {
        color: "#64748b",
        fontSize: 13,
        fontWeight: 500,
      },
      icon: "circle",
      itemWidth: 12,
      itemHeight: 12,
    },
    series: [
      {
        name: "社团类型",
        type: "pie",
        radius: ["45%", "75%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 12,
          borderColor: "#fff",
          borderWidth: 3,
          shadowBlur: 8,
          shadowColor: "rgba(0, 0, 0, 0.1)",
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 22,
            fontWeight: "bold",
            color: "#1e293b",
          },
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.2)",
          },
          scale: true,
          scaleSize: 8,
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 4, name: "学术科技类", itemStyle: { color: "#667eea" } },
          { value: 3, name: "文化艺术类", itemStyle: { color: "#48bb78" } },
          { value: 2, name: "体育健身类", itemStyle: { color: "#ed8936" } },
          { value: 2, name: "志愿服务类", itemStyle: { color: "#f687b3" } },
          { value: 1, name: "其他类型", itemStyle: { color: "#a0aec0" } },
        ],
      },
    ],
  };

  pieChart.setOption(option);
};
</script>

<style scoped lang="scss">
.dashboard {
  .welcome-row {
    margin-bottom: 24px;
    animation: fadeInUp 0.5s ease-out;
  }

  .charts-row {
    margin-bottom: 24px;

    .el-col:nth-child(1) {
      animation: fadeInUp 0.6s ease-out;
    }

    .el-col:nth-child(2) {
      animation: fadeInUp 0.7s ease-out;
    }
  }

  .welcome-card {
    margin-bottom: 0;
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    border: none;
    overflow: hidden;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(102, 126, 234, 0.1) 0%,
        transparent 70%
      );
      animation: pulse 4s ease-in-out infinite;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;

      .welcome-text {
        h2 {
          margin: 0 0 12px;
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        p {
          margin: 0;
          font-size: 15px;
          color: #64748b;
          font-weight: 500;
        }
      }

      .welcome-icon {
        opacity: 0.15;
        transform: scale(1.2);
      }
    }
  }

  .stats-row {
    margin-bottom: 24px;

    .el-col:nth-child(1) {
      animation: fadeInUp 0.5s ease-out;
    }

    .el-col:nth-child(2) {
      animation: fadeInUp 0.6s ease-out;
    }

    .el-col:nth-child(3) {
      animation: fadeInUp 0.7s ease-out;
    }
  }

  .stats-card,
  .chart-card {
    transition: all 0.3s ease;
    border: none;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }
  }

  .chart-card {
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);

    .card-header {
      span {
        font-size: 17px;
      }
    }
  }

  .stats-card {
    .stats-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 8px 0;

      .stats-icon {
        width: 68px;
        height: 68px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.1) rotate(5deg);
        }
      }

      .stats-info {
        flex: 1;

        .stats-value {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 6px;
          line-height: 1;
        }

        .stats-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  .card-header {
    font-weight: 600;
    font-size: 16px;
    color: #1e293b;
    display: flex;
    align-items: center;

    span {
      position: relative;
      padding-left: 12px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
      }
    }
  }

  .quick-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .el-button {
      min-width: 160px;
      height: 44px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px) scale(1.02);
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}
</style>
