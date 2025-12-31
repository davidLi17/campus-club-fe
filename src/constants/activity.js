/**
 * 活动相关常量和工具函数
 */

/**
 * 活动状态值类型
 * @typedef {'draft' | 'pending' | 'published' | 'rejected' | 'cancelled' | 'completed'} ActivityStatusValue
 */

/**
 * 活动状态枚举（后端返回小写）
 * @readonly
 * @type {{readonly DRAFT: 'draft', readonly PENDING: 'pending', readonly PUBLISHED: 'published', readonly REJECTED: 'rejected', readonly CANCELLED: 'cancelled', readonly COMPLETED: 'completed'}}
 */
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
 * @param {ActivityStatusValue} status 活动状态
 * @returns {'info' | 'warning' | 'success' | ''} Element Plus Tag 类型
 */
export function getActivityStatusType(status) {
  const s = status?.toLowerCase?.() || status;
  /** @type {{[key: string]: 'info' | 'warning' | 'success' | ''}} */
  const map = {
    [ActivityStatus.DRAFT]: "info",
    [ActivityStatus.PENDING]: "warning",
    [ActivityStatus.PUBLISHED]: "success",
    [ActivityStatus.CANCELLED]: "info",
    [ActivityStatus.COMPLETED]: "",
  };
  return map[s] || "info";
}

/**
 * 获取活动状态显示文本
 * @param {ActivityStatusValue} status 活动状态
 * @returns {string} 状态文本
 */
export function getActivityStatusText(status) {
  const s = status?.toLowerCase?.() || status;
  /** @type {{[key: string]: string}} */
  const map = {
    [ActivityStatus.DRAFT]: "草稿",
    [ActivityStatus.PENDING]: "待审核",
    [ActivityStatus.PUBLISHED]: "已发布",
    [ActivityStatus.REJECTED]: "已拒绝",
    [ActivityStatus.CANCELLED]: "已取消",
    [ActivityStatus.COMPLETED]: "已完成",
  };
  return map[s] || "未知";
}

/**
 * 判断活动是否为待审核状态
 * @param {ActivityStatusValue} status 活动状态
 * @returns {boolean}
 */
export function isActivityPending(status) {
  return status?.toLowerCase?.() === ActivityStatus.PENDING;
}

/**
 * 判断活动是否为已发布状态
 * @param {ActivityStatusValue} status 活动状态
 * @returns {boolean}
 */
export function isActivityPublished(status) {
  return status?.toLowerCase?.() === ActivityStatus.PUBLISHED;
}

/**
 * 判断活动是否为草稿状态
 * @param {ActivityStatusValue} status 活动状态
 * @returns {boolean}
 */
export function isActivityDraft(status) {
  return status?.toLowerCase?.() === ActivityStatus.DRAFT;
}

/**
 * 判断活动是否已结束（已取消或已完成）
 * @param {ActivityStatusValue} status 活动状态
 * @returns {boolean}
 */
export function isActivityEnded(status) {
  const s = status?.toLowerCase?.();
  return s === ActivityStatus.CANCELLED || s === ActivityStatus.COMPLETED;
}
