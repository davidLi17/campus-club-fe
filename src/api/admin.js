import request from "@/utils/request";

// 创建社团
export function createClub(data) {
  return request({
    url: "/admin/club/create",
    method: "post",
    data,
  });
}

// 更新社团信息
export function updateClub(data) {
  return request({
    url: "/admin/club/update",
    method: "put",
    data,
  });
}

// 删除社团
export function deleteClub(id) {
  return request({
    url: `/admin/club/${id}`,
    method: "delete",
  });
}

// 查询待审核申请列表
export function getPendingApplications(params) {
  return request({
    url: "/admin/club/applications/pending",
    method: "get",
    params,
  });
}

// 审核社团申请
export function reviewApplication(data) {
  return request({
    url: "/admin/club/applications/review",
    method: "post",
    data,
  });
}

// 设置社团负责人
export function setClubLeader(clubId, userId) {
  return request({
    url: `/admin/club/${clubId}/leader/${userId}`,
    method: "post",
  });
}

// 取消社团负责人
export function removeClubLeader(clubId, userId) {
  return request({
    url: `/admin/club/${clubId}/leader/${userId}`,
    method: "delete",
  });
}
