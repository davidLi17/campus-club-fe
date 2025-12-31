/**
 * 申请相关常量和工具函数
 */

// 申请状态枚举（后端返回小写）
export const ApplicationStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

/**
 * 获取申请状态对应的 Tag 类型
 * @param {string} status 申请状态
 * @returns {string} Element Plus Tag 类型
 */
export function getApplicationStatusType(status) {
  const s = status?.toLowerCase?.() || status;
  const map = {
    [ApplicationStatus.PENDING]: "warning",
    [ApplicationStatus.APPROVED]: "success",
    [ApplicationStatus.REJECTED]: "danger",
  };
  return map[s] || "info";
}

/**
 * 获取申请状态显示文本
 * @param {string} status 申请状态
 * @returns {string} 状态文本
 */
export function getApplicationStatusText(status) {
  const s = status?.toLowerCase?.() || status;
  const map = {
    [ApplicationStatus.PENDING]: "待审核",
    [ApplicationStatus.APPROVED]: "已通过",
    [ApplicationStatus.REJECTED]: "已拒绝",
  };
  return map[s] || "未知";
}

/**
 * 判断申请是否为待审核状态
 * @param {string} status 申请状态
 * @returns {boolean}
 */
export function isApplicationPending(status) {
  return status?.toLowerCase?.() === ApplicationStatus.PENDING;
}

/**
 * 判断申请是否已通过
 * @param {string} status 申请状态
 * @returns {boolean}
 */
export function isApplicationApproved(status) {
  return status?.toLowerCase?.() === ApplicationStatus.APPROVED;
}

/**
 * 判断申请是否已拒绝
 * @param {string} status 申请状态
 * @returns {boolean}
 */
export function isApplicationRejected(status) {
  return status?.toLowerCase?.() === ApplicationStatus.REJECTED;
}
