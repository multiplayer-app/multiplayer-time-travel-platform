from flask import Blueprint, jsonify

bp = Blueprint('prominent_persons', __name__)

@bp.route('/prominent-persons')
def get_prominent_persons():
    """
    Get a list of prominent persons by name only.
    ---
    responses:
      200:
        description: A list of prominent person names
        schema:
          type: array
          items:
            type: object
            properties:
              name:
                type: string
                example: Freddie Mercury
    """
    persons = [
        {"name": "Freddie Mercury"},
        {"name": "Pikachu"},
        {"name": "Yoda"},
        {"name": "Ada Lovelace"},
        {"name": "Julia Child"},
        {"name": "Ellen Ripley (Alien series)"},
        {"name": "Doc Brown (Back to the Future)"},
        {"name": "Alan Turing"},
        {"name": "Margaret Hamilton"},
        {"name": "Hypatia of Alexandria"},
        {"name": "R2 -D2 (Star Wars)"},
        {"name": "Groot (Guardians of the Galaxy)"},
        {"name": "The Cheshire Cat (Alice in Wonderland)"},
        {"name": "Miss Piggy (The Muppets)"},
        {"name": "Han Solo (Star Wars)"},
        {"name": "Spock (Star Trek)"},
        {"name": "Trinity (The Matrix)"},
        {"name": "Agatha Christie"},
    ]
    return jsonify(persons)
