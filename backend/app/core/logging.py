"""
Structured logging module for FLUX.
Provides clean, structured JSON/standard logging with sensitive field redaction.
"""
import logging
import json
import sys
from datetime import datetime, timezone
from typing import Any, Dict


class StructuredFormatter(logging.Formatter):
    """Formats log records as structured JSON or high-readability text."""
    
    SENSITIVE_KEYS = {"password", "token", "access_token", "secret", "authorization"}

    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        if hasattr(record, "extra") and isinstance(record.extra, dict):
            # Redact sensitive parameters
            sanitized_extra = {}
            for k, v in record.extra.items():
                if any(sens in k.lower() for sens in self.SENSITIVE_KEYS):
                    sanitized_extra[k] = "***REDACTED***"
                else:
                    sanitized_extra[k] = v
            log_data["context"] = sanitized_extra

        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_data)


def setup_logger(name: str = "signal") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(StructuredFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


logger = setup_logger("flux")
