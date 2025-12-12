# 校园社团管理系统 (Campus Club Management System)

一个基于 Vue 3 + Element Plus 的现代化校园社团管理平台，支持学生、社团管理员、系统管理员三端协同管理。

## 🚀 项目特性

- ⚡️ **Vue 3** - 最新的 Vue.js 框架，使用 Composition API
- 📦 **Element Plus** - 企业级 UI 组件库
- 🎨 **ECharts** - 强大的数据可视化图表库
- 🔥 **Vite** - 极速的前端构建工具
- 💾 **Pinia** - Vue 3 官方推荐的状态管理
- 📊 **数据可视化** - 丰富的图表展示（热力图、雷达图、漏斗图、仪表盘等）
- 🛡️ **响应式设计** - 适配各种设备屏幕

## 📱 功能模块

### 学生端功能
- 🔍 浏览社团列表和详情
- 📝 社团加入申请
- 🎉 活动报名和参与
- 📋 查看我的申请记录

### 社团管理员功能
- 👥 社团成员管理
- 📅 活动创建和管理
- 📊 活动数据统计
- ℹ️ 社团信息维护

### 系统管理员功能
- 🏢 全部社团管理
- 📝 活动审核
- 👤 用户权限管理
- 📈 全局数据统计

### 数据可视化亮点
- 📅 **日历热力图** - 展示全年社团活动分布
- 🕸️ **雷达图** - 六维评估社团综合能力
- ⏳ **漏斗图** - 申请转化率分析
- 🌡️ **仪表盘** - 活动报名进度实时展示

## 🛠️ 技术栈

### 核心技术
```
Vue 3.5.24      - 渐进式 JavaScript 框架
Vue Router 4.6  - 官方路由管理器
Pinia 3.0.4     - 状态管理
Vite 7.2.4      - 现代化构建工具
```

### UI & 样式
```
Element Plus 2.12.0   - Vue 3 UI 组件库
Element Icons 2.3.2   - 图标组件库
Sass 1.96.0          - CSS 预处理器
@tailwindcss/vite     - Tailwind CSS Vite 插件
```

### 工具库
```
Axios 1.13.2          - HTTP 请求库
Day.js 1.11.19        - 日期处理库
ECharts 6.0.0         - 数据可视化库
ECharts WordCloud 2.1.0 - 词云图
VueUse 14.1.0         - Vue 组合式函数工具集
```

### 开发工具
```
unplugin-auto-import  - 自动导入 API
unplugin-vue-components - 组件自动导入
@vitejs/plugin-vue-jsx - JSX 支持
pinia-plugin-persistedstate - 数据持久化
```

## 📁 项目结构

```
campus-club-fe/
├── public/                # 静态资源
├── src/
│   ├── api/              # API 接口
│   │   ├── activity.js   # 活动相关 API
│   │   ├── admin.js      # 管理员 API
│   │   ├── club.js       # 社团 API
│   │   ├── clubAdmin.js  # 社团管理员 API
│   │   └── user.js       # 用户 API
│   ├── assets/           # 资源文件
│   ├── components/       # 公共组件
│   │   └── charts/       # 图表组件
│   │       ├── CalendarHeatmap.vue
│   │       ├── RadarChart.vue
│   │       ├── FunnelChart.vue
│   │       └── GaugeChart.vue
│   ├── composables/      # 组合式函数
│   │   ├── useChartConfig.js   # 图表配置
│   │   └── useDashboardData.js # 数据管理
│   ├── router/           # 路由配置
│   │   └── index.js
│   ├── stores/           # 状态管理
│   │   └── user.js
│   ├── styles/           # 全局样式
│   │   └── variables.scss
│   ├── utils/            # 工具函数
│   │   ├── auth.js       # 认证相关
│   │   └── request.js    # 请求封装
│   ├── views/            # 页面组件
│   │   ├── admin/        # 管理员页面
│   │   │   ├── ActivityAudit.vue
│   │   │   └── ClubManage.vue
│   │   ├── club-admin/   # 社团管理员页面
│   │   │   ├── ActivityManage.vue
│   │   │   ├── ClubInfo.vue
│   │   │   └── MemberManage.vue
│   │   └── common/       # 公共页面
│   │       ├── Dashboard.vue
│   │       ├── Layout.vue
│   │       └── Login.vue
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .env                  # 环境变量
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js        # Vite 配置
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产构建
```bash
npm run preview
# 或
yarn preview
```

## ⚙️ 配置说明

### 环境变量
项目支持通过环境变量进行配置：

```bash
# .env.development 开发环境
VITE_API_BASE_URL=http://localhost:8080

# .env.production 生产环境
VITE_API_BASE_URL=https://api.example.com
```

### 代理配置
开发环境下，API 请求已配置代理，具体配置在 `vite.config.js`：

```javascript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
}
```

### 路径别名
项目配置了多个路径别名，方便引用：

```javascript
alias: {
  "@": resolve(__dirname, "src"),
  "@components": resolve(__dirname, "src/components"),
  "@views": resolve(__dirname, "src/views"),
  "@utils": resolve(__dirname, "src/utils"),
  "@api": resolve(__dirname, "src/api"),
  "@assets": resolve(__dirname, "src/assets"),
  "@stores": resolve(__dirname, "src/stores"),
}
```

## 🎨 设计规范

### 色彩系统
```scss
// 主色调
$primary: #667eea;
$primary-dark: #764ba2;

// 功能色
$success: #48bb78;
$warning: #ed8936;
$danger: #fc8181;
$info: #38b2ac;

// 中性色
$text-primary: #1e293b;
$text-secondary: #64748b;
$text-tertiary: #94a3b8;
$border-color: #e2e8f0;
$background: #f8fafc;
```

### 组件规范
- 使用 Vue 3 `<script setup>` 语法
- 组件名使用 PascalCase
- Props 定义使用 TypeScript 类型（如使用 TS）
- 事件命名使用 kebab-case

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 Vue 3 官方风格指南
- 使用 Composition API 优于 Options API

## 🔒 权限管理

系统采用基于角色的访问控制（RBAC）：

### 角色定义
- **ADMIN** - 系统管理员
- **CLUB_ADMIN** - 社团管理员
- **STUDENT** - 普通学生

### 路由守卫
- 登录验证：所有页面（除登录页）需要登录
- 角色验证：根据页面 `meta.roles` 验证用户权限
- 自动跳转：未授权访问自动跳转到工作台

## 📊 API 接口

### 认证接口
```
POST /api/auth/login      # 用户登录
POST /api/auth/logout     # 用户登出
GET  /api/auth/profile    # 获取用户信息
```

### 活动接口
```
GET  /api/activity/list     # 活动列表
GET  /api/activity/:id      # 活动详情
POST /api/activity/:id/signup  # 活动报名
```

### 社团接口
```
GET  /api/club/list         # 社团列表
GET  /api/club/:id          # 社团详情
POST /api/club/apply        # 申请加入
GET  /api/club/my           # 我的社团
```

## 🌟 数据可视化

项目集成了多种高级图表组件，位于 `src/components/charts/`：

### CalendarHeatmap - 日历热力图
- 展示全年活动分布
- 支持颜色深浅表示活动密集度
- 类似 GitHub 贡献图效果

### RadarChart - 雷达图
- 六维社团能力评估
- 支持多社团对比
- 动态交互效果

### FunnelChart - 漏斗图
- 申请转化流程展示
- 渐变色视觉效果
- 实时转化率计算

### GaugeChart - 仪表盘
- 活动报名进度
- 动态颜色变化
- 精美动画效果

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📝 开发计划

- [ ] 添加词云图展示热门标签
- [ ] 实现实时消息通知
- [ ] 添加数据导出功能
- [ ] 优化移动端体验
- [ ] 引入 TypeScript 全面类型支持
- [ ] 添加单元测试

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 UI 组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

## 📞 联系方式

如有问题或建议，欢迎提交 Issue 或联系开发团队。

---

**Campus Club Management System** - 让社团管理更简单 🎉