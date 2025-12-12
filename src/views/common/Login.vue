<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { setToken } from "@/utils/auth";

const router = useRouter();
const userStore = useUserStore();

const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
};

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate();

    loading.value = true;

    // TODO: 后端接口未通，使用Mock数据
    await mockLogin();

    // 真实接口调用（后端通了之后使用）
    // await userStore.login(loginForm)

    ElMessage.success("登录成功");
    router.push("/dashboard");
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    loading.value = false;
  }
};

// Mock登录（临时使用）
const mockLogin = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟不同角色
      const mockData = {
        token: "mock_token_" + Date.now(),
        userInfo: {
          id: 1,
          username: loginForm.username,
          realName:
            loginForm.username === "admin" ? "系统管理员" : "社团管理员",
          role: loginForm.username === "admin" ? "ADMIN" : "CLUB_ADMIN",
          email: loginForm.username + "@campus.com",
          avatar: "",
        },
      };

      // 保存到 store (Pinia 的持久化插件会自动保存到 localStorage)
      userStore.token = mockData.token;
      userStore.userInfo = mockData.userInfo;

      // 同时保存到 auth 工具（用于 axios 拦截器）
      setToken(mockData.token);

      resolve(mockData);
    }, 500);
  });
};
</script>
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>校园社团管理系统</h2>
          <p class="subtitle">管理端登录</p>
        </div>
      </template>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="tips">
        <p>测试账号：</p>
        <p>系统管理员: admin / 123456</p>
        <p>社团管理员: clubadmin / 123456</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 450px;

  :deep(.el-card__header) {
    padding: 30px 20px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  :deep(.el-card__body) {
    padding: 40px 40px 30px;
  }
}

.card-header {
  text-align: center;

  h2 {
    margin: 0 0 10px;
    font-size: 26px;
    font-weight: 600;
  }

  .subtitle {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .login-button {
    width: 100%;
  }
}

.tips {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  line-height: 1.8;

  p {
    margin: 0;

    &:first-child {
      font-weight: 600;
      margin-bottom: 5px;
    }
  }
}
</style>
