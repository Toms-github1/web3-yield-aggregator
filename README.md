# Web3 Yield Aggregator Platform

一个跨链 DeFi 理财产品聚合平台，聚合所有区块链上的 DEX、借贷、质押等理财产品，实时对比不同交易所和链上的收益率。

## 🎯 功能概述

- **多链支持**：以太坊、BNB Chain、Polygon、Arbitrum、Solana 等 20+ 条链
- **实时收益聚合**：Uniswap、Aave、Curve、Yearn、PancakeSwap 等主流协议
- **交易所对比**：CEX（币安、OKX）和 DEX 理财产品对标
- **自动复投策略**：AI 驱动的收益优化推荐
- **投资组合管理**：追踪用户跨链资产和收益
- **风险评估**：协议审计状态、流动性风险等

## 📊 技术栈

### 前端
- **框架**：Next.js 14 + React 18
- **Web3 集成**：wagmi, ethers.js, @solana/web3.js
- **UI**：TailwindCSS + shadcn/ui
- **状态管理**：Zustand + React Query

### 后端
- **API 服务**：Node.js + Express + TypeScript
- **数据处理**：Python + FastAPI（数据聚合、AI 策略）
- **实时更新**：WebSocket + Redis Pub/Sub
- **任务调度**：Bull Queue（后台任务）

### 数据层
- **数据库**：PostgreSQL（产品数据、用户信息）
- **缓存**：Redis（APY 数据、实时行情）
- **搜索**：Elasticsearch（产品搜索）

### 多链
- **RPC 提供商**：Alchemy, Infura, QuickNode
- **跨链桥**：LayerZero, Wormhole
- **数据源**：DefiLlama API, CoinGecko API

## 🏗️ 项目结构

```
web3-yield-aggregator/
├── frontend/              # Next.js 前端应用
├── backend/              # Express API 服务
├── aggregator/           # Python 数据聚合服务
├── contracts/            # 智能合约（可选）
├── docs/                 # 文档
├── docker-compose.yml    # 开发环境配置
└── .github/workflows/    # CI/CD 配置
```

## 🚀 快速开始

### 前置要求
- Node.js >= 18
- Python >= 3.10
- Docker & Docker Compose
- PostgreSQL
- Redis

### 开发环境启动

```bash
# 克隆仓库
git clone https://github.com/Toms-github1/web3-yield-aggregator.git
cd web3-yield-aggregator

# 启动 Docker 服务（PostgreSQL + Redis）
docker-compose up -d

# 前端
cd frontend
npm install
npm run dev
# 访问 http://localhost:3000

# 后端（另一个终端）
cd backend
npm install
npm run dev
# API 服务运行在 http://localhost:3001

# 数据聚合服务（另一个终端）
cd aggregator
pip install -r requirements.txt
python main.py
# 聚合服务运行在 http://localhost:8000
```

## 📖 文档

- [API 文档](./docs/API.md)
- [数据模型](./docs/DATA_MODEL.md)
- [多链集成指南](./docs/MULTI_CHAIN.md)
- [部署指南](./docs/DEPLOYMENT.md)

## 🤝 贡献指南

欢迎提交 PR！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📝 License

MIT
