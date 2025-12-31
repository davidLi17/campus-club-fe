[根目录](../../../CLAUDE.md) > [views](../) > **club-admin**

# 社团管理员模块 (Club Admin)

## 模块职责

为社团管理员提供社团内部管理功能，包括成员管理、活动发布、信息维护和数据统计分析等。

## 入口与启动

- **社团信息**: `ClubInfo.vue` - 社团基本信息管理
- **成员管理**: `MemberManage.vue` - 成员列表、申请审核
- **活动管理**: `ActivityManage.vue` - 活动创建、编辑、数据统计

## 对外接口

### ClubInfo.vue
- 社团基本信息展示
- 社团资料编辑
- 社团简介维护
- 封面上传

### MemberManage.vue
- 成员列表展示
- 成员申请审核
- 成员角色管理
- 成员信息查看

### ActivityManage.vue
- 活动创建和发布
- 活动编辑和删除
- 活动报名管理
- 活动数据统计

## 关键依赖与配置

### API 接口
- `@/api/clubAdmin` - 社团管理员专属 API
- `@/api/club` - 社团信息 API
- `@/api/activity` - 活动管理 API

### 权限要求
- 必须拥有 `CLUB_ADMIN` 或 `ADMIN` 角色权限
- 只能管理所属社团的信息

### 组件依赖
- Element Plus 表格、表单、上传组件
- ECharts 活动统计图表

## 数据模型

### 社团信息
```javascript
{
  id: number,
  name: string,
  description: string,
  category: string,
  logo: string,
  banner: string,
  establishmentDate: string,
  memberCount: number,
  activityCount: number
}
```

### 成员信息
```javascript
{
  id: number,
  username: string,
  realName: string,
  studentId: string,
  role: 'MEMBER' | 'ADMIN',
  joinDate: string,
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE'
}
```

### 活动信息
```javascript
{
  id: number,
  title: string,
  description: string,
  banner: string,
  startTime: string,
  endTime: string,
  location: string,
  maxParticipants: number,
  currentParticipants: number,
  status: 'DRAFT' | 'PUBLISHED' | 'ENDED',
  registrationOpen: boolean
}
```

## 测试与质量

当前未配置测试。建议添加：
- 活动创建流程测试
- 成员管理功能测试
- 权限隔离测试

## 常见问题 (FAQ)

1. **无法创建活动？**
   - 检查社团状态是否正常
   - 确认用户权限是否正确

2. **成员列表为空？**
   - 检查 API 请求参数
   - 确认社团是否有成员

3. **活动统计数据不准确？**
   - 检查统计时间范围
   - 确认数据源是否正确

## 相关文件清单

- `ClubInfo.vue` - 社团信息管理页面
- `MemberManage.vue` - 成员管理页面
- `ActivityManage.vue` - 活动管理页面

## 变更记录 (Changelog)

### 2025-12-13 12:04:45
- 创建模块文档
- 分析社团管理员功能
- 定义数据模型和接口