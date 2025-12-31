/**
 * 状态映射工具
 * 统一管理系统中各种状态的展示
 */

// 社团状态
export const ClubStatus = {
  NORMAL: "NORMAL",
  DISABLED: "DISABLED",
  PENDING: "PENDING",
};

export function getClubStatusType(status) {
  const map = {
    [ClubStatus.NORMAL]: "success",
    [ClubStatus.DISABLED]: "info",
    [ClubStatus.PENDING]: "warning",
  };
  return map[status] || "info";
}

export function getClubStatusText(status) {
  const map = {
    [ClubStatus.NORMAL]: "正常",
    [ClubStatus.DISABLED]: "停用",
    [ClubStatus.PENDING]: "待审核",
  };
  return map[status] || "未知";
}

// 活动状态
export const ActivityStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

export function getActivityStatusType(status) {
  const map = {
    [ActivityStatus.DRAFT]: "info",
    [ActivityStatus.PENDING]: "warning",
    [ActivityStatus.PUBLISHED]: "success",
    [ActivityStatus.CANCELLED]: "info",
    [ActivityStatus.COMPLETED]: "info",
  };
  return map[status] || "info";
}

export function getActivityStatusText(status) {
  const map = {
    [ActivityStatus.DRAFT]: "草稿",
    [ActivityStatus.PENDING]: "待审核",
    [ActivityStatus.PUBLISHED]: "已发布",
    [ActivityStatus.CANCELLED]: "已取消",
    [ActivityStatus.COMPLETED]: "已完成",
  };
  return map[status] || "未知";
}

// 申请状态
export const ApplicationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export function getApplicationStatusType(status) {
  const map = {
    [ApplicationStatus.PENDING]: "warning",
    [ApplicationStatus.APPROVED]: "success",
    [ApplicationStatus.REJECTED]: "danger",
  };
  return map[status] || "info";
}

export function getApplicationStatusText(status) {
  const map = {
    [ApplicationStatus.PENDING]: "待审核",
    [ApplicationStatus.APPROVED]: "已通过",
    [ApplicationStatus.REJECTED]: "已拒绝",
  };
  return map[status] || "未知";
}

// 签到状态
export const AttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
};

export function getAttendanceStatusType(status) {
  const map = {
    [AttendanceStatus.PRESENT]: "success",
    [AttendanceStatus.ABSENT]: "danger",
  };
  return map[status] || "info";
}

export function getAttendanceStatusText(status) {
  const map = {
    [AttendanceStatus.PRESENT]: "已签到",
    [AttendanceStatus.ABSENT]: "缺席",
  };
  return map[status] || "未知";
}

// 用户角色
export const UserRole = {
  SYSTEM_ADMIN: "system_admin",
  CLUB_ADMIN: "club_admin",
  USER: "user",
};

export function getUserRoleText(role) {
  const map = {
    [UserRole.SYSTEM_ADMIN]: "系统管理员",
    [UserRole.CLUB_ADMIN]: "社团管理员",
    [UserRole.USER]: "普通用户",
  };
  return map[role] || "未知角色";
}
