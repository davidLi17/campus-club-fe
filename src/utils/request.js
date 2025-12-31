import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken, removeToken } from "./auth";
import router from "@/router";

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

// 业务错误处理策略
const businessErrorStrategy = {
  401: (message) => {
    ElMessage.error(message || "Token过期或未登录");
    removeToken();
    router.push("/login");
  },
  default: (message) => {
    ElMessage.error(message || "请求失败");
  },
};

// HTTP状态码错误处理策略
const httpErrorStrategy = {
  401: () => {
    ElMessage.error("登录已过期，请重新登录");
    removeToken();
    router.push("/login");
  },
  403: () => {
    ElMessage.error("没有权限访问");
  },
  404: () => {
    ElMessage.error("请求的资源不存在");
  },
  500: () => {
    ElMessage.error("服务器错误，请稍后重试");
  },
  default: (error) => {
    ElMessage.error(error.response.data?.message || "请求失败");
  },
};

// 处理业务错误
const handleBusinessError = (code, message) => {
  const handler = businessErrorStrategy[code] || businessErrorStrategy.default;
  handler(message);
};

// 处理HTTP错误
const handleHttpError = (error) => {
  if (!error.response) {
    if (error.message.includes("timeout")) {
      ElMessage.error("请求超时，请检查网络");
    } else {
      ElMessage.error("网络错误，请检查网络连接");
    }
    return;
  }

  const { status } = error.response;
  const handler =
    httpErrorStrategy[status] ||
    (status >= 500 ? httpErrorStrategy[500] : httpErrorStrategy.default);
  handler(error);
};

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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

    // 如果返回的状态码不是200，说明有错误
    if (res.code !== 200) {
      handleBusinessError(res.code, res.message);
      return Promise.reject(new Error(res.message || "请求失败"));
    }

    // 返回完整的 data 对象（包含 token 和 userInfo）
    return res.data;
  },
  (error) => {
    console.error("响应错误:", error);
    handleHttpError(error);
    return Promise.reject(error);
  }
);

export default request;
