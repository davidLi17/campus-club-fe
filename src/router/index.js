import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { getToken } from "@/utils/auth";

// 预定义组件导入函数，方便预加载
const componentLoaders = {
  Login: () => import("@/views/common/Login.vue"),
  Layout: () => import("@/views/common/Layout.vue"),
  Dashboard: () => import("@/views/common/Dashboard.vue"),
  ClubManage: () => import("@/views/admin/ClubManage.vue"),
  ActivityAudit: () => import("@/views/admin/ActivityAudit.vue"),
  ClubInfo: () => import("@/views/club-admin/ClubInfo.vue"),
  MemberManage: () => import("@/views/club-admin/MemberManage.vue"),
  ActivityManage: () => import("@/views/club-admin/ActivityManage.vue"),
};

// 预加载所有组件（登录后调用）
export const preloadAllComponents = () => {
  Object.values(componentLoaders).forEach((loader) => {
    loader();
  });
};

const routes = [
  {
    path: "/login",
    name: "Login",
    component: componentLoaders.Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "Layout",
    component: componentLoaders.Layout,
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: componentLoaders.Dashboard,
        meta: { title: "工作台" },
      },

      // 系统管理员路由
      {
        path: "admin/clubs",
        name: "AdminClubs",
        component: componentLoaders.ClubManage,
        meta: { title: "社团管理", roles: ["system_admin"] },
      },
      {
        path: "admin/activities",
        name: "AdminActivities",
        component: componentLoaders.ActivityAudit,
        meta: { title: "活动审核", roles: ["system_admin"] },
      },

      // 社团管理员路由
      {
        path: "club-admin/info",
        name: "ClubInfo",
        component: componentLoaders.ClubInfo,
        meta: { title: "社团信息", roles: ["club_admin", "system_admin"] },
      },
      {
        path: "club-admin/members",
        name: "MemberManage",
        component: componentLoaders.MemberManage,
        meta: { title: "成员管理", roles: ["club_admin", "system_admin"] },
      },
      {
        path: "club-admin/activities",
        name: "ActivityManage",
        component: componentLoaders.ActivityManage,
        meta: { title: "活动管理", roles: ["club_admin", "system_admin"] },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken();
  const userStore = useUserStore();

  // 设置页面标题
  const title = (to.meta.title || to.name || "校园社团管理") + " - 校园社团";
  document.title = title;

  // 需要登录的页面
  if (to.meta.requiresAuth !== false) {
    if (!token) {
      next("/login");
      return;
    }

    // 检查角色权限
    if (to.meta.roles && to.meta.roles.length > 0) {
      const hasPermission = to.meta.roles.includes(userStore.role);
      if (!hasPermission) {
        next("/dashboard");
        return;
      }
    }
  } else {
    // 已登录用户访问登录页，重定向到首页
    if (token && to.path === "/login") {
      next("/dashboard");
      return;
    }
  }

  next();
});

export default router;
