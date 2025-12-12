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
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
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
        <el-table-column prop="attendStatus" label="签到状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getAttendType(row.attendStatus)">
              {{ getAttendText(row.attendStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              v-if="!row.attendStatus"
              size="small"
              type="success"
              @click="handleCheckin(row, 'PRESENT')"
            >
              签到
            </el-button>
            <el-button
              v-if="!row.attendStatus"
              size="small"
              type="warning"
              @click="handleCheckin(row, 'ABSENT')"
            >
              缺席
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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

const loading = ref(false);
const tableData = ref([]);
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const dialogVisible = ref(false);
const dialogTitle = ref("创建活动");
const formRef = ref(null);
const submitting = ref(false);
const form = reactive({
  id: null,
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

onMounted(() => {
  loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    tableData.value = [
      {
        id: 1,
        title: "编程马拉松大赛",
        content: "24小时编程挑战",
        location: "计算机楼301",
        startTime: "2024-06-15 09:00:00",
        endTime: "2024-06-16 09:00:00",
        status: "PENDING",
        maxMembers: 50,
        currentMembers: 25,
      },
      {
        id: 2,
        title: "技术分享会",
        content: "Vue3新特性分享",
        location: "教学楼201",
        startTime: "2024-06-20 14:00:00",
        endTime: "2024-06-20 17:00:00",
        status: "APPROVED",
        maxMembers: 100,
        currentMembers: 78,
      },
    ];
    pagination.total = 2;
  } finally {
    loading.value = false;
  }
};

const loadSignups = async () => {
  signupLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    signupData.value = [
      {
        userId: 1,
        username: "user001",
        realName: "张三",
        studentId: "20230001",
        signupTime: "2024-06-10 10:00:00",
        attendStatus: null,
      },
      {
        userId: 2,
        username: "user002",
        realName: "李四",
        studentId: "20230002",
        signupTime: "2024-06-10 11:00:00",
        attendStatus: "PRESENT",
      },
    ];
  } finally {
    signupLoading.value = false;
  }
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

const getAttendType = (status) => {
  const map = {
    PRESENT: "success",
    ABSENT: "danger",
  };
  return map[status] || "info";
};

const getAttendText = (status) => {
  const map = {
    PRESENT: "已签到",
    ABSENT: "缺席",
  };
  return map[status] || "未签到";
};

const handleCreate = () => {
  dialogTitle.value = "创建活动";
  Object.assign(form, {
    id: null,
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
  ElMessage.info("查看功能开发中");
};

const handleEdit = (row) => {
  dialogTitle.value = "编辑活动";
  Object.assign(form, row);
  dialogVisible.value = true;
};

const handleSignups = (row) => {
  currentActivity.value = row;
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

    await new Promise((resolve) => setTimeout(resolve, 500));
    ElMessage.success("取消成功");
    loadData();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("取消失败");
    }
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitting.value = true;

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (form.id) {
      ElMessage.success("更新成功");
    } else {
      ElMessage.success("创建成功");
    }

    dialogVisible.value = false;
    loadData();
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitting.value = false;
  }
};

const handleCheckin = async (row, status) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    ElMessage.success(status === "PRESENT" ? "签到成功" : "已标记缺席");
    row.attendStatus = status;
  } catch (error) {
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
