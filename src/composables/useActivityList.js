import { ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getActivityList } from "@/api/activity";
import { cancelActivity } from "@/api/clubAdmin";
import { useClubSelector } from "./useClubSelector";

/**
 * 活动列表管理 Hook
 * 职责：活动列表数据加载、分页、活动取消
 */
export function useActivityList() {
  const loading = ref(false);
  const tableData = ref([]);
  const pagination = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 使用共享的社团选择器
  const { currentClubId, initIfNeeded } = useClubSelector();

  /**
   * 加载活动列表
   */
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

  /**
   * 取消活动
   */
  const handleCancel = async (row) => {
    try {
      await ElMessageBox.confirm(`确定要取消活动"${row.title}"吗？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      await cancelActivity(row.id);
      ElMessage.success("取消成功");
      await loadData();
    } catch (error) {
      if (error !== "cancel") {
        console.error("取消失败:", error);
        ElMessage.error("取消失败");
      }
    }
  };

  /**
   * 监听社团切换，自动刷新数据
   */
  watch(currentClubId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      pagination.pageNum = 1;
      loadData();
    }
  });

  return {
    loading,
    tableData,
    currentClubId,
    pagination,
    initIfNeeded,
    loadData,
    handleCancel,
  };
}
