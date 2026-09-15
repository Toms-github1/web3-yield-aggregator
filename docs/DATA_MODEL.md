# 数据模型设计

## 核心实体

### 1. Chain（区块链）
```sql
CREATE TABLE chains (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,  -- "Ethereum", "BSC", "Polygon"
  chain_id INTEGER NOT NULL UNIQUE,   -- EVM Chain ID
  symbol VARCHAR(10),                 -- "ETH", "BNB", "MATIC"
  native_token VARCHAR(100),          -- "Ethereum", "Binance Coin"
  rpc_url TEXT NOT NULL,              -- RPC endpoint
  block_explorer VARCHAR(255),        -- 区块浏览器 URL
  tvl_usd DECIMAL(18, 2),            -- 总锁定价值
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Protocol（协议）
```sql
CREATE TABLE protocols (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,         -- "Aave", "Curve", "Yearn"
  description TEXT,
  logo_url VARCHAR(255),
  website VARCHAR(255),
  github VARCHAR(255),
  audit_status VARCHAR(50),           -- "audited", "pending", "unaudited"
  audit_by TEXT[],                    -- ["OpenZeppelin", "Trail of Bits"]
  tvl_usd DECIMAL(18, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Product（理财产品）
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- 链接关系
  chain_id INTEGER NOT NULL REFERENCES chains(id),
  protocol_id INTEGER NOT NULL REFERENCES protocols(id),
  
  -- 产品类型
  type VARCHAR(50) NOT NULL,  -- "lending", "yield_farm", "liquidity_pool", "staking"
  subtype VARCHAR(50),        -- "stable", "volatile", "lp_fee"
  
  -- 收益数据
  apy DECIMAL(10, 4),         -- 年化收益率
  apr DECIMAL(10, 4),         -- 年化回报率
  tvl_usd DECIMAL(18, 2),     -- 该产品的总锁定价值
  liquidity_usd DECIMAL(18, 2),
  
  -- 资产
  base_token VARCHAR(100),    -- 基础资产 "USDC", "ETH"
  base_token_address VARCHAR(100),
  reward_tokens TEXT[],       -- 奖励代币 ["AAVE", "COMP"]
  
  -- 风险指标
  risk_score DECIMAL(5, 2),   -- 0-10 风险评分
  impermanent_loss_risk DECIMAL(5, 2),  -- IL 风险（LP）
  smart_contract_risk VARCHAR(50),  -- "low", "medium", "high"
  
  -- 约束条件
  min_deposit DECIMAL(18, 2),
  max_deposit DECIMAL(18, 2),
  lock_period INTEGER,        -- 锁定期（天），NULL 表示无锁定
  
  -- 元数据
  contract_address VARCHAR(100),
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_chain_protocol ON products(chain_id, protocol_id);
CREATE INDEX idx_product_type ON products(type);
CREATE INDEX idx_product_apy ON products(apy DESC);
```

### 4. APY History（收益率历史）
```sql
CREATE TABLE apy_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  apy DECIMAL(10, 4),
  apr DECIMAL(10, 4),
  tvl_usd DECIMAL(18, 2),
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_apy_history_product_time ON apy_history(product_id, recorded_at DESC);
```

### 5. User（用户账户）
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(100),
  email VARCHAR(100),
  
  -- 偏好设置
  risk_tolerance VARCHAR(20),  -- "conservative", "moderate", "aggressive"
  preferred_chains INTEGER[],  -- 偏好的链 ID 数组
  
  -- KYC
  kyc_status VARCHAR(50),
  kyc_verified_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Portfolio（用户投资组合）
```sql
CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  
  -- 投资
  product_id INTEGER NOT NULL REFERENCES products(id),
  amount_invested DECIMAL(18, 8),
  invested_at TIMESTAMP DEFAULT NOW(),
  
  -- 收益跟踪
  total_yield_usd DECIMAL(18, 2),
  total_yield_percent DECIMAL(10, 4),
  
  -- 状态
  status VARCHAR(50),  -- "active", "withdrawn", "liquidated"
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_portfolio_user ON portfolios(user_id);
```

### 7. Exchange Product（交易所理财产品）
```sql
CREATE TABLE exchange_products (
  id SERIAL PRIMARY KEY,
  exchange_name VARCHAR(100),  -- "Binance", "OKX", "Kraken"
  product_name VARCHAR(200),
  asset VARCHAR(50),           -- "BTC", "USDT"
  
  apy DECIMAL(10, 4),
  lock_period INTEGER,         -- 锁定天数
  status VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Redis 缓存 Schema

```
缓存键设计:

# 产品列表缓存
products:chain:{chainId}:type:{type} -> JSON Array
products:all:sorted_by:apy -> Sorted Set (score=APY)

# 实时数据
apy:product:{productId} -> {apy, tvl, timestamp}
price:{tokenSymbol} -> {price, change24h}

# 用户数据
user:portfolio:{userId} -> Portfolio JSON
user:recommendations:{userId} -> Strategy JSON

# 聚合数据
chain:tvl:{chainId} -> Total TVL
protocol:stats:{protocolId} -> Stats JSON
```

## Elasticsearch 索引

```json
{
  "products": {
    "mappings": {
      "properties": {
        "name": { "type": "text" },
        "description": { "type": "text" },
        "chain": { "type": "keyword" },
        "protocol": { "type": "keyword" },
        "type": { "type": "keyword" },
        "apy": { "type": "float" },
        "tvl_usd": { "type": "float" },
        "risk_score": { "type": "float" },
        "tokens": { "type": "keyword" },
        "created_at": { "type": "date" }
      }
    }
  }
}
```
