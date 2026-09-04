import React, { useState, useEffect } from 'react';
import { StockDetailData, HistoricalCandle } from '../../types';
import { api } from '../../services/api';
import { useMarket } from '../../context/MarketContext';
import {
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart2,
  HelpCircle,
  Award,
  Layers,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { SeverityBadge } from '../common/SeverityBadge';
import { SignalStrengthMeter } from '../common/SignalStrengthMeter';

export const StockDetailModal: React.FC = () => {
  const { selectedStockSymbol, setSelectedStockSymbol } = useMarket();
  const [stockData, setStockData] = useState<StockDetailData | null>(null);
  const [candles, setCandles] = useState<HistoricalCandle[]>([]);
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [loading, setLoading] = useState<boolean>(true);
  const [explainData, setExplainData] = useState<any>(null);

  useEffect(() => {
    if (!selectedStockSymbol) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [detail, hist] = await Promise.all([
          api.getStockDetail(selectedStockSymbol),
          api.getStockHistory(selectedStockSymbol, timeframe),
        ]);
        setStockData(detail);
        setCandles(hist.candles);

        // Fetch Explainability decomposition
        const explain = await api.explainChange({
          symbol: detail.symbol,
          previous_price: detail.quote.previous_close,
          current_price: detail.quote.price,
          current_volume: detail.quote.volume,
          typical_volume: detail.quote.typical_daily_volume,
          typical_volatility_pct: detail.quote.typical_volatility_pct,
          high_52w: detail.high_52w,
          low_52w: detail.low_52w,
        });
        setExplainData(explain);
      } catch (err) {
        console.error('Failed to load stock details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStockSymbol, timeframe]);

  if (!selectedStockSymbol) return null;

  const quote = stockData?.quote;
  const isPositive = (quote?.change_1d_pct || 0) >= 0;
  const baselineRefPrice = quote?.previous_close || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-ink-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-ivory-100 border border-editorial-dark rounded-md w-full max-w-4xl shadow-retro-lg my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between p-5 bg-ivory-200 border-b border-ivory-300">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold financial-mono text-ink-900 tracking-tight">
                {selectedStockSymbol}
              </span>
              <span className="text-xs financial-mono bg-ivory-300 border border-ivory-400 text-ink-700 px-2 py-0.5 rounded-sm uppercase font-bold">
                {stockData?.exchange || 'NSE'}
              </span>
              {explainData && <SeverityBadge severity={explainData.severity} />}
            </div>
            <div className="text-xs text-ink-600 mt-0.5">
              {stockData?.name} · {stockData?.sector}
            </div>
          </div>

          <button
            onClick={() => setSelectedStockSymbol(null)}
            className="p-1.5 hover:bg-ivory-300 text-ink-900 rounded-sm transition-colors border border-ivory-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-ivory-50 border-b border-ivory-300 text-xs financial-mono">
          <div>
            <span className="text-ink-400 text-[10px] block uppercase font-bold">Current Price</span>
            <span className="text-xl font-extrabold text-ink-900">
              ₹{quote?.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '--'}
            </span>
          </div>

          <div>
            <span className="text-ink-400 text-[10px] block uppercase font-bold">Delta Since Baseline</span>
            <span className={`text-xl font-extrabold ${isPositive ? 'text-signal-green' : 'text-signal-red'}`}>
              {isPositive ? '+' : ''}
              {quote?.change_1d_pct?.toFixed(2) || '0.00'}%
            </span>
          </div>

          <div>
            <span className="text-ink-400 text-[10px] block uppercase font-bold">Volume Participation</span>
            <span className="text-xl font-extrabold text-ink-900">
              {((quote?.volume || 0) / (quote?.typical_daily_volume || 1)).toFixed(1)}× Base
            </span>
          </div>

          <div>
            <span className="text-ink-400 text-[10px] block uppercase font-bold">52W Range</span>
            <span className="text-xs font-bold text-ink-700 block mt-1">
              ₹{stockData?.low_52w} - ₹{stockData?.high_52w}
            </span>
          </div>
        </div>

        {/* Interactive Chart Section */}
        <div className="p-5 border-b border-ivory-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] financial-mono font-bold uppercase text-ink-900">
                PRICE ACTION & BASELINE REFERENCE POINT
              </span>
              <span className="text-[10px] financial-mono text-cobalt-500 bg-cobalt-50 px-1.5 py-0.2 rounded border border-cobalt-100">
                Dashed Red = Previous Baseline Check-in (₹{baselineRefPrice.toFixed(2)})
              </span>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 bg-ivory-200 dark:bg-[#151922] p-0.5 border border-ivory-300 dark:border-[#303746] rounded-sm text-xs financial-mono">
              {['1D', '1W', '1M', '6M', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-0.5 rounded-sm font-bold uppercase transition-all ${
                    timeframe === tf
                      ? 'bg-ink-900 text-white dark:bg-[#202633] dark:text-[#F4F1E8] dark:border dark:border-[#4C72FF] shadow-retro-sm'
                      : 'text-ink-600 dark:text-[#A8AFBD] hover:text-ink-900 dark:hover:text-[#F4F1E8]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Component */}
          <div className="h-64 w-full bg-ivory-50 border border-ivory-300 rounded-sm p-2 scanline-bg">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={candles}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? '#176B52' : '#D94336'}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? '#176B52' : '#D94336'}
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return timeframe === '1D'
                      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  }}
                  tick={{ fontSize: 10, fill: '#7A7A7A', fontFamily: 'JetBrains Mono' }}
                  axisLine={{ stroke: '#E5DFD1' }}
                  tickLine={false}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10, fill: '#7A7A7A', fontFamily: 'JetBrains Mono' }}
                  axisLine={{ stroke: '#E5DFD1' }}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as HistoricalCandle;
                      return (
                        <div className="bg-ink-900 text-white dark:bg-[#202633] dark:text-[#F4F1E8] dark:border dark:border-[#303746] p-2.5 rounded shadow-retro text-xs financial-mono">
                          <span className="text-[10px] text-ivory-300 dark:text-[#A8AFBD] block">
                            {new Date(data.timestamp).toLocaleString()}
                          </span>
                          <span className="text-sm font-bold block mt-1">₹{data.close.toFixed(2)}</span>
                          <span className="text-[10px] text-cobalt-100 dark:text-[#4C72FF] block">
                            Vol: {data.volume.toLocaleString()}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Previous Visit Reference Line */}
                {baselineRefPrice > 0 && (
                  <ReferenceLine
                    y={baselineRefPrice}
                    stroke="#D94336"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Baseline Check-in',
                      fill: '#D94336',
                      fontSize: 10,
                      fontFamily: 'JetBrains Mono',
                      position: 'top',
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={isPositive ? '#176B52' : '#D94336'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Split Section: "What Changed?" Timeline & "Why Does This Matter?" Diagnostics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-ivory-100">
          
          {/* Left: What Changed Timeline */}
          <div>
            <h4 className="text-xs financial-mono font-bold uppercase text-ink-900 flex items-center gap-1.5 mb-3">
              <Clock className="w-3.5 h-3.5 text-cobalt-500" />
              <span>WHAT CHANGED? SESSION TIMELINE</span>
            </h4>

            <div className="space-y-2 border-l-2 border-ivory-300 pl-3">
              {stockData?.session_timeline?.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  <div className="w-2 h-2 rounded-full bg-cobalt-500 absolute -left-[17px] top-1"></div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="financial-mono font-bold text-ink-800 text-[11px]">
                      {item.time}
                    </span>
                    <span className="financial-mono font-bold text-signal-green text-[11px]">
                      {item.delta}
                    </span>
                  </div>
                  <p className="text-ink-600 text-[11px] mt-0.5">{item.event}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Why Does This Matter Explainability */}
          <div>
            <h4 className="text-xs financial-mono font-bold uppercase text-ink-900 flex items-center gap-1.5 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-retropink-500" />
              <span>WHY DOES THIS MATTER? (DIAGNOSTICS)</span>
            </h4>

            {explainData ? (
              <div className="space-y-3">
                <p className="text-xs text-ink-800 bg-ivory-200 border border-ivory-300 p-3 rounded-sm leading-relaxed">
                  {explainData.plain_language_explanation}
                </p>

                {/* Mathematical Factor Contributions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] financial-mono text-ink-500 uppercase font-bold block">
                    Mathematical Factor Breakdown
                  </span>
                  {explainData.factor_cards.map((fc: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[11px] financial-mono p-1.5 bg-ivory-50 border border-ivory-300 rounded-sm"
                    >
                      <span className="text-ink-700 font-semibold">{fc.factor}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-500">{fc.raw_metric}</span>
                        <span className="font-bold text-cobalt-500">+{fc.score_allocated.toFixed(2)} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-ink-400 financial-mono">Loading diagnostics...</div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-ivory-200 border-t border-ivory-300 flex items-center justify-between">
          <div className="text-[10px] financial-mono text-ink-500">
            PROVIDER: {quote?.provider || 'FLUX Engine'} · FETCHED: {quote?.fetched_at ? new Date(quote.fetched_at).toLocaleTimeString() : '--'}
          </div>
          <button
            onClick={() => setSelectedStockSymbol(null)}
            className="px-4 py-1.5 bg-ivory-100 hover:bg-white text-ink-900 border border-ink-900 text-xs financial-mono font-bold uppercase rounded-sm shadow-[1.5px_1.5px_0px_#121212]"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
