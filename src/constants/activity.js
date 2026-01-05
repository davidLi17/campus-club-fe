/**
 * 活动相关常量和工具函数
 */

// 活动状态枚举（后端返回小写）
export const ActivityStatus = Object.freeze({
  DRAFT: "draft",
  PENDING: "pending",
  PUBLISHED: "published",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
});

/**
 * 获取活动状态对应的 Tag 类型
 */
export function getActivityStatusType(status) {
  const map = {
    [ActivityStatus.DRAFT]: "info",
    [ActivityStatus.PENDING]: "warning",
    [ActivityStatus.PUBLISHED]: "success",
    [ActivityStatus.CANCELLED]: "info",
    [ActivityStatus.COMPLETED]: "",
  };
  return map[status] || "info";
}

/**
 * 获取活动状态显示文本
 */
export function getActivityStatusText(status) {
  const map = {
    [ActivityStatus.DRAFT]: "草稿",
    [ActivityStatus.PENDING]: "待审核",
    [ActivityStatus.PUBLISHED]: "已发布",
    [ActivityStatus.REJECTED]: "已拒绝",
    [ActivityStatus.CANCELLED]: "已取消",
    [ActivityStatus.COMPLETED]: "已完成",
  };
  return map[status] || "未知";
}

/**
 * 判断活动是否为待审核状态
 */
export function isActivityPending(status) {
  return status === ActivityStatus.PENDING;
}

/**
 * 判断活动是否为已发布状态
 */
export function isActivityPublished(status) {
  return status === ActivityStatus.PUBLISHED;
}

/**
 * 判断活动是否为草稿状态
 */
export function isActivityDraft(status) {
  return status === ActivityStatus.DRAFT;
}

/**
 * 判断活动是否已结束（已取消或已完成）
 */
export function isActivityEnded(status) {
  return (
    status === ActivityStatus.CANCELLED || status === ActivityStatus.COMPLETED
  );
}
