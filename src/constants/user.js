/**
 * 用户相关常量和工具函数
 */

// 用户角色枚举
export const UserRole = {
  SYSTEM_ADMIN: "system_admin",
  CLUB_ADMIN: "club_admin",
  USER: "user",
};

/**
 * 获取用户角色显示文本
 * @param {string} role 用户角色
 * @returns {string} 角色文本
 */
export function getUserRoleText(role) {
  const map = {
    [UserRole.SYSTEM_ADMIN]: "系统管理员",
    [UserRole.CLUB_ADMIN]: "社团管理员",
    [UserRole.USER]: "普通用户",
  };
  return map[role] || "未知角色";
}

/**
 * 获取用户角色对应的 Tag 类型
 * @param {string} role 用户角色
 * @returns {string} Element Plus Tag 类型
 */
export function getUserRoleType(role) {
  const map = {
    [UserRole.SYSTEM_ADMIN]: "danger",
    [UserRole.CLUB_ADMIN]: "warning",
    [UserRole.USER]: "info",
  };
  return map[role] || "info";
}

/**
 * 判断是否为系统管理员
 * @param {string} role 用户角色
 * @returns {boolean}
 */
export function isSystemAdmin(role) {
  return role === UserRole.SYSTEM_ADMIN;
}

/**
 * 判断是否为社团管理员
 * @param {string} role 用户角色
 * @returns {boolean}
 */
export function isClubAdmin(role) {
  return role === UserRole.CLUB_ADMIN;
}

/**
 * 判断是否为普通用户
 * @param {string} role 用户角色
 * @returns {boolean}
 */
export function isNormalUser(role) {
  return role === UserRole.USER;
}
