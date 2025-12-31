[根目录](../../CLAUDE.md) > **stores**

# 状态管理 (State Management)

## 模块职责

使用 Pinia 管理应用的全局状态，包括用户信息、权限状态和共享数据，提供响应式的状态更新和持久化支持。

## 入口与启动

- **用户状态**: `user.js` - 用户登录信息、权限管理

## 对外接口

### user.js Store
```javascript
import { useUserStore } from '@/stores/user'

// 在组件中使用
const userStore = useUserStore()

// 登录
await userStore.login({ username, password })

// 获取用户信息
await userStore.getUserInfo()

// 登出
userStore.logout()
```

### Getters
- `isLoggedIn` - 是否已登录
- `role` - 用户角色
- `isAdmin` - 是否是系统管理员
- `isClubAdmin` - 是否是社团管理员

### Actions
- `login(loginForm)` - 用户登录
- `getUserInfo()` - 获取用户信息
- `logout()` - 用户登出

## 关键依赖与配置

### 核心依赖
- Pinia 3.0.4 - 状态管理库
- pinia-plugin-persistedstate - 持久化插件

### 持久化配置
```javascript
persist: {
  key: 'user-store',
  storage: localStorage,
  paths: ['token', 'userInfo']
}
```

### 路由集成
- 与 Vue Router 路由守卫配合
- 自动权限验证
- 登录状态检查

## 数据模型

### User State
```javascript
{
  token: string,      // JWT Token
  userInfo: {
    id: number,
    username: string,
    role: 'ADMIN' | 'CLUB_ADMIN' | 'STUDENT',
    avatar?: string,
    clubId?: number,
    realName?: string
  }
}
```

## 测试与质量

当前未配置测试。建议添加：
- Store 初始化测试
- Actions 功能测试
- 持久化测试
- Getters 计算测试

## 常见问题 (FAQ)

1. **状态不持久？**
   - 检查 persist 配置
   - 确认 localStorage 可用

2. **权限判断错误？**
   - 检查 userInfo 结构
   - 确认 role 值正确

3. **状态更新不响应？**
   - 确保使用响应式 API
   - 检查组件是否正确引用

## 相关文件清单

- `user.js` - 用户状态管理

## 扩展建议

未来可考虑添加的 Store：
- `app.js` - 应用全局配置
- `club.js` - 当前选中的社团信息
- `notification.js` - 消息通知状态

## 变更记录 (Changelog)

### 2025-12-13 12:04:45
- 创建状态管理文档
- 定义 Store 结构
- 说明持久化配置