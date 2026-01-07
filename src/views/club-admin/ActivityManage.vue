<template>
  <div class="activity-manage">
    <el-card class="action-card">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        创建活动
      </el-button>
      <el-button v-if="hasDraft()" type="info" @click="handleShowDraftInfo">
        <el-icon><Document /></el-icon>
        有未提交的草稿
      </el-button>
    </el-card>

    <el-card class="table-card">
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="活动名称" min-width="180" />
        <el-table-column prop="location" label="地点" width="150" />
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
        <el-table-column label="操作" width="380" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="success" @click="handleSignups(row)">
              <el-icon><User /></el-icon>
              报名列表
            </el-button>
            <el-button size="small" type="danger" @click="handleCancel(row)">
              <el-icon><Delete /></el-icon>
              取消
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
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="报名开始时间" prop="signupStartTime">
          <el-date-picker
            v-model="form.signupStartTime"
            type="datetime"
            placeholder="选择报名开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="报名结束时间" prop="signupEndTime">
          <el-date-picker
            v-model="form.signupEndTime"
            type="datetime"
            placeholder="选择报名结束时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="人数上限" prop="maxMembers">
          <el-input-number v-model="form.maxMembers" :min="1" :max="1000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <div class="footer-left">
            <el-button
              v-if="hasDraft() && !form.id"
              type="warning"
              plain
              @click="handleClearDraft"
            >
              <el-icon><Delete /></el-icon>
              清除草稿
            </el-button>
          </div>
          <div class="footer-right">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              :loading="submitting"
              @click="handleSubmit"
            >
              确定
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 报名列表对话框 -->
    <el-dialog v-model="signupDialogVisible" title="报名列表" width="1200px">
      <el-table v-loading="signupLoading" :data="signupData" border>
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="realName" label="真实姓名" width="150" />
        <el-table-column prop="studentId" label="学号" width="150" />
        <el-table-column prop="signupTime" label="报名时间" width="180" />
        <el-table-column prop="status" label="签到状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getSignupStatusType(row.status)">
              {{ getSignupStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              v-if="canCheckin(row.status)"
              size="small"
              type="success"
              @click="handleCheckin(row, 'PRESENT')"
            >
              签到
            </el-button>
            <el-button
              v-if="canCheckin(row.status)"
              size="small"
              type="warning"
              @click="handleCheckin(row, 'ABSENT')"
            >
              缺席
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="signupPagination.pageNum"
          v-model:page-size="signupPagination.pageSize"
          :total="signupPagination.total"
          layout="total, prev, pager, next"
          @size-change="loadSignups"
          @current-change="loadSignups"
        />
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="活动详情" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动名称" :span="2">
          {{ viewActivity?.title }}
        </el-descriptions-item>
        <el-descriptions-item label="活动地点">
          {{ viewActivity?.location }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getActivityStatusType(viewActivity?.status)">
            {{ getActivityStatusText(viewActivity?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ formatDateTime(viewActivity?.startTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ formatDateTime(viewActivity?.endTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="报名开始时间">
          {{ viewActivity?.signupStartTime ? formatDateTime(viewActivity.signupStartTime) : "未设置" }}
        </el-descriptions-item>
        <el-descriptions-item label="报名结束时间">
          {{ viewActivity?.signupEndTime ? formatDateTime(viewActivity.signupEndTime) : "未设置" }}
        </el-descriptions-item>
        <el-descriptions-item label="报名人数">
          {{ viewActivity?.currentMembers }} /
          {{ viewActivity?.maxMembers || "不限" }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDateTime(viewActivity?.createTime) }}
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
import { ref, onMounted } from "vue";
import { useActivityList } from "@/composables/useActivityList";
import { useActivityForm } from "@/composables/useActivityForm";
import { useActivitySignups } from "@/composables/useActivitySignups";
import {
  getActivityStatusType,
  getActivityStatusText,
} from "@/constants/activity";
import {
  getSignupStatusType,
  getSignupStatusText,
  canCheckin,
} from "@/constants/signup";
import { formatDateTime } from "@/utils/date";
import { View, Edit, User, Delete } from "@element-plus/icons-vue";

// 活动列表管理
const {
  loading,
  tableData,
  currentClubId,
  pagination,
  initIfNeeded,
  loadData,
  handleCancel,
} = useActivityList();

// 活动表单管理（含草稿功能）
const {
  dialogVisible,
  dialogTitle,
  formRef,
  submitting,
  form,
  formRules,
  hasDraft,
  handleCreate,
  handleEdit,
  handleSubmit,
  handleClearDraft,
  handleShowDraftInfo,
} = useActivityForm(currentClubId, loadData);

// 报名列表管理
const {
  signupDialogVisible,
  signupLoading,
  signupData,
  signupPagination,
  handleSignups,
  handleCheckin,
  loadSignups,
} = useActivitySignups();

// 查看详情（职责单一，保留在组件中）
const viewDialogVisible = ref(false);
const viewActivity = ref(null);

const handleView = (row) => {
  viewActivity.value = row;
  viewDialogVisible.value = true;
};

onMounted(async () => {
  await initIfNeeded();
  loadData();
});
</script>

<style scoped lang="scss">
.activity-manage {
  .action-card {
    margin-bottom: 20px;

    display: flex;
    gap: 10px;
    align-items: center;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .footer-left {
      flex: 1;
    }

    .footer-right {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
