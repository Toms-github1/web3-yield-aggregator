export interface Product {
  id: string;
  name: string;
  description: string;
  chain: string;
  protocol: string;
  type: string;
  apy: number;
  apr?: number;
  tvl_usd: number;
  liquidity_usd: number;
  base_token: string;
  reward_tokens: string[];
  risk_score: number;
  smart_contract_risk: 'low' | 'medium' | 'high';
  min_deposit?: number;
  max_deposit?: number;
  lock_period?: number;
  contract_address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
