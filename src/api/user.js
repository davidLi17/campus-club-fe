import request from "@/utils/request";

// 用户登录
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

// 获取当前用户信息
export function getUserInfo() {
  return request({
    url: "/user/info",
    method: "get",
  });
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: "/user/update",
    method: "post",
    data,
  });
}
