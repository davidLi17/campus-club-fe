/**
 * 报名/签到相关常量和工具函数
 */

// 报名状态枚举（活动报名列表中的 status 字段，后端返回小写）
export const SignupStatus = {
  SIGNED_UP: "signed_up",
  CHECKED_IN: "checked_in",
  ABSENT: "absent",
  CANCELLED: "cancelled",
};

// 签到操作类型（用于接口调用）
export const CheckinAction = {
  CHECK_IN: "check_in",
  ABSENT: "absent",
};

/**
 * 获取报名状态对应的 Tag 类型
 * @param {string} status 报名状态
 * @returns {string} Element Plus Tag 类型
 */
export function getSignupStatusType(status) {
  const s = status?.toLowerCase?.() || status;
  const map = {
    [SignupStatus.SIGNED_UP]: "warning",
    [SignupStatus.CHECKED_IN]: "success",
    [SignupStatus.ABSENT]: "danger",
    [SignupStatus.CANCELLED]: "info",
  };
  return map[s] || "info";
}

/**
 * 获取报名状态显示文本
 * @param {string} status 报名状态
 * @returns {string} 状态文本
 */
export function getSignupStatusText(status) {
  const s = status?.toLowerCase?.() || status;
  const map = {
    [SignupStatus.SIGNED_UP]: "已报名",
    [SignupStatus.CHECKED_IN]: "已签到",
    [SignupStatus.ABSENT]: "缺席",
    [SignupStatus.CANCELLED]: "已取消",
  };
  return map[s] || "未知";
}

/**
 * 判断是否为已报名状态（可以进行签到操作）
 * @param {string} status 报名状态
 * @returns {boolean}
 */
export function isSignedUp(status) {
  return status?.toLowerCase?.() === SignupStatus.SIGNED_UP;
}

/**
 * 判断是否已签到
 * @param {string} status 报名状态
 * @returns {boolean}
 */
export function isCheckedIn(status) {
  return status?.toLowerCase?.() === SignupStatus.CHECKED_IN;
}

/**
 * 判断是否缺席
 * @param {string} status 报名状态
 * @returns {boolean}
 */
export function isAbsent(status) {
  return status?.toLowerCase?.() === SignupStatus.ABSENT;
}

/**
 * 判断是否可以进行签到操作（仅已报名状态可操作）
 * @param {string} status 报名状态
 * @returns {boolean}
 */
export function canCheckin(status) {
  return isSignedUp(status);
}
