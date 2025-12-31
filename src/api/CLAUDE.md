[根目录](../../CLAUDE.md) > **api**

# API 接口层 (API Layer)

## 模块职责

统一管理所有后端 API 接口，提供标准化的请求方法，处理认证、错误处理和响应数据转换。

## 入口与启动

- **用户 API**: `user.js` - 登录、注册、用户信息
- **社团 API**: `club.js` - 社团列表、详情、申请
- **活动 API**: `activity.js` - 活动列表、详情、报名
- **管理员 API**: `admin.js` - 系统管理接口
- **社团管理 API**: `clubAdmin.js` - 社团管理员接口

## 对外接口

### 请求基础配置
```javascript
// request.js 提供统一的请求实例
import request from '@/utils/request'

// GET 请求示例
export function getClubs(params) {
  return request({
    url: '/clubs',
    method: 'get',
    params
  })
}

// POST 请求示例
export function createActivity(data) {
  return request({
    url: '/activities',
    method: 'post',
    data
  })
}
```

### API 列表
- `login()` - 用户登录
- `getUserInfo()` - 获取用户信息
- `getClubList()` - 获取社团列表
- `getActivityList()` - 获取活动列表
- `joinClub()` - 申请加入社团
- `signupActivity()` - 报名活动

## 关键依赖与配置

### 核心依赖
- Axios 1.13.2 - HTTP 请求库
- `@/utils/request` - 请求封装
- `@/utils/auth` - 认证工具

### 请求配置
```javascript
// 基础配置
baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
timeout: 15000

// 认证头
headers: {
  'Authorization': getToken()
}
```

### 响应处理
- 统一错误处理
- 状态码校验
- 数据格式转换
- 自动 Token 刷新

## 数据模型

### API 响应格式
```javascript
{
  code: 0,         // 0 表示成功，非 0 表示错误
  message: '成功', // 提示信息
  data: {...}      // 实际数据
}
```

### 分页响应
```javascript
{
  code: 0,
  message: '成功',
  data: {
    list: [...],      // 数据列表
    total: 100,       // 总数
    page: 1,          // 当前页
    pageSize: 10      // 每页数量
  }
}
```

## 测试与质量

当前未配置测试。建议添加：
- API 接口 mock 测试
- 错误处理测试
- 认证流程测试

## 常见问题 (FAQ)

1. **请求失败 401？**
   - 检查 Token 是否存在
   - 确认 Token 是否过期

2. **跨域问题？**
   - 检查 Vite 代理配置
   - 确认后端 CORS 设置

3. **请求超时？**
   - 检查网络连接
   - 调整 timeout 配置

## 相关文件清单

- `user.js` - 用户相关 API
- `club.js` - 社团相关 API
- `activity.js` - 活动相关 API
- `admin.js` - 管理员 API
- `clubAdmin.js` - 社团管理员 API
- `../utils/request.js` - 请求封装
- `../utils/auth.js` - 认证工具

## 变更记录 (Changelog)

### 2025-12-13 12:04:45
- 创建 API 文档
- 定义响应格式规范
- 梳理错误处理流程