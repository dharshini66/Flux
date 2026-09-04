"""
In-memory shared market data cache for FLUX.
Demonstrates O(1) provider ingestion scalability for 100k+ concurrent users.
"""
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List


class SharedMarketCache:
    """
    Thread-safe / async shared cache for market quotes and metrics.
    Prevents redundant external API hits across all user watchlists.
    """
    def __init__(self, ttl_seconds: int = 10):
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()
        self._hits = 0
        self._misses = 0

    async def get(self, symbol: str) -> Optional[Dict[str, Any]]:
        async with self._lock:
            entry = self._cache.get(symbol.upper())
            if not entry:
                self._misses += 1
                return None
            
            # Check expiration
            now = datetime.now(timezone.utc).timestamp()
            if now - entry["cached_at"] > self.ttl_seconds:
                self._misses += 1
                return None
            
            self._hits += 1
            return entry["data"]

    async def get_multi(self, symbols: List[str]) -> Dict[str, Dict[str, Any]]:
        results = {}
        async with self._lock:
            now = datetime.now(timezone.utc).timestamp()
            for s in symbols:
                sym = s.upper()
                entry = self._cache.get(sym)
                if entry and (now - entry["cached_at"] <= self.ttl_seconds):
                    results[sym] = entry["data"]
                    self._hits += 1
                else:
                    self._misses += 1
        return results

    async def set(self, symbol: str, data: Dict[str, Any]) -> None:
        async with self._lock:
            self._cache[symbol.upper()] = {
                "data": data,
                "cached_at": datetime.now(timezone.utc).timestamp()
            }

    async def set_multi(self, data_map: Dict[str, Dict[str, Any]]) -> None:
        async with self._lock:
            now = datetime.now(timezone.utc).timestamp()
            for symbol, data in data_map.items():
                self._cache[symbol.upper()] = {
                    "data": data,
                    "cached_at": now
                }

    async def clear(self) -> None:
        async with self._lock:
            self._cache.clear()

    async def get_metrics(self) -> Dict[str, Any]:
        async with self._lock:
            total = self._hits + self._misses
            hit_rate = (self._hits / total * 100) if total > 0 else 0.0
            return {
                "cached_symbols_count": len(self._cache),
                "cache_hits": self._hits,
                "cache_misses": self._misses,
                "hit_rate_pct": round(hit_rate, 2),
                "ttl_seconds": self.ttl_seconds
            }


shared_cache = SharedMarketCache(ttl_seconds=10)
