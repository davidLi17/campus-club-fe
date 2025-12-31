/**
 * 社团相关常量和工具函数
 */

// 社团状态枚举（后端返回小写）
export const ClubStatus = {
  NORMAL: "normal",
  DISABLED: "disabled",
  PENDING: "pending",
};

// 社团成员角色
export const ClubMemberRole = {
  LEADER: "LEADER",
  MEMBER: "MEMBER",
};

/**
 * 获取社团状态对应的 Tag 类型
 * @param {string} status 社团状态
 * @returns {string} Element Plus Tag 类型
 */
export function getClubStatusType(status) {
  const s = status?.toLowerCase?.() || status;
  const map = {
    [ClubStatus.NORMAL]: "success",
    [ClubStatus.DISABLED]: "info",
    [ClubStatus.PENDING]: "warning",
  };
  return map[s] || "info";
}

/**
 * 获取社团状态显示文本
 * @param {string} status 社团状态
 * @returns {string} 状态文本
 */
export function getClubStatusText(status) {
  const s = status?.toLowerCase?.() || status;
  const map = {
    [ClubStatus.NORMAL]: "正常",
    [ClubStatus.DISABLED]: "停用",
    [ClubStatus.PENDING]: "待审核",
  };
  return map[s] || "未知";
}

/**
 * 判断社团是否为正常状态
 * @param {string} status 社团状态
 * @returns {boolean}
 */
export function isClubNormal(status) {
  return status?.toLowerCase?.() === ClubStatus.NORMAL;
}

/**
 * 判断社团是否为待审核状态
 * @param {string} status 社团状态
 * @returns {boolean}
 */
export function isClubPending(status) {
  return status?.toLowerCase?.() === ClubStatus.PENDING;
}

/**
 * 获取社团成员角色显示文本
 * @param {string} role 成员角色
 * @returns {string} 角色文本
 */
export function getClubMemberRoleText(role) {
  const map = {
    [ClubMemberRole.LEADER]: "负责人",
    [ClubMemberRole.MEMBER]: "成员",
  };
  return map[role] || "成员";
}

/**
 * 获取社团成员角色对应的 Tag 类型
 * @param {string} role 成员角色
 * @returns {string} Element Plus Tag 类型
 */
export function getClubMemberRoleType(role) {
  const map = {
    [ClubMemberRole.LEADER]: "danger",
    [ClubMemberRole.MEMBER]: "info",
  };
  return map[role] || "info";
}

/**
 * 判断是否为社团负责人
 * @param {string} role 成员角色
 * @returns {boolean}
 */
export function isClubLeader(role) {
  return role === ClubMemberRole.LEADER;
}
