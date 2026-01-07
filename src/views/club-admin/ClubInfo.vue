<template>
  <div class="club-info">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>社团信息</span>
          <el-button type="primary" @click="handleEdit">编辑信息</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="社团名称">{{
          clubInfo.name
        }}</el-descriptions-item>
        <el-descriptions-item label="成员数量">{{
          clubInfo.memberCount
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDateTime(clubInfo.createTime)
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getClubStatusType(clubInfo.status)">
            {{ getClubStatusText(clubInfo.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="社团简介" :span="2">
          {{ clubInfo.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑社团信息" width="900px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="社团名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="社团简介" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="Logo URL" prop="logo">
          <el-input v-model="form.logo" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { updateClubInfo } from "@/api/clubAdmin";
import { useClubSelector } from "@/composables/useClubSelector";
import { getClubStatusType, getClubStatusText } from "@/constants/club";
import { formatDateTime } from "@/utils/date";

// 使用共享的社团选择器
const { currentClub, currentClubId, initIfNeeded } = useClubSelector();

const clubInfo = ref({
  id: null,
  name: "",
  description: "",
  memberCount: 0,
  status: "",
  createTime: "",
});

const dialogVisible = ref(false);
const formRef = ref(null);
const submitting = ref(false);
const form = reactive({
  name: "",
  description: "",
  logo: "",
});

const formRules = {
  name: [{ required: true, message: "请输入社团名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入社团简介", trigger: "blur" }],
};

onMounted(async () => {
  await initIfNeeded();
  loadClubInfo();
});

// 监听社团切换，自动刷新数据
watch(currentClubId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadClubInfo();
  }
});

const loadClubInfo = () => {
  if (currentClub.value) {
    clubInfo.value = { ...currentClub.value };
  }
};

const handleEdit = () => {
  Object.assign(form, {
    name: clubInfo.value.name,
    description: clubInfo.value.description,
    logo: clubInfo.value.logo || "",
  });
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitting.value = true;

    await updateClubInfo(clubInfo.value.id, form);

    Object.assign(clubInfo.value, form);
    ElMessage.success("更新成功");
    dialogVisible.value = false;
  } catch (error) {
    console.error("更新失败:", error);
    ElMessage.error("更新失败");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.club-info {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
