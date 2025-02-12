from flask import Blueprint, jsonify
from src.character.models import DND_Class, DND_Race
from src import db


json_bp = Blueprint("json_bp", __name__)


#retrieves json for all stored classes
@json_bp.route("/json/classes")
def returnClassJson():
    classes = []
    for dndclass in DND_Class.query.all():
        classes.append(dndclass.serialize())

    return jsonify(classes)

#retrieves json for all stored races
@json_bp.route("/json/races")
def returnRaceJson():
    races = []
    for dndrace in DND_Race.query.all():
        races.append(dndrace.serialize())

    return jsonify(races)