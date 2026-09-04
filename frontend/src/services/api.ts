import {
  ChangeSummary,
  ChangeEvent,
  Watchlist,
  MarketPulseEvent,
  StockDetailData,
  HistoricalCandle,
  MissionState,
  ExplainResponse,
  User,
} from '../types';

const API_BASE = '/api/v1';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('flux_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('flux_auth_token', token);
    } else {
      localStorage.removeItem('flux_auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network request failed' }));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null as unknown as T;
    }

    return response.json();
  }

  // Auth
  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async login(usernameOrEmail: string, password: string) {
    const res = await this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
    });
    this.setToken(res.access_token);
    return res;
  }

  async register(email: string, username: string, password: string, fullName?: string) {
    const res = await this.request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, full_name: fullName }),
    });
    this.setToken(res.access_token);
    return res;
  }

  // Snapshots & Changes
  async getChangesSummary(): Promise<ChangeSummary> {
    return this.request<ChangeSummary>('/changes/summary');
  }

  async getChangesFeed(filterType: string = 'ALL'): Promise<{
    filter: string;
    is_first_visit: boolean;
    total_changes: number;
    reference_timestamp: string;
    changes: ChangeEvent[];
  }> {
    return this.request(`/changes?filter_type=${filterType}`);
  }

  async performCheckIn(sessionLabel?: string, forceNewBaseline?: boolean): Promise<any> {
    return this.request('/snapshots/check-in', {
      method: 'POST',
      body: JSON.stringify({
        session_label: sessionLabel || 'User Check-in',
        force_new_baseline: forceNewBaseline || false,
      }),
    });
  }

  async explainChange(payload: {
    symbol: string;
    previous_price: number;
    current_price: number;
    current_volume: number;
    typical_volume: number;
    typical_volatility_pct?: number;
    high_52w?: number;
    low_52w?: number;
  }): Promise<ExplainResponse> {
    return this.request<ExplainResponse>('/changes/explain', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Watchlists
  async getWatchlists(): Promise<Watchlist[]> {
    return this.request<Watchlist[]>('/watchlists');
  }

  async createWatchlist(name: string, description?: string): Promise<Watchlist> {
    return this.request<Watchlist>('/watchlists', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async addStockToWatchlist(watchlistId: string, symbol: string, isPriority: boolean = false): Promise<any> {
    return this.request(`/watchlists/${watchlistId}/stocks`, {
      method: 'POST',
      body: JSON.stringify({ symbol, is_priority: isPriority }),
    });
  }

  async removeStockFromWatchlist(watchlistId: string, symbol: string): Promise<void> {
    return this.request(`/watchlists/${watchlistId}/stocks/${symbol}`, {
      method: 'DELETE',
    });
  }

  async togglePriorityStock(watchlistId: string, symbol: string): Promise<{ symbol: string; is_priority: boolean }> {
    return this.request(`/watchlists/${watchlistId}/stocks/${symbol}/priority`, {
      method: 'POST',
    });
  }

  // Market & Stocks
  async getMarketPulse(): Promise<{ events: MarketPulseEvent[] }> {
    return this.request<{ events: MarketPulseEvent[] }>('/market/pulse');
  }

  async getMarketStatus(): Promise<{
    status: string;
    exchange: string;
    current_time: string;
    is_trading_active: boolean;
  }> {
    return this.request('/market/status');
  }

  async getStockDetail(symbol: string): Promise<StockDetailData> {
    return this.request<StockDetailData>(`/stocks/${symbol}`);
  }

  async getStockHistory(symbol: string, timeframe: string = '1D'): Promise<{
    symbol: string;
    timeframe: string;
    candles: HistoricalCandle[];
  }> {
    return this.request(`/stocks/${symbol}/history?timeframe=${timeframe}`);
  }

  // Missions
  async getMissions(): Promise<MissionState> {
    return this.request<MissionState>('/missions');
  }

  async claimMission(missionId: string, xpAmount: number): Promise<MissionState> {
    return this.request<MissionState>('/missions/claim', {
      method: 'POST',
      body: JSON.stringify({ mission_id: missionId, xp_amount: xpAmount }),
    });
  }

  // Scenario Switcher (Demo Mode)
  async switchScenario(scenario: string): Promise<{ active_scenario: string; message: string }> {
    return this.request('/market/scenario', {
      method: 'POST',
      body: JSON.stringify({ scenario }),
    });
  }
}

export const api = new ApiClient();
