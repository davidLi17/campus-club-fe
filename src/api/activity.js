import request from "@/utils/request";

// ==================== 活动相关 ====================
// 浏览活动列表
export function getActivityList(params) {
  return request({
    url: "/activity/list",
    method: "get",
    params,
  });
}

// 查看活动详情
export function getActivityDetail(id) {
  return request({
    url: `/activity/${id}`,
    method: "get",
  });
}

// 查看我的报名记录
export function getMySignups(params) {
  return request({
    url: "/activity/my-signups",
    method: "get",
    params,
  });
}

// 报名活动
export function signupActivity(id) {
  return request({
    url: `/activity/${id}/signup`,
    method: "post",
  });
}

// 取消报名
export function cancelSignup(id) {
  return request({
    url: `/activity/${id}/signup`,
    method: "delete",
  });
}
