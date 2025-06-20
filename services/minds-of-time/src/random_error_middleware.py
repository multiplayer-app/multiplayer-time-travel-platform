import hashlib
import json
import random
from opentelemetry import trace
from flask import request, make_response
from config import RANDOM_ERROR_RATE

ERROR_MESSAGES = [
    "Mind lost in a time vortex. Reboot temporal cortex.",
    "Memory leak detected in century 22. Please consult a chronotherapist.",
    "AI had an existential crisis mid-timeline. Try again later.",
    "Temporal lobes overheated — minds-of-time needs a cool-down period.",
    "Cognitive dissonance between 3021 and 1975. Resync your intellect.",
    "Too many thoughts per second. Mind buffer overflowed.",
    "Interdimensional deja vu error. Did you already see this fail?",
    "Minds-of-time neural mesh tangled in the 4th dimension.",
    "Sentient thought loop detected. Escaping recursion...",
    "The timeline refused to accept our idea. Mind rejected by history."
]

EXCLUDED_PATHS = ["/docs", "/healthz"]

def random_error_middleware(app):
    @app.before_request
    def maybe_throw_error():
        if request.method == "OPTIONS":
            return  # Don't inject errors into CORS preflight requests

        path = request.path.lower()
        if any(skip in path for skip in EXCLUDED_PATHS):
            return  # Skip excluded paths

        try:
            error_rate = float(request.args.get("errorRate", RANDOM_ERROR_RATE))
            error_rate = max(0.0, min(1.0, error_rate))
        except ValueError:
            error_rate = RANDOM_ERROR_RATE

        trace_id_hex = ""
        span = trace.get_current_span()
        if span is not None:
            trace_id = span.get_span_context().trace_id
            if trace_id != 0:
                # Format trace ID as 32-char hex string
                trace_id_hex = format(trace_id, '032x')

        hash_val = int(hashlib.sha256(trace_id_hex.encode()).hexdigest(), 16)
        normalized = (hash_val % 1000) / 1000.0

        print(trace_id_hex, trace_id, normalized,error_rate)
        if normalized < error_rate:
            message = random.choice(ERROR_MESSAGES)
            response = {
                "code": "WARP_ENGINE_ERROR_MINDS_OF_TIME",
                "message": message
            }
            return make_response(json.dumps(response), 500, {"Content-Type": "application/json"})

    return app
