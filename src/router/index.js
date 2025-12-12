import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { getToken } from "@/utils/auth";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/common/Login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/views/common/Layout.vue"),
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/common/Dashboard.vue"),
        meta: { title: "工作台" },
      },

      // 系统管理员路由
      {
        path: "admin/clubs",
        name: "AdminClubs",
        component: () => import("@/views/admin/ClubManage.vue"),
        meta: { title: "社团管理", roles: ["ADMIN"] },
      },
      {
        path: "admin/activities",
        name: "AdminActivities",
        component: () => import("@/views/admin/ActivityAudit.vue"),
        meta: { title: "活动审核", roles: ["ADMIN"] },
      },

      // 社团管理员路由
      {
        path: "club-admin/info",
        name: "ClubInfo",
        component: () => import("@/views/club-admin/ClubInfo.vue"),
        meta: { title: "社团信息", roles: ["CLUB_ADMIN", "ADMIN"] },
      },
      {
        path: "club-admin/members",
        name: "MemberManage",
        component: () => import("@/views/club-admin/MemberManage.vue"),
        meta: { title: "成员管理", roles: ["CLUB_ADMIN", "ADMIN"] },
      },
      {
        path: "club-admin/activities",
        name: "ActivityManage",
        component: () => import("@/views/club-admin/ActivityManage.vue"),
        meta: { title: "活动管理", roles: ["CLUB_ADMIN", "ADMIN"] },
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
