export type Severity = 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type FreshnessStatus = 'LIVE' | 'RECENT' | 'STALE' | 'UNAVAILABLE';

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  role: string;
  experience_points: number;
}

export interface FactorBreakdown {
  price_score: number;
  volume_score: number;
  volatility_score: number;
  price_level_score: number;
  contextual_score: number;
  total_score: number;
  is_52w_high: boolean;
  is_52w_low: boolean;
  distance_to_52w_high_pct: number;
}

export interface ChangeEvent {
  symbol: string;
  company_name: string;
  severity: Severity;
  significance_score: number;
  signal_dots: string;
  signal_level: number;
  headline: string;
  event_types: string[];
  price_change_pct: number;
  volume_ratio: number;
  current_price: number;
  previous_baseline_price: number;
  summary_bullets: string[];
  plain_language_explanation: string;
  factor_breakdown: FactorBreakdown;
  is_meaningful: boolean;
}

export interface ChangeSummary {
  is_first_visit: boolean;
  headline: string;
  subheadline: string;
  meaningful_changes_count: number;
  breakdown: {
    price_movements: number;
    unusual_volume: number;
    new_52w_highs: number;
    volatility_events: number;
  };
  reference_timestamp: string;
  tracked_stocks_count: number;
  top_changes: ChangeEvent[];
}

export interface WatchlistStockItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  is_priority: boolean;
  position: number;
  notes: string | null;
  price: number;
  change_1d_pct: number;
  change_1d_abs: number;
  volume: number;
  high_52w: number;
  low_52w: number;
  freshness_status: FreshnessStatus;
  error_message?: string | null;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  position: number;
  stocks_count: number;
  stocks: WatchlistStockItem[];
  created_at: string;
}

export interface MarketPulseEvent {
  id: string;
  time_label: string;
  time_iso: string;
  hour_mark: string;
  symbol: string;
  event_title: string;
  price_delta: string;
  severity: Severity;
  intensity: number;
  category: string;
  detail: string;
  significance_score: number;
}

export interface HistoricalCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockDetailData {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  high_52w: number;
  low_52w: number;
  quote: {
    symbol: string;
    price: number;
    change_1d_pct: number;
    change_1d_abs: number;
    volume: number;
    typical_daily_volume: number;
    typical_volatility_pct: number;
    high_52w: number;
    low_52w: number;
    day_high: number;
    day_low: number;
    open_price: number;
    previous_close: number;
    market_timestamp: string;
    fetched_at: string;
    provider: string;
    freshness_status: FreshnessStatus;
    error_message?: string | null;
  };
  session_timeline: {
    time: string;
    event: string;
    delta: string;
  }[];
}

export interface MarketMission {
  id: string;
  title: string;
  objective: string;
  xp_reward: number;
  is_completed: boolean;
  icon: string;
  category: string;
}

export interface RetroBadge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  rarity: string;
  icon_code: string;
}

export interface MissionState {
  total_xp: number;
  level: number;
  rank_title: string;
  level_progress_pct: number;
  current_level_xp: number;
  next_level_xp: number;
  missions: MarketMission[];
  badges: RetroBadge[];
}

export interface FactorCard {
  factor: string;
  contribution_pct: number;
  score_allocated: number;
  raw_metric: string;
  description: string;
}

export interface ExplainResponse {
  symbol: string;
  company_name: string;
  severity: Severity;
  significance_score: number;
  signal_dots: string;
  signal_level: number;
  headline: string;
  plain_language_explanation: string;
  key_takeaways: string[];
  factor_cards: FactorCard[];
  scoring_formula: string;
  is_actionable_signal: boolean;
}
