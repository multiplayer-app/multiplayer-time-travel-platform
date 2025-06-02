from flask import Flask
from otel import init_tracing
from config import PORT, API_PREFIX
from flasgger import Swagger
from opentelemetry import trace
from prominent_persons import bp as prominent_persons_bp
from random_error_middleware import random_error_middleware
from healthz import bp as healthz_bp
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": f'{API_PREFIX}/docs/swagger.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": f'{API_PREFIX}/docs/flasgger_static',
    "swagger_ui": True,
    "specs_route": f"{API_PREFIX}/docs"
}
swagger = Swagger(app, config=swagger_config)

init_tracing(app)

random_error_middleware(app)

logger = logging.getLogger(__name__)


@app.after_request
def add_trace_id_header(response):
    # Get current active span
    span = trace.get_current_span()
    if span is not None:
        trace_id = span.get_span_context().trace_id
        if trace_id != 0:
            # Format trace ID as 32-char hex string
            trace_id_hex = format(trace_id, '032x')
            # Add trace ID to response header
            response.headers['X-Trace-Id'] = trace_id_hex
    return response

app.register_blueprint(prominent_persons_bp, url_prefix = API_PREFIX)
app.register_blueprint(healthz_bp, url_prefix = API_PREFIX)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT)
