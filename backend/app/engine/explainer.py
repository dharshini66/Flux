"""
Diagnostic and Explainability Service for FLUX.
Provides full mathematical transparency, plain language breakdowns,
and contextual answers for "Why Does This Matter?".
"""
from typing import Dict, Any, List
from app.engine.change_engine import ChangeEvaluationResult


class SignalExplainer:
    """Provides deep diagnostic insight into why an alert was triggered."""

    @staticmethod
    def explain_evaluation(res: ChangeEvaluationResult) -> Dict[str, Any]:
        fb = res.factor_breakdown

        factor_cards = [
            {
                "factor": "Price Movement",
                "contribution_pct": round((fb.price_score / max(fb.total_score, 0.001)) * 100, 1) if fb.total_score > 0 else 0,
                "score_allocated": fb.price_score,
                "raw_metric": f"{'+' if fb.price_change_pct >= 0 else ''}{fb.price_change_pct}%",
                "description": f"Delta since your previous recorded baseline check-in."
            },
            {
                "factor": "Volume Anomaly",
                "contribution_pct": round((fb.volume_score / max(fb.total_score, 0.001)) * 100, 1) if fb.total_score > 0 else 0,
                "score_allocated": fb.volume_score,
                "raw_metric": f"{fb.volume_ratio}x typical",
                "description": "Ratio of current session volume relative to typical historical baseline."
            },
            {
                "factor": "Volatility Range",
                "contribution_pct": round((fb.volatility_score / max(fb.total_score, 0.001)) * 100, 1) if fb.total_score > 0 else 0,
                "score_allocated": fb.volatility_score,
                "raw_metric": f"{fb.volatility_multiple}x standard ATR",
                "description": "Assessment of whether the price move broke through standard deviation boundaries."
            },
            {
                "factor": "Price Level & Extremes",
                "contribution_pct": round((fb.price_level_score / max(fb.total_score, 0.001)) * 100, 1) if fb.total_score > 0 else 0,
                "score_allocated": fb.price_level_score,
                "raw_metric": "52W High Breakout" if fb.is_52w_high else ("Near 52W High" if fb.distance_to_52w_high_pct <= 1.5 else "Within normal range"),
                "description": "Proximity to historical support, resistance, or 52-week breakout levels."
            },
            {
                "factor": "Compound Confluence",
                "contribution_pct": round((fb.contextual_score / max(fb.total_score, 0.001)) * 100, 1) if fb.total_score > 0 else 0,
                "score_allocated": fb.contextual_score,
                "raw_metric": f"{len(res.event_types)} simultaneous signals",
                "description": "Synergy bonus awarded when multiple distinct anomaly signals fire concurrently."
            }
        ]

        return {
            "symbol": res.symbol,
            "company_name": res.company_name,
            "severity": res.severity.value,
            "significance_score": res.significance_score,
            "signal_dots": res.signal_strength_dots,
            "signal_level": res.signal_level_int,
            "headline": res.headline,
            "plain_language_explanation": res.plain_language_explanation,
            "key_takeaways": res.summary_bullets,
            "factor_cards": factor_cards,
            "scoring_formula": "Significance = 0.35 * Price + 0.25 * Volume + 0.15 * Volatility + 0.15 * Level + 0.10 * Confluence",
            "is_actionable_signal": res.is_meaningful
        }


explainer = SignalExplainer()
