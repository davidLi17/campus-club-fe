import { ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { useStorage } from "@vueuse/core";
import { createActivity, updateActivity } from "@/api/clubAdmin";

/**
 * 活动表单管理 Hook（含草稿功能）
 * 职责：表单状态、草稿自动保存/恢复/清除、表单提交
 */
export function useActivityForm(currentClubId, onSuccess) {
  const dialogVisible = ref(false);
  const dialogTitle = ref("创建活动");
  const formRef = ref(null);
  const submitting = ref(false);

  // 表单草稿存储（使用 VueUse 的 useStorage 自动同步 localStorage）
  const formDraft = useStorage("activity-form-draft", {
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
    savedAt: null,
  });

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
    startTime: [
      { required: true, message: "请选择开始时间", trigger: "change" },
    ],
    endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
    maxMembers: [
      { required: true, message: "请输入人数上限", trigger: "blur" },
    ],
  };

  /**
   * 监听表单变化，自动保存草稿
   */
  watch(
    form,
    (newForm) => {
      // 只在创建新活动且有对话框打开时保存草稿
      if (dialogVisible.value && !form.id) {
        Object.assign(formDraft.value, {
          ...newForm,
          savedAt: new Date().toISOString(),
        });
      }
    },
    { deep: true }
  );

  /**
   * 检查是否有草稿
   */
  const hasDraft = () => {
    return formDraft.value.savedAt !== null;
  };

  /**
   * 恢复草稿
   */
  const restoreDraft = () => {
    if (hasDraft()) {
      Object.assign(form, {
        id: formDraft.value.id,
        clubId: formDraft.value.clubId || currentClubId.value,
        title: formDraft.value.title,
        content: formDraft.value.content,
        location: formDraft.value.location,
        startTime: formDraft.value.startTime,
        endTime: formDraft.value.endTime,
        signupStartTime: formDraft.value.signupStartTime,
        signupEndTime: formDraft.value.signupEndTime,
        maxMembers: formDraft.value.maxMembers,
      });

      // 显示草稿恢复提示
      const savedTime = new Date(formDraft.value.savedAt).toLocaleString();
      ElNotification({
        title: "已恢复草稿",
        message: `已恢复上次保存的内容（${savedTime}）`,
        type: "info",
        duration: 3000,
      });
    }
  };

  /**
   * 清除草稿
   */
  const clearDraft = () => {
    formDraft.value = {
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
      savedAt: null,
    };
  };

  /**
   * 处理清除草稿按钮点击
   */
  const handleClearDraft = async () => {
    try {
      await ElMessageBox.confirm("确定要清除草稿吗？此操作不可恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      clearDraft();

      // 重置表单
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

      ElMessage.success("草稿已清除");
    } catch (error) {
      // 用户取消操作
    }
  };

  /**
   * 显示草稿信息
   */
  const handleShowDraftInfo = () => {
    const savedTime = new Date(formDraft.value.savedAt).toLocaleString();
    ElMessageBox.alert(
      `草稿保存时间：${savedTime}<br/>活动名称：${
        formDraft.value.title || "未填写"
      }`,
      "草稿信息",
      {
        confirmButtonText: "知道了",
        dangerouslyUseHTMLString: true,
      }
    );
  };

  /**
   * 创建活动
   */
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

    // 自动恢复草稿
    restoreDraft();
  };

  /**
   * 编辑活动
   */
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

  /**
   * 提交表单
   */
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
        const dataRes = await createActivity({
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
        console.log("🔍LHG:useActivityForm dataRes:::", dataRes);
        ElMessage.success("活动创建成功，等待系统管理员审核");

        // 创建成功后清除草稿
        clearDraft();
      }

      dialogVisible.value = false;

      // 调用成功回调（通常是刷新列表）
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("提交失败:", error);
      ElMessage.error("操作失败");
    } finally {
      submitting.value = false;
    }
  };

  return {
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
  };
}
