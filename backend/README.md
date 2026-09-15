# Backend - Express API Server

## 快速开始

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 数据库迁移
npm run db:migrate

# 本地开发
npm run dev

# 构建生产版本
npm run build
npm start
```

## API 端点

### 产品管理
- `GET /api/products` - 获取产品列表（支持过滤和排序）
- `GET /api/products/:id` - 获取单个产品详情

### 链管理
- `GET /api/chains` - 获取所有支持的区块链
- `GET /api/chains/:chainId` - 获取链详情

### 投资组合
- `GET /api/portfolio/:address` - 获取用户投资组合
- `POST /api/portfolio` - 创建投资

### 认证
- `POST /api/auth/signin` - Web3 钱包登录

## 环境变量

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yield_aggregator
REDIS_HOST=localhost
REDIS_PORT=6379
BACKEND_PORT=3001
NODE_ENV=development
```
