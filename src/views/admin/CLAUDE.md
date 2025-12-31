[根目录](../../../CLAUDE.md) > [views](../) > **admin**

# 系统管理员模块 (Admin)

## 模块职责

为系统管理员提供全局管理功能，包括社团审核、活动审批、用户权限管理和数据统计等。

## 入口与启动

- **社团管理**: `ClubManage.vue` - 社团列表、审核、信息维护
- **活动审核**: `ActivityAudit.vue` - 活动申请审核、统计分析

## 对外接口

### ClubManage.vue
- 社团列表展示
- 社团注册审核
- 社团信息编辑
- 社团状态管理

### ActivityAudit.vue
- 活动申请列表
- 活动详情查看
- 审批操作（通过/拒绝）
- 活动数据统计

## 关键依赖与配置

### API 接口
- `@/api/admin` - 管理员专属 API
- `@/api/club` - 社团相关 API
- `@/api/activity` - 活动相关 API

### 权限要求
- 必须拥有 `ADMIN` 角色权限
- 路由守卫自动校验

### 组件依赖
- Element Plus 表格、表单、对话框组件
- ECharts 数据可视化组件

## 数据模型

### 社团信息
```javascript
{
  id: number,
  name: string,
  description: string,
  category: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  createdAt: string,
  memberCount: number,
  adminId: number
}
```

### 活动信息
```javascript
{
  id: number,
  title: string,
  description: string,
  clubId: number,
  clubName: string,
  startTime: string,
  endTime: string,
  location: string,
  maxParticipants: number,
  currentParticipants: number,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  applyDeadline: string
}
```

## 测试与质量

当前未配置测试。建议添加：
- 社团审核流程测试
- 活动审批功能测试
- 权限边界测试

## 常见问题 (FAQ)

1. **无法看到审核按钮？**
   - 检查用户是否具有 ADMIN 角色
   - 确认路由权限配置

2. **社团列表不更新？**
   - 检查 API 请求是否成功
   - 确认列表刷新逻辑

3. **活动审核后状态未改变？**
   - 检查 API 返回状态
   - 确认前端状态更新逻辑

## 相关文件清单

- `ClubManage.vue` - 社团管理页面
- `ActivityAudit.vue` - 活动审核页面

## 变更记录 (Changelog)

### 2025-12-13 12:04:45
- 创建模块文档
- 分析管理员功能模块
- 定义数据模型