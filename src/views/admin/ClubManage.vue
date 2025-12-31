<template>
  <div class="club-manage">
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
            placeholder="搜索社团名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
          <el-button type="success" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            创建社团
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="社团名称" min-width="150" />
        <el-table-column
          prop="description"
          label="社团简介"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="createUsername" label="创建人" width="120" />
        <el-table-column prop="memberCount" label="成员数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getClubStatusType(row.status)">
              {{ getClubStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)"> 查看 </el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button size="small" type="warning" @click="handleMembers(row)">
              成员
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

    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="社团名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入社团名称" />
        </el-form-item>
        <el-form-item label="社团简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入社团简介"
          />
        </el-form-item>
        <el-form-item label="社团Logo" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入Logo URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 成员列表对话框 -->
    <el-dialog v-model="memberDialogVisible" title="社团成员管理" width="900px">
      <el-table v-loading="memberLoading" :data="memberData" border>
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'LEADER' ? 'danger' : 'info'">
              {{ row.role === "LEADER" ? "负责人" : "成员" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinTime" label="加入时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.role !== 'LEADER'"
              size="small"
              type="primary"
              @click="handleSetLeader(row)"
            >
              设为负责人
            </el-button>
            <el-button
              v-else
              size="small"
              type="warning"
              @click="handleRemoveLeader(row)"
            >
              取消负责人
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="memberPagination.pageNum"
          v-model:page-size="memberPagination.pageSize"
          :total="memberPagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadMembers"
          @current-change="loadMembers"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  createClub,
  updateClub,
  deleteClub,
  setClubLeader,
  removeClubLeader,
} from "@/api/admin";
import { getClubList, getClubMembers } from "@/api/club";
import { getClubStatusType, getClubStatusText } from "@/utils/statusMap";

const loading = ref(false);
const tableData = ref([]);
const searchForm = reactive({
  keyword: "",
});
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const dialogVisible = ref(false);
const dialogTitle = ref("创建社团");
const formRef = ref(null);
const submitting = ref(false);
const form = reactive({
  id: null,
  name: "",
  description: "",
  logo: "",
});

const formRules = {
  name: [{ required: true, message: "请输入社团名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入社团简介", trigger: "blur" }],
};

const memberDialogVisible = ref(false);
const memberLoading = ref(false);
const memberData = ref([]);
const currentClub = ref(null);
const memberPagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const data = await getClubList({
      ...searchForm,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    });
    tableData.value = data.records || [];
    pagination.total = data.total || 0;
  } catch (error) {
    ElMessage.error("加载数据失败");
  } finally {
    loading.value = false;
  }
};

const loadMembers = async () => {
  if (!currentClub.value) return;

  memberLoading.value = true;
  try {
    const data = await getClubMembers(currentClub.value.id, {
      pageNum: memberPagination.pageNum,
      pageSize: memberPagination.pageSize,
    });
    memberData.value = data.records || [];
    memberPagination.total = data.total || 0;
  } catch (error) {
    ElMessage.error("加载成员失败");
  } finally {
    memberLoading.value = false;
  }
};

const handleSearch = () => {
  pagination.pageNum = 1;
  loadData();
};

const handleReset = () => {
  searchForm.keyword = "";
  pagination.pageNum = 1;
  loadData();
};

const handleCreate = () => {
  dialogTitle.value = "创建社团";
  Object.assign(form, {
    id: null,
    name: "",
    description: "",
    logo: "",
  });
  dialogVisible.value = true;
};

const handleView = (row) => {
  ElMessage.info("查看功能开发中");
};

const handleEdit = (row) => {
  dialogTitle.value = "编辑社团";
  Object.assign(form, {
    id: row.id,
    name: row.name,
    description: row.description,
    logo: row.logo || "",
  });
  dialogVisible.value = true;
};

const handleMembers = (row) => {
  currentClub.value = row;
  memberPagination.pageNum = 1;
  memberDialogVisible.value = true;
  loadMembers();
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除社团"${row.name}"吗？此操作不可恢复！`,
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await deleteClub(row.id);

    ElMessage.success("删除成功");
    loadData();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    submitting.value = true;

    if (form.id) {
      await updateClub(form);
      ElMessage.success("更新成功");
    } else {
      await createClub(form);
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

const handleDialogClose = () => {
  formRef.value?.resetFields();
};

const handleSetLeader = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要将"${row.realName}"设置为社团负责人吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }
    );

    await setClubLeader(currentClub.value.id, row.userId);

    ElMessage.success("设置成功");
    loadMembers();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("设置失败");
    }
  }
};

const handleRemoveLeader = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消"${row.realName}"的负责人身份吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await removeClubLeader(currentClub.value.id, row.userId);

    ElMessage.success("取消成功");
    loadMembers();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("取消失败");
    }
  }
};
</script>

<style scoped lang="scss">
.club-manage {
  .search-card {
    margin-bottom: 20px;

    .search-form {
      margin-bottom: 0;
    }
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
