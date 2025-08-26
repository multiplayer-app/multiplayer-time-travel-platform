from flask import Flask
from otel import init_opentelemetry, instrument_flask
from config import PORT, API_PREFIX
from flasgger import Swagger
from opentelemetry import trace
from prominent_persons import bp as prominent_persons_bp
from random_error_middleware import random_error_middleware
from healthz import bp as healthz_bp
import logging

init_opentelemetry()

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

instrument_flask(app)

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

random_error_middleware(app)

logger = logging.getLogger(__name__)

@app.after_request
def add_trace_id_and_cors_headers(response):
    # Add Trace ID header
    span = trace.get_current_span()
    if span is not None:
        trace_id = span.get_span_context().trace_id
        if trace_id != 0:
            trace_id_hex = format(trace_id, '032x')
            response.headers['X-Trace-Id'] = trace_id_hex

    # Add CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = '*'

    return response

app.register_blueprint(prominent_persons_bp, url_prefix = API_PREFIX)
app.register_blueprint(healthz_bp, url_prefix = API_PREFIX)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT)
