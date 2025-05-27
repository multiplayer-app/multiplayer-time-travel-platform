from flask import Blueprint, Response

bp = Blueprint('healthz', __name__)

@bp.route('/healthz')
def get_health():
    """
    Get service healthz.
    ---
    responses:
      200:
        description: Service is up.
        content:
          text/plain:
            example: OK
    """
    return Response("OK", status=200, mimetype='text/plain')
