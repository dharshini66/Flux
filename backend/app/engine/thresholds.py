"""
Thresholds and configuration definitions for the Meaningful Change Engine.
All parameters are clearly documented, type-hinted, and customizable.
"""
from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class SignificanceThresholds:
    """Configurable thresholds governing the Meaningful Change Engine."""
    
    # 1. Price Movement Thresholds
    min_price_move_pct: float = 0.4          # Below 0.4% is normal market chop/noise
    notable_price_move_pct: float = 2.0     # 2.0% is notable movement
    significant_price_move_pct: float = 4.0 # 4.0% is significant
    extreme_price_move_pct: float = 6.0     # 6.0%+ is high/critical impact

    # 2. Volume Anomaly Multipliers
    volume_multiplier_notable: float = 1.5   # 1.5x average volume
    volume_multiplier_high: float = 2.2      # 2.2x average volume
    volume_multiplier_extreme: float = 3.5   # 3.5x+ institutional volume anomaly

    # 3. Volatility Deviation Multiplier
    volatility_breach_multiplier: float = 1.25 # Multiplier on standard volatility/ATR

    # 4. Price Level Distance
    near_52w_extreme_pct: float = 1.5        # Within 1.5% of 52-week High or Low
    gap_open_pct: float = 2.0                # Opening gap >= 2.0%

    # 5. Composite Factor Weights (Must sum to 1.0)
    weight_price_move: float = 0.35
    weight_volume_anomaly: float = 0.25
    weight_volatility: float = 0.15
    weight_price_level: float = 0.15
    weight_contextual: float = 0.10

    # 6. Score Classification Cutoffs
    score_critical: float = 0.80
    score_high: float = 0.60
    score_moderate: float = 0.35

    def to_dict(self) -> Dict[str, Any]:
        return {
            "min_price_move_pct": self.min_price_move_pct,
            "notable_price_move_pct": self.notable_price_move_pct,
            "significant_price_move_pct": self.significant_price_move_pct,
            "extreme_price_move_pct": self.extreme_price_move_pct,
            "volume_multiplier_notable": self.volume_multiplier_notable,
            "volume_multiplier_high": self.volume_multiplier_high,
            "volume_multiplier_extreme": self.volume_multiplier_extreme,
            "volatility_breach_multiplier": self.volatility_breach_multiplier,
            "near_52w_extreme_pct": self.near_52w_extreme_pct,
            "gap_open_pct": self.gap_open_pct,
            "weights": {
                "price_move": self.weight_price_move,
                "volume_anomaly": self.weight_volume_anomaly,
                "volatility": self.weight_volatility,
                "price_level": self.weight_price_level,
                "contextual": self.weight_contextual
            },
            "cutoffs": {
                "critical": self.score_critical,
                "high": self.score_high,
                "moderate": self.score_moderate
            }
        }


# Default global thresholds instance
default_thresholds = SignificanceThresholds()
