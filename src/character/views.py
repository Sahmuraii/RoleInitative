from flask import render_template, Blueprint, request, redirect, url_for
from flask_login import current_user
from sqlalchemy import select
from src.auth.models import User
from src.profile.models import Character
from src.profile.models import Character_Class, DND_Class
from src import db

character_bp = Blueprint('character_bp', __name__, template_folder='../templates')

@character_bp.route("/character/<character_id>")
def character(character_id):
    user = current_user
    char = Character.query.filter_by(owner_id=user.id, char_id=character_id).first()
    if not char:
        return "Character not found", 404

    return render_template('character/character.html', character_id=character_id)
