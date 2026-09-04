"""
FLUX Meaningful Change Engine.
Dedicated algorithmic engine for computing multi-factor market significance,
classifying signal strengths, and decomposing underlying market factors.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Any, Optional
import math
from app.engine.thresholds import SignificanceThresholds, default_thresholds


class SignalSeverity(str, Enum):
    NORMAL = "NORMAL"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class EventType(str, Enum):
    PRICE_SURGE = "PRICE_SURGE"
    SIGNIFICANT_DROP = "SIGNIFICANT_DROP"
    UNUSUAL_VOLUME = "UNUSUAL_VOLUME"
    NEW_52W_HIGH = "NEW_52W_HIGH"
    NEAR_52W_HIGH = "NEAR_52W_HIGH"
    NEW_52W_LOW = "NEW_52W_LOW"
    NEAR_52W_LOW = "NEAR_52W_LOW"
    VOLATILITY_EXPANSION = "VOLATILITY_EXPANSION"
    GAP_OPEN = "GAP_OPEN"
    COMPOUND_CATALYST = "COMPOUND_CATALYST"
    ROUTINE_DRIFT = "ROUTINE_DRIFT"


@dataclass
class StockDeltaContext:
    """Snapshot context comparing baseline to current market state for one stock."""
    symbol: str
    company_name: str
    previous_price: float
    current_price: float
    current_volume: float
    typical_volume: float
    typical_volatility_pct: float = 1.2
    high_52w: float = 0.0
    low_52w: float = 0.0
    open_price: Optional[float] = None
    previous_close: Optional[float] = None
    market_index_delta_pct: float = 0.0
    news_sentiment_score: float = 0.0  # Contextual news factor (-1.0 to +1.0)


@dataclass
class FactorScoreBreakdown:
    price_score: float
    volume_score: float
    volatility_score: float
    price_level_score: float
    contextual_score: float
    total_score: float
    
    price_change_pct: float
    volume_ratio: float
    volatility_multiple: float
    is_52w_high: bool
    is_52w_low: bool
    distance_to_52w_high_pct: float
    distance_to_52w_low_pct: float


@dataclass
class ChangeEvaluationResult:
    symbol: str
    company_name: str
    significance_score: float
    severity: SignalSeverity
    signal_strength_dots: str           # e.g. "● ● ● ● ○"
    signal_level_int: int               # 1 to 5
    primary_event_type: EventType
    event_types: List[EventType]
    headline: str
    summary_bullets: List[str]
    plain_language_explanation: str
    factor_breakdown: FactorScoreBreakdown
    is_meaningful: bool                 # True if severity >= MODERATE


class MeaningfulChangeEngine:
    """
    Core algorithmic engine for scoring and classifying market changes.
    Decoupled from HTTP, database, and UI logic for maximum testability.
    """

    def __init__(self, thresholds: Optional[SignificanceThresholds] = None):
        self.t = thresholds or default_thresholds

    def evaluate_stock_change(self, ctx: StockDeltaContext) -> ChangeEvaluationResult:
        """
        Calculates composite significance score and generates explainable signal diagnostics.
        """
        # 1. Price Change Delta
        if ctx.previous_price > 0:
            price_change_pct = ((ctx.current_price - ctx.previous_price) / ctx.previous_price) * 100.0
        else:
            price_change_pct = 0.0
        
        abs_price_pct = abs(price_change_pct)

        # 2. Volume Anomaly Ratio
        if ctx.typical_volume > 0:
            volume_ratio = ctx.current_volume / ctx.typical_volume
        else:
            volume_ratio = 1.0

        # 3. Volatility Delta
        volatility_multiple = abs_price_pct / max(ctx.typical_volatility_pct, 0.1)

        # 4. 52-Week Proximity Check
        is_52w_high = False
        is_52w_low = False
        dist_52w_high_pct = 100.0
        dist_52w_low_pct = 100.0

        if ctx.high_52w > 0:
            dist_52w_high_pct = ((ctx.high_52w - ctx.current_price) / ctx.high_52w) * 100.0
            if ctx.current_price >= ctx.high_52w:
                is_52w_high = True

        if ctx.low_52w > 0:
            dist_52w_low_pct = ((ctx.current_price - ctx.low_52w) / ctx.low_52w) * 100.0
            if ctx.current_price <= ctx.low_52w:
                is_52w_low = True

        # --- Compute Component Scores (Normalized 0.0 to 1.0) ---

        # A. Price Movement Score
        if abs_price_pct < self.t.min_price_move_pct:
            raw_price_score = 0.0
        else:
            # Scaled smoothly up to extreme threshold
            raw_price_score = min(1.0, (abs_price_pct - self.t.min_price_move_pct) / (self.t.extreme_price_move_pct - self.t.min_price_move_pct))

        # B. Volume Anomaly Score
        if volume_ratio <= 1.0:
            raw_volume_score = 0.0
        elif volume_ratio < self.t.volume_multiplier_notable:
            raw_volume_score = 0.25 * ((volume_ratio - 1.0) / (self.t.volume_multiplier_notable - 1.0))
        else:
            raw_volume_score = min(1.0, 0.25 + 0.75 * ((volume_ratio - self.t.volume_multiplier_notable) / (self.t.volume_multiplier_extreme - self.t.volume_multiplier_notable)))

        # C. Volatility Score (Measures move exceeding typical ATR/volatility)
        if volatility_multiple <= 1.0:
            raw_volatility_score = 0.0
        else:
            raw_volatility_score = min(1.0, (volatility_multiple - 1.0) / 2.5)

        # D. Price Level Score
        raw_price_level_score = 0.0
        if is_52w_high or is_52w_low:
            raw_price_level_score = 1.0
        elif dist_52w_high_pct <= self.t.near_52w_extreme_pct or dist_52w_low_pct <= self.t.near_52w_extreme_pct:
            raw_price_level_score = 0.65
        elif ctx.open_price and ctx.previous_close:
            gap_pct = abs((ctx.open_price - ctx.previous_close) / ctx.previous_close) * 100.0
            if gap_pct >= self.t.gap_open_pct:
                raw_price_level_score = 0.50

        # E. Contextual Score (Synergy of concurrent signals + sentiment)
        raw_contextual_score = 0.0
        active_signals_count = 0
        if abs_price_pct >= self.t.notable_price_move_pct:
            active_signals_count += 1
        if volume_ratio >= self.t.volume_multiplier_notable:
            active_signals_count += 1
        if raw_volatility_score >= 0.4:
            active_signals_count += 1
        if raw_price_level_score >= 0.5:
            active_signals_count += 1

        if active_signals_count >= 3:
            raw_contextual_score = 1.0  # Compound catalyst
        elif active_signals_count == 2:
            raw_contextual_score = 0.6
        elif active_signals_count == 1:
            raw_contextual_score = 0.2

        # Weighted Composite Score
        composite_score = (
            raw_price_score * self.t.weight_price_move +
            raw_volume_score * self.t.weight_volume_anomaly +
            raw_volatility_score * self.t.weight_volatility +
            raw_price_level_score * self.t.weight_price_level +
            raw_contextual_score * self.t.weight_contextual
        )

        composite_score = round(min(1.0, max(0.0, composite_score)), 4)

        # Severity Classification
        if composite_score >= self.t.score_critical:
            severity = SignalSeverity.CRITICAL
            signal_level_int = 5
            signal_strength_dots = "● ● ● ● ●"
        elif composite_score >= self.t.score_high:
            severity = SignalSeverity.HIGH
            signal_level_int = 4
            signal_strength_dots = "● ● ● ● ○"
        elif composite_score >= self.t.score_moderate:
            severity = SignalSeverity.MODERATE
            signal_level_int = 3
            signal_strength_dots = "● ● ● ○ ○"
        elif composite_score >= 0.15:
            severity = SignalSeverity.NORMAL
            signal_level_int = 2
            signal_strength_dots = "● ● ○ ○ ○"
        else:
            severity = SignalSeverity.NORMAL
            signal_level_int = 1
            signal_strength_dots = "● ○ ○ ○ ○"

        # Identify Specific Event Types
        event_types: List[EventType] = []
        if price_change_pct >= self.t.notable_price_move_pct:
            event_types.append(EventType.PRICE_SURGE)
        elif price_change_pct <= -self.t.notable_price_move_pct:
            event_types.append(EventType.SIGNIFICANT_DROP)

        if volume_ratio >= self.t.volume_multiplier_notable:
            event_types.append(EventType.UNUSUAL_VOLUME)

        if is_52w_high:
            event_types.append(EventType.NEW_52W_HIGH)
        elif dist_52w_high_pct <= self.t.near_52w_extreme_pct:
            event_types.append(EventType.NEAR_52W_HIGH)

        if is_52w_low:
            event_types.append(EventType.NEW_52W_LOW)
        elif dist_52w_low_pct <= self.t.near_52w_extreme_pct:
            event_types.append(EventType.NEAR_52W_LOW)

        if raw_volatility_score >= 0.5:
            event_types.append(EventType.VOLATILITY_EXPANSION)

        if active_signals_count >= 3:
            event_types.append(EventType.COMPOUND_CATALYST)

        if not event_types:
            event_types.append(EventType.ROUTINE_DRIFT)

        primary_event_type = event_types[0]

        # Generate Headline and Summary Bullets
        headline, summary_bullets, plain_explanation = self._generate_editorial_explanations(
            ctx, price_change_pct, volume_ratio, is_52w_high, is_52w_low,
            dist_52w_high_pct, dist_52w_low_pct, severity, event_types
        )

        breakdown = FactorScoreBreakdown(
            price_score=round(raw_price_score * self.t.weight_price_move, 3),
            volume_score=round(raw_volume_score * self.t.weight_volume_anomaly, 3),
            volatility_score=round(raw_volatility_score * self.t.weight_volatility, 3),
            price_level_score=round(raw_price_level_score * self.t.weight_price_level, 3),
            contextual_score=round(raw_contextual_score * self.t.weight_contextual, 3),
            total_score=composite_score,
            price_change_pct=round(price_change_pct, 2),
            volume_ratio=round(volume_ratio, 2),
            volatility_multiple=round(volatility_multiple, 2),
            is_52w_high=is_52w_high,
            is_52w_low=is_52w_low,
            distance_to_52w_high_pct=round(dist_52w_high_pct, 2),
            distance_to_52w_low_pct=round(dist_52w_low_pct, 2)
        )

        return ChangeEvaluationResult(
            symbol=ctx.symbol,
            company_name=ctx.company_name,
            significance_score=composite_score,
            severity=severity,
            signal_strength_dots=signal_strength_dots,
            signal_level_int=signal_level_int,
            primary_event_type=primary_event_type,
            event_types=event_types,
            headline=headline,
            summary_bullets=summary_bullets,
            plain_language_explanation=plain_explanation,
            factor_breakdown=breakdown,
            is_meaningful=(severity in [SignalSeverity.MODERATE, SignalSeverity.HIGH, SignalSeverity.CRITICAL])
        )

    def _generate_editorial_explanations(
        self,
        ctx: StockDeltaContext,
        price_change_pct: float,
        volume_ratio: float,
        is_52w_high: bool,
        is_52w_low: bool,
        dist_52w_high: float,
        dist_52w_low: float,
        severity: SignalSeverity,
        event_types: List[EventType]
    ) -> tuple[str, List[str], str]:
        """Crafts human-readable, precise editorial commentary for the change."""
        direction = "+" if price_change_pct >= 0 else ""
        price_str = f"{direction}{price_change_pct:.1f}%"
        bullets: List[str] = []

        # Headline
        if severity == SignalSeverity.CRITICAL:
            headline = f"{ctx.symbol} {price_str} — CRITICAL FLUX — Major Movement & Volume Catalyst"
        elif severity == SignalSeverity.HIGH:
            if EventType.NEW_52W_HIGH in event_types:
                headline = f"{ctx.symbol} {price_str} — HIGH IMPACT — New 52-Week High Breakout"
            elif EventType.SIGNIFICANT_DROP in event_types:
                headline = f"{ctx.symbol} {price_str} — HIGH IMPACT — Significant Downward Move"
            else:
                headline = f"{ctx.symbol} {price_str} — HIGH IMPACT — Unusually High Activity"
        elif severity == SignalSeverity.MODERATE:
            headline = f"{ctx.symbol} {price_str} — MODERATE FLUX — Notable Session Activity"
        else:
            headline = f"{ctx.symbol} {price_str} — Routine Market Drift"

        # Bullets
        bullets.append(f"Price moved {price_str} since your previous baseline snapshot.")
        
        if volume_ratio >= 1.5:
            bullets.append(f"{volume_ratio:.1f}× typical trading volume indicates strong institutional participation.")
        
        if is_52w_high:
            bullets.append(f"Crossed new 52-week peak at ₹{ctx.current_price:,.2f}.")
        elif dist_52w_high <= 1.5:
            bullets.append(f"Trading within {dist_52w_high:.1f}% of 52-week high (₹{ctx.high_52w:,.2f}).")
        
        if is_52w_low:
            bullets.append(f"Hit new 52-week low at ₹{ctx.current_price:,.2f}.")

        if abs(price_change_pct) > (ctx.typical_volatility_pct * 1.5):
            bullets.append(f"Move exceeds typical baseline volatility band of ±{ctx.typical_volatility_pct:.1f}%.")

        # Plain Language Synthesis
        reasons_text = " and ".join(bullets)
        plain_explanation = (
            f"{ctx.company_name} ({ctx.symbol}) demonstrated significant divergence from routine behavior. "
            f"{reasons_text} FLUX classified this as a {severity.value} event based on combined price velocity, "
            f"volume anomaly, and price-level metrics."
        )

        return headline, bullets, plain_explanation


change_engine = MeaningfulChangeEngine()
