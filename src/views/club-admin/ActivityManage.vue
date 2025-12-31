<template>
  <div class="activity-manage">
    <el-card class="action-card">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        创建活动
      </el-button>
    </el-card>

    <el-card class="table-card">
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="活动名称" min-width="180" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
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
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button size="small" type="info" @click="handleSignups(row)"
              >报名列表</el-button
            >
            <el-button size="small" type="danger" @click="handleCancel(row)"
              >取消</el-button
            >
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
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
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 报名列表对话框 -->
    <el-dialog v-model="signupDialogVisible" title="报名列表" width="900px">
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
    <el-dialog v-model="viewDialogVisible" title="活动详情" width="700px">
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
          {{ viewActivity?.startTime }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ viewActivity?.endTime }}
        </el-descriptions-item>
        <el-descriptions-item label="报名开始时间">
          {{ viewActivity?.signupStartTime || "未设置" }}
        </el-descriptions-item>
        <el-descriptions-item label="报名结束时间">
          {{ viewActivity?.signupEndTime || "未设置" }}
        </el-descriptions-item>
        <el-descriptions-item label="报名人数">
          {{ viewActivity?.currentMembers }} /
          {{ viewActivity?.maxMembers || "不限" }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ viewActivity?.createTime }}
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
  createActivity,
  updateActivity,
  cancelActivity,
  getActivitySignups,
  checkinActivity,
} from "@/api/clubAdmin";
import { getActivityList } from "@/api/activity";
import { getMyClubs } from "@/api/club";
import {
  getActivityStatusType,
  getActivityStatusText,
} from "@/constants/activity";
import {
  getSignupStatusType,
  getSignupStatusText,
  canCheckin,
  CheckinAction,
} from "@/constants/signup";

const loading = ref(false);
const tableData = ref([]);
const currentClubId = ref(null);
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const dialogVisible = ref(false);
const dialogTitle = ref("创建活动");
const formRef = ref(null);
const submitting = ref(false);
const viewDialogVisible = ref(false);
const viewActivity = ref(null);
const form = reactive({
  id: null,
  clubId: null,
  title: "",
  content: "",
  location: "",
  startTime: "",
  endTime: "",
  signupStartTime: "",
  signupEndTime: "",
  maxMembers: 50,
});

const formRules = {
  title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
  content: [{ required: true, message: "请输入活动内容", trigger: "blur" }],
  location: [{ required: true, message: "请输入活动地点", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  maxMembers: [{ required: true, message: "请输入人数上限", trigger: "blur" }],
};

const signupDialogVisible = ref(false);
const signupLoading = ref(false);
const signupData = ref([]);
const currentActivity = ref(null);
const signupPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

onMounted(async () => {
  await initClub();
  loadData();
});

const initClub = async () => {
  try {
    const clubs = await getMyClubs();
    if (clubs && clubs.length > 0) {
      const club = clubs.find((c) => c.role === "LEADER") || clubs[0];
      currentClubId.value = club.id;
    }
  } catch (error) {
    console.error("获取社团信息失败:", error);
    ElMessage.error("获取社团信息失败");
  }
};

const loadData = async () => {
  if (!currentClubId.value) return;

  loading.value = true;
  try {
    const data = await getActivityList({
      clubId: currentClubId.value,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    });
    tableData.value = data.records || [];
    pagination.total = data.total || 0;
  } catch (error) {
    console.error("加载活动列表失败:", error);
    ElMessage.error("加载活动列表失败");
  } finally {
    loading.value = false;
  }
};

const loadSignups = async () => {
  if (!currentActivity.value) return;

  signupLoading.value = true;
  try {
    const data = await getActivitySignups(currentActivity.value.id, {
      pageNum: signupPagination.pageNum,
      pageSize: signupPagination.pageSize,
    });
    signupData.value = data.records || [];
    signupPagination.total = data.total || 0;
  } catch (error) {
    console.error("加载报名列表失败:", error);
    ElMessage.error("加载报名列表失败");
  } finally {
    signupLoading.value = false;
  }
};

const handleCreate = () => {
  dialogTitle.value = "创建活动";
  Object.assign(form, {
    id: null,
    clubId: currentClubId.value,
    title: "",
    content: "",
    location: "",
    startTime: "",
    endTime: "",
    signupStartTime: "",
    signupEndTime: "",
    maxMembers: 50,
  });
  dialogVisible.value = true;
};

const handleView = (row) => {
  viewActivity.value = row;
  viewDialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = "编辑活动";
  Object.assign(form, {
    id: row.id,
    clubId: row.clubId,
    title: row.title,
    content: row.content,
    location: row.location,
    startTime: row.startTime,
    endTime: row.endTime,
    signupStartTime: row.signupStartTime,
    signupEndTime: row.signupEndTime,
    maxMembers: row.maxMembers,
  });
  dialogVisible.value = true;
};

const handleSignups = (row) => {
  currentActivity.value = row;
  signupPagination.pageNum = 1;
  signupDialogVisible.value = true;
  loadSignups();
};

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要取消活动"${row.title}"吗？`, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await cancelActivity(row.id);
    ElMessage.success("取消成功");
    loadData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("取消失败:", error);
      ElMessage.error("取消失败");
    }
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitting.value = true;

    if (form.id) {
      await updateActivity(form.id, {
        title: form.title,
        content: form.content,
        location: form.location,
        startTime: form.startTime,
        endTime: form.endTime,
        signupStartTime: form.signupStartTime,
        signupEndTime: form.signupEndTime,
        maxMembers: form.maxMembers,
      });
      ElMessage.success("更新成功");
    } else {
      await createActivity({
        clubId: form.clubId,
        title: form.title,
        content: form.content,
        location: form.location,
        startTime: form.startTime,
        endTime: form.endTime,
        signupStartTime: form.signupStartTime,
        signupEndTime: form.signupEndTime,
        maxMembers: form.maxMembers,
      });
      ElMessage.success("创建成功");
    }

    dialogVisible.value = false;
    loadData();
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitting.value = false;
  }
};

const handleCheckin = async (row, status) => {
  try {
    const action =
      status === "PRESENT" ? CheckinAction.CHECK_IN : CheckinAction.ABSENT;
    await checkinActivity(currentActivity.value.id, {
      userIds: [row.userId],
      action: action,
    });
    ElMessage.success(status === "PRESENT" ? "签到成功" : "已标记缺席");
    loadSignups();
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
  }
};
</script>

<style scoped lang="scss">
.activity-manage {
  .action-card {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
