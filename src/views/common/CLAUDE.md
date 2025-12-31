[根目录](../../../CLAUDE.md) > [views](../) > **common**

# 公共页面模块 (Common Pages)

## 模块职责

负责系统的公共页面，包括登录页面、主布局和仪表盘，为整个应用提供基础框架和导航支持。

## 入口与启动

- **登录页面**: `Login.vue` - 用户认证入口
- **主布局**: `Layout.vue` - 应用整体布局框架
- **仪表盘**: `Dashboard.vue` - 用户工作台首页

## 对外接口

### Login.vue
- 登录表单处理
- 用户认证
- 登录状态管理

### Layout.vue
- 侧边栏导航
- 顶部用户信息
- 面包屑导航
- 路由出口

### Dashboard.vue
- 数据概览展示
- 快捷操作入口
- 数据可视化组件集成

## 关键依赖与配置

### 依赖组件
- Element Plus 全家桶
- ECharts 图表组件
- Vue Router 路由管理
- Pinia 状态管理

### 状态管理
- 使用 `@/stores/user` 管理用户状态
- 登录状态持久化到 localStorage

### 路由配置
- `/login` - 登录页面
- `/dashboard` - 仪表盘
- 其他页面作为 Layout 的子路由

## 数据模型

### 登录表单
```javascript
{
  username: string,  // 用户名
  password: string   // 密码
}
```

### 用户信息
```javascript
{
  id: number,
  username: string,
  role: 'ADMIN' | 'CLUB_ADMIN' | 'STUDENT',
  avatar?: string,
  clubId?: number
}
```

## 测试与质量

当前未配置测试。建议添加：
- 登录表单验证测试
- 路由跳转测试
- 权限控制测试

## 常见问题 (FAQ)

1. **登录后页面未刷新？**
   - 检查 Pinia store 是否正确更新
   - 确认路由守卫是否正确执行

2. **侧边栏菜单不显示？**
   - 检查用户角色权限
   - 确认菜单配置是否包含 roles 字段

3. **仪表盘数据不更新？**
   - 检查 API 请求是否正确
   - 确认数据响应格式是否符合预期

## 相关文件清单

- `Login.vue` - 登录页面组件
- `Layout.vue` - 主布局组件
- `Dashboard.vue` - 仪表盘组件

## 变更记录 (Changelog)

### 2025-12-13 12:04:45
- 创建模块文档
- 分析模块结构和依赖关系
- 标识待优化项