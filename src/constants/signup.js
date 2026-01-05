/**
 * 报名/签到相关常量和工具函数
 */

// 报名状态枚举（后端返回小写）
export const SignupStatus = Object.freeze({
  REGISTERED: "registered",
  CANCELLED: "cancelled",
  CHECKED_IN: "checked_in",
  ABSENT: "absent",
});

// 签到操作类型（用于接口调用）
export const CheckinAction = Object.freeze({
  CHECK_IN: "check_in",
  ABSENT: "absent",
});

/**
 * 获取报名状态对应的 Tag 类型
 */
export function getSignupStatusType(status) {
  const map = {
    [SignupStatus.REGISTERED]: "warning",
    [SignupStatus.CHECKED_IN]: "success",
    [SignupStatus.ABSENT]: "danger",
    [SignupStatus.CANCELLED]: "info",
  };
  return map[status] || "info";
}

/**
 * 获取报名状态显示文本
 */
export function getSignupStatusText(status) {
  const map = {
    [SignupStatus.REGISTERED]: "已报名",
    [SignupStatus.CHECKED_IN]: "已签到",
    [SignupStatus.ABSENT]: "缺席",
    [SignupStatus.CANCELLED]: "已取消",
  };
  return map[status] || "未知";
}

/**
 * 判断是否为已报名状态（可以进行签到操作）
 */
export function isRegistered(status) {
  return status === SignupStatus.REGISTERED;
}

/**
 * 判断是否已签到
 */
export function isCheckedIn(status) {
  return status === SignupStatus.CHECKED_IN;
}

/**
 * 判断是否缺席
 */
export function isAbsent(status) {
  return status === SignupStatus.ABSENT;
}

/**
 * 判断是否可以进行签到操作（仅已报名状态可操作）
 */
export function canCheckin(status) {
  return isRegistered(status);
}
