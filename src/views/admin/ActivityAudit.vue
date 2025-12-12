<template>
  <div class="activity-audit">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索活动名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="待审核" value="PENDING" />
            <el-option label="已通过" value="APPROVED" />
            <el-option label="已拒绝" value="REJECTED" />
            <el-option label="已取消" value="CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="活动名称" min-width="180" />
        <el-table-column prop="clubName" label="所属社团" width="150" />
        <el-table-column prop="location" label="活动地点" width="150" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="currentMembers" label="报名/上限" width="120">
          <template #default="{ row }">
            {{ row.currentMembers }} / {{ row.maxMembers }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              size="small"
              type="success"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 'PENDING'"
              size="small"
              type="warning"
              @click="handleReject(row)"
            >
              拒绝
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="reviewDialogVisible" :title="reviewTitle" width="500px">
      <el-form :model="reviewForm" label-width="100px">
        <el-form-item label="审核意见">
          <el-input
            v-model="reviewForm.note"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          @click="handleReviewSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getAllActivities,
  reviewActivity,
  deleteActivity,
} from "@/api/clubAdmin";

const loading = ref(false);
const tableData = ref([]);
const searchForm = reactive({
  keyword: "",
  status: "",
});
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const reviewDialogVisible = ref(false);
const reviewTitle = ref("");
const reviewForm = reactive({
  activityId: null,
  approved: true,
  note: "",
});
const submitting = ref(false);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    await mockLoadData();
  } catch (error) {
    ElMessage.error("加载数据失败");
  } finally {
    loading.value = false;
  }
};

const mockLoadData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      tableData.value = [
        {
          id: 1,
          clubId: 1,
          clubName: "计算机协会",
          title: "编程马拉松大赛",
          content: "24小时编程挑战，展示你的编程实力",
          location: "计算机楼301",
          startTime: "2024-06-15 09:00:00",
          endTime: "2024-06-16 09:00:00",
          status: "PENDING",
          maxMembers: 50,
          currentMembers: 25,
          createUsername: "张三",
        },
        {
          id: 2,
          clubId: 2,
          clubName: "篮球社",
          title: "篮球友谊赛",
          content: "与兄弟院校进行篮球友谊赛",
          location: "体育馆",
          startTime: "2024-06-20 14:00:00",
          endTime: "2024-06-20 17:00:00",
          status: "APPROVED",
          maxMembers: 30,
          currentMembers: 28,
          createUsername: "李四",
        },
      ];
      pagination.total = 2;
      resolve();
    }, 300);
  });
};

const getStatusType = (status) => {
  const map = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "danger",
    CANCELLED: "info",
    COMPLETED: "info",
  };
  return map[status] || "info";
};

const getStatusText = (status) => {
  const map = {
    PENDING: "待审核",
    APPROVED: "已通过",
    REJECTED: "已拒绝",
    CANCELLED: "已取消",
    COMPLETED: "已完成",
  };
  return map[status] || "未知";
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
  searchForm.keyword = "";
  searchForm.status = "";
  pagination.pageNum = 1;
  loadData();
};

const handleView = (row) => {
  ElMessage.info("查看功能开发中");
};

const handleApprove = (row) => {
  reviewTitle.value = "通过审核";
  reviewForm.activityId = row.id;
  reviewForm.approved = true;
  reviewForm.note = "";
  reviewDialogVisible.value = true;
};

const handleReject = (row) => {
  reviewTitle.value = "拒绝审核";
  reviewForm.activityId = row.id;
  reviewForm.approved = false;
  reviewForm.note = "";
  reviewDialogVisible.value = true;
};

const handleReviewSubmit = async () => {
  try {
    submitting.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    ElMessage.success("审核成功");
    reviewDialogVisible.value = false;
    loadData();
  } catch (error) {
    ElMessage.error("审核失败");
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除活动"${row.title}"吗？`, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    ElMessage.success("删除成功");
    loadData();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};
</script>

<style scoped lang="scss">
.activity-audit {
  .search-card {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
