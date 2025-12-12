import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken, removeToken } from "./auth";
import router from "@/router";

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 如果返回的状态码不是0，说明有错误
    if (res.code !== 0) {
      ElMessage.error(res.message || "请求失败");

      // 401: Token过期或未登录
      if (res.code === 401) {
        removeToken();
        router.push("/login");
      }

      return Promise.reject(new Error(res.message || "请求失败"));
    }

    return res.data;
  },
  (error) => {
    console.error("响应错误:", error);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        ElMessage.error("登录已过期，请重新登录");
        removeToken();
        router.push("/login");
      } else if (status === 403) {
        ElMessage.error("没有权限访问");
      } else if (status === 404) {
        ElMessage.error("请求的资源不存在");
      } else if (status >= 500) {
        ElMessage.error("服务器错误，请稍后重试");
      } else {
        ElMessage.error(error.response.data?.message || "请求失败");
      }
    } else if (error.message.includes("timeout")) {
      ElMessage.error("请求超时，请检查网络");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }

    return Promise.reject(error);
  }
);

export default request;
