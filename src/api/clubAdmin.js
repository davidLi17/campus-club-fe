import request from "@/utils/request";

// ==================== 活动管理员 ====================
// 创建活动
export function createActivity(data) {
  return request({
    url: "/club-admin/activity/create",
    method: "post",
    data,
  });
}

// 更新活动
export function updateActivity(id, data) {
  return request({
    url: `/club-admin/activity/${id}`,
    method: "put",
    data,
  });
}

// 取消活动
export function cancelActivity(id) {
  return request({
    url: `/club-admin/activity/${id}/cancel`,
    method: "put",
  });
}

// 查看活动报名列表
export function getActivitySignups(id, params) {
  return request({
    url: `/club-admin/activity/${id}/signups`,
    method: "get",
    params,
  });
}

// 活动签到/标记缺席
export function checkinActivity(id, data) {
  return request({
    url: `/club-admin/activity/${id}/checkin`,
    method: "post",
    data,
  });
}

// ==================== 社团管理员 ====================
// 查询待审核申请列表
export function getClubPendingApplications(clubId, params) {
  return request({
    url: `/club/management/${clubId}/applications/pending`,
    method: "get",
    params,
  });
}

// 审核社团申请
export function reviewClubApplication(clubId, data) {
  return request({
    url: `/club/management/${clubId}/applications/review`,
    method: "post",
    data,
  });
}

// 更新社团信息
export function updateClubInfo(clubId, data) {
  return request({
    url: `/club/management/${clubId}`,
    method: "put",
    data,
  });
}

// ==================== 系统管理员-活动 ====================
// 查看所有活动
export function getAllActivities(params) {
  return request({
    url: "/admin/activity/list",
    method: "get",
    params,
  });
}

// 审核活动
export function reviewActivity(id, data) {
  return request({
    url: `/admin/activity/${id}/review`,
    method: "put",
    data,
  });
}

// 删除活动
export function deleteActivity(id) {
  return request({
    url: `/admin/activity/${id}`,
    method: "delete",
  });
}
