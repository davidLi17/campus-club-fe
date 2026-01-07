<template>
  <div class="activity-audit">
    <el-card class="search-card">
      <el-form
        :inline="true"
        :model="searchForm"
        class="search-form"
        @submit.prevent="handleSearch"
      >
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索活动名称"
            clearable
          />
        </el-form-item>
        <el-form-item width="200px" label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="待审核" :value="ActivityStatus.PENDING" />
            <el-option label="已通过" :value="ActivityStatus.PUBLISHED" />
            <el-option label="已拒绝" :value="ActivityStatus.REJECTED" />
            <el-option label="已取消" :value="ActivityStatus.CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 刷新数据
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
        <el-table-column prop="startTime" label="开始时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="currentMembers" label="报名/上限" width="120">
          <template #default="{ row }">
            {{ row.currentMembers }} / {{ row.maxMembers }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getActivityStatusType(row.status)">
              {{ getActivityStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="isActivityPending(row.status)"
              size="small"
              type="success"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="isActivityPending(row.status)"
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
    <el-dialog v-model="reviewDialogVisible" :title="reviewTitle" width="900px">
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="活动详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动ID">
          {{ viewActivity?.id }}
        </el-descriptions-item>
        <el-descriptions-item label="活动名称">
          {{ viewActivity?.title }}
        </el-descriptions-item>
        <el-descriptions-item label="所属社团">
          {{ viewActivity?.clubName }}
        </el-descriptions-item>
        <el-descriptions-item label="活动地点">
          {{ viewActivity?.location }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getActivityStatusType(viewActivity?.status)">
            {{ getActivityStatusText(viewActivity?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="报名人数">
          {{ viewActivity?.currentMembers }} /
          {{ viewActivity?.maxMembers || "不限" }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ formatDateTime(viewActivity?.startTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ formatDateTime(viewActivity?.endTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="活动内容" :span="2">
          <div style="white-space: pre-wrap">{{ viewActivity?.content }}</div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
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
import {
  getActivityStatusType,
  getActivityStatusText,
  isActivityPending,
  ActivityStatus,
} from "@/constants/activity";
import { formatDateTime } from "@/utils/date";

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
  status: "",
  note: "",
});
const submitting = ref(false);
const viewDialogVisible = ref(false);
const viewActivity = ref(null);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const data = await getAllActivities({
      ...searchForm,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    });
    tableData.value = data.records || [];
    pagination.total = data.total || 0;
  } catch (error) {
    console.error("加载数据失败:", error);
    ElMessage.error("加载数据失败");
  } finally {
    loading.value = false;
  }
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
  viewActivity.value = row;
  viewDialogVisible.value = true;
};
// 审核状态：published-通过，rejected-拒绝

const handleApprove = (row) => {
  reviewTitle.value = "通过审核";
  reviewForm.activityId = row.id;
  reviewForm.status = ActivityStatus.PUBLISHED;
  reviewForm.note = "";
  reviewDialogVisible.value = true;
};

const handleReject = (row) => {
  reviewTitle.value = "拒绝审核";
  reviewForm.activityId = row.id;
  reviewForm.status = ActivityStatus.REJECTED;
  reviewForm.note = "";
  reviewDialogVisible.value = true;
};

const handleReviewSubmit = async () => {
  try {
    submitting.value = true;
    await reviewActivity(reviewForm.activityId, {
      status: reviewForm.status,
      note: reviewForm.note,
    });
    ElMessage.success("审核成功");
    reviewDialogVisible.value = false;
    loadData();
  } catch (error) {
    console.error("审核失败:", error);
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

    await deleteActivity(row.id);
    ElMessage.success("删除成功");
    loadData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
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
