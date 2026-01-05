import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getActivitySignups, checkinActivity } from "@/api/clubAdmin";
import { CheckinAction } from "@/constants/signup";

/**
 * 活动报名列表管理 Hook
 * 职责：报名列表加载、分页、签到操作
 */
export function useActivitySignups() {
  const signupDialogVisible = ref(false);
  const signupLoading = ref(false);
  const signupData = ref([]);
  const currentActivity = ref(null);
  const signupPagination = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  /**
   * 加载报名列表
   */
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

  /**
   * 打开报名列表对话框
   */
  const handleSignups = (row) => {
    currentActivity.value = row;
    signupPagination.pageNum = 1;
    signupDialogVisible.value = true;
    loadSignups();
  };

  /**
   * 处理签到操作
   */
  const handleCheckin = async (row, status) => {
    try {
      const action =
        status === "PRESENT" ? CheckinAction.CHECK_IN : CheckinAction.ABSENT;
      await checkinActivity(currentActivity.value.id, {
        userIds: [row.userId],
        action: action,
      });
      ElMessage.success(status === "PRESENT" ? "签到成功" : "已标记缺席");
      await loadSignups();
    } catch (error) {
      console.error("操作失败:", error);
      ElMessage.error("操作失败");
    }
  };

  return {
    signupDialogVisible,
    signupLoading,
    signupData,
    currentActivity,
    signupPagination,
    handleSignups,
    handleCheckin,
    loadSignups,
  };
}
