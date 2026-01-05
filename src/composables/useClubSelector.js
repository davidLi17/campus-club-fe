import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { getManagedClubs } from "@/api/club";

// 单例模式 - 共享状态
const managedClubs = ref([]);
const selectedClubId = useStorage("selected-club-id", null);
const loading = ref(false);
const initialized = ref(false);

/**
 * 社团选择器 Hook（全局共享）
 * 职责：管理社团列表、当前选中社团、社团切换
 */
export function useClubSelector() {
  /**
   * 当前选中的社团对象
   */
  const currentClub = computed(() => {
    if (!selectedClubId.value || managedClubs.value.length === 0) {
      return null;
    }
    return (
      managedClubs.value.find((c) => c.id === selectedClubId.value) || null
    );
  });

  /**
   * 当前选中的社团 ID
   */
  const currentClubId = computed(() => selectedClubId.value);

  /**
   * 是否有管理的社团
   */
  const hasClubs = computed(() => managedClubs.value.length > 0);

  /**
   * 加载管理的社团列表
   */
  const loadManagedClubs = async () => {
    if (loading.value) return;

    loading.value = true;
    try {
      const clubs = await getManagedClubs();
      managedClubs.value = clubs || [];

      // 如果之前选中的社团不在列表中，或者没有选中，则选中第一个
      if (clubs && clubs.length > 0) {
        const existsInList = clubs.some((c) => c.id === selectedClubId.value);
        if (!existsInList) {
          selectedClubId.value = clubs[0].id;
        }
      } else {
        selectedClubId.value = null;
      }

      initialized.value = true;
    } catch (error) {
      console.error("获取管理社团列表失败:", error);
      ElMessage.error("获取管理社团列表失败");
    } finally {
      loading.value = false;
    }
  };

  /**
   * 切换选中的社团
   */
  const selectClub = (clubId) => {
    if (clubId !== selectedClubId.value) {
      selectedClubId.value = clubId;
    }
  };

  /**
   * 初始化（仅首次调用时加载）
   */
  const initIfNeeded = async () => {
    if (!initialized.value) {
      await loadManagedClubs();
    }
  };

  return {
    // 状态
    managedClubs,
    currentClub,
    currentClubId,
    loading,
    hasClubs,
    initialized,
    // 方法
    loadManagedClubs,
    selectClub,
    initIfNeeded,
  };
}
