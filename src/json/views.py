from flask import Blueprint, jsonify
from src.character.models import DND_Class
from src import db


json_bp = Blueprint("json_bp", __name__)


#retrieves json for all stored classes
@json_bp.route("/json/classes")
def returnClassJson():
    
    classes = DND_Class.query.all()

    return jsonify(classes)