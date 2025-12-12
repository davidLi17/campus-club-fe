import { defineStore } from "pinia";
import { login, getUserInfo } from "@/api/user";
import { setToken, removeToken } from "@/utils/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    userInfo: null,
  }),

  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token,

    // 用户角色
    role: (state) => state.userInfo?.role || "",

    // 是否是系统管理员
    isAdmin: (state) => state.userInfo?.role === "ADMIN",

    // 是否是社团管理员
    isClubAdmin: (state) =>
      state.userInfo?.role === "CLUB_ADMIN" || state.userInfo?.role === "ADMIN",
  },

  actions: {
    // 登录
    async login(loginForm) {
      try {
        const data = await login(loginForm);
        this.token = data.token;
        this.userInfo = data.userInfo;
        setToken(data.token);
        return data;
      } catch (error) {
        throw error;
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const data = await getUserInfo();
        this.userInfo = data;
        return data;
      } catch (error) {
        throw error;
      }
    },

    // 登出
    logout() {
      this.token = "";
      this.userInfo = null;
      removeToken();
    },
  },

  // 持久化配置
  persist: {
    key: "user-store",
    storage: localStorage,
    paths: ["token", "userInfo"],
  },
});
