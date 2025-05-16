from flask import Flask
from otel import init_tracing
from config import PORT, API_PREFIX
from flasgger import Swagger
from prominent_persons import bp as prominent_persons_bp
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
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": f"{API_PREFIX}/docs"
}
swagger = Swagger(app, config=swagger_config)

init_tracing(app)

logger = logging.getLogger(__name__)

app.register_blueprint(prominent_persons_bp, url_prefix = API_PREFIX)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT)
