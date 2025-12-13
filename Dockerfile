# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

COPY . .
RUN npm run build

# 部署阶段
FROM nginx:alpine

# 拷贝构建好的静态文件到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 可选：自定义 nginx 配置（如有需要）
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]