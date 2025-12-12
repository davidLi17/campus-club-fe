<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const collapsed = ref(false);

const activeMenu = computed(() => route.path);

const roleText = computed(() => {
  const roleMap = {
    ADMIN: "系统管理员",
    CLUB_ADMIN: "社团管理员",
    USER: "普通用户",
  };
  return roleMap[userStore.role] || "未知角色";
});

const handleCommand = async (command) => {
  if (command === "logout") {
    try {
      await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });

      userStore.logout();
      router.push("/login");
    } catch {
      // 取消操作
    }
  }
};
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="collapsed ? '64px' : '220px'" class="layout-aside">
      <div class="logo" :class="{ collapsed }">
        <el-icon v-if="collapsed"><Menu /></el-icon>
        <span v-else>社团管理系统</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :collapse-transition="false"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>

        <!-- 系统管理员菜单 -->
        <template v-if="userStore.isAdmin">
          <el-sub-menu index="admin">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/admin/clubs">
              <el-icon><OfficeBuilding /></el-icon>
              <template #title>社团管理</template>
            </el-menu-item>
            <el-menu-item index="/admin/activities">
              <el-icon><Calendar /></el-icon>
              <template #title>活动审核</template>
            </el-menu-item>
          </el-sub-menu>
        </template>

        <!-- 社团管理员菜单 -->
        <template v-if="userStore.isClubAdmin">
          <el-sub-menu index="club-admin">
            <template #title>
              <el-icon><Management /></el-icon>
              <span>社团管理</span>
            </template>
            <el-menu-item index="/club-admin/info">
              <el-icon><InfoFilled /></el-icon>
              <template #title>社团信息</template>
            </el-menu-item>
            <el-menu-item index="/club-admin/members">
              <el-icon><User /></el-icon>
              <template #title>成员管理</template>
            </el-menu-item>
            <el-menu-item index="/club-admin/activities">
              <el-icon><Calendar /></el-icon>
              <template #title>活动管理</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="collapsed = !collapsed">
            <Expand v-if="collapsed" />
            <Fold v-else />
          </el-icon>

          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item v-if="route.meta.title">{{
              route.meta.title
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.realName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <span class="role-tag">{{ roleText }}</span>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

.layout-aside {
  background-color: #304156;
  transition: width 0.3s;

  .logo {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    color: white;
    background-color: #1f2d3d;
    transition: all 0.3s;

    &.collapsed {
      font-size: 24px;
    }
  }

  .sidebar-menu {
    border-right: none;
    height: calc(100vh - 50px);
    overflow-y: auto;

    &:not(.el-menu--collapse) {
      width: 220px;
    }
  }
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .collapse-icon {
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
      }
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      .username {
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .role-tag {
    color: #409eff;
    font-weight: 600;
  }
}

.layout-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
