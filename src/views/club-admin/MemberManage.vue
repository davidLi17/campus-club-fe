<template>
  <div class="member-manage">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="成员列表" name="members">
        <el-card>
          <el-table v-loading="loading" :data="memberData" border>
            <el-table-column prop="userId" label="用户ID" width="100" />
            <el-table-column prop="username" label="用户名" width="150" />
            <el-table-column prop="realName" label="真实姓名" width="150" />
            <el-table-column prop="studentId" label="学号" width="150" />
            <el-table-column prop="role" label="角色" width="120">
              <template #default="{ row }">
                <el-tag :type="row.role === 'LEADER' ? 'danger' : 'info'">
                  {{ row.role === "LEADER" ? "负责人" : "成员" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="joinTime" label="加入时间" width="180" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="申请审核" name="applications">
        <el-card>
          <el-table v-loading="loading" :data="applicationData" border>
            <el-table-column prop="id" label="申请ID" width="100" />
            <el-table-column prop="realName" label="申请人" width="150" />
            <el-table-column prop="studentId" label="学号" width="150" />
            <el-table-column prop="reason" label="申请理由" min-width="200" />
            <el-table-column prop="createTime" label="申请时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
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
                  type="danger"
                  @click="handleReject(row)"
                >
                  拒绝
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              v-model:current-page="pagination.pageNum"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              layout="total, prev, pager, next"
              @size-change="loadApplications"
              @current-change="loadApplications"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

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
import { ElMessage } from "element-plus";
import {
  getClubPendingApplications,
  reviewClubApplication,
} from "@/api/clubAdmin";
import { getClubMembers } from "@/api/club";

const activeTab = ref("members");
const loading = ref(false);
const memberData = ref([]);
const applicationData = ref([]);
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const reviewDialogVisible = ref(false);
const reviewTitle = ref("");
const reviewForm = reactive({
  applicationId: null,
  approved: true,
  note: "",
});
const submitting = ref(false);

onMounted(() => {
  loadMembers();
});

const loadMembers = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    memberData.value = [
      {
        userId: 1,
        username: "user001",
        realName: "张三",
        studentId: "20230001",
        role: "LEADER",
        joinTime: "2024-01-15 10:00:00",
      },
      {
        userId: 2,
        username: "user002",
        realName: "李四",
        studentId: "20230002",
        role: "MEMBER",
        joinTime: "2024-01-16 11:20:00",
      },
    ];
  } finally {
    loading.value = false;
  }
};

const loadApplications = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    applicationData.value = [
      {
        id: 1,
        userId: 3,
        username: "user003",
        realName: "王五",
        studentId: "20230003",
        reason: "我对编程很感兴趣，希望能加入社团学习",
        status: "PENDING",
        createTime: "2024-06-10 14:30:00",
      },
      {
        id: 2,
        userId: 4,
        username: "user004",
        realName: "赵六",
        studentId: "20230004",
        reason: "想提升编程技能",
        status: "PENDING",
        createTime: "2024-06-11 09:15:00",
      },
    ];
    pagination.total = 2;
  } finally {
    loading.value = false;
  }
};

const handleTabChange = (tab) => {
  if (tab === "applications") {
    loadApplications();
  }
};

const getStatusType = (status) => {
  const map = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "danger",
  };
  return map[status] || "info";
};

const getStatusText = (status) => {
  const map = {
    PENDING: "待审核",
    APPROVED: "已通过",
    REJECTED: "已拒绝",
  };
  return map[status] || "未知";
};

const handleApprove = (row) => {
  reviewTitle.value = "通过申请";
  reviewForm.applicationId = row.id;
  reviewForm.approved = true;
  reviewForm.note = "";
  reviewDialogVisible.value = true;
};

const handleReject = (row) => {
  reviewTitle.value = "拒绝申请";
  reviewForm.applicationId = row.id;
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
    loadApplications();
  } catch (error) {
    ElMessage.error("审核失败");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.member-manage {
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
