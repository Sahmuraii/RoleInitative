from flask import render_template, Blueprint, request, redirect, url_for
from flask_login import current_user
from sqlalchemy import select
from src.auth.models import User
from src.character.models import Character, Character_Class, DND_Class
from src import db

profile_bp = Blueprint('profile_bp', __name__, template_folder='../templates')


@profile_bp.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    user = current_user
    if request.method == 'POST':
        requested_charname = request.form.get("charname")
        char = Character(owner_id=user.id, name=requested_charname, alignment="Neutral", faith="None", proficency_bonus=2, total_level=1)
        db.session.add(char)
        db.session.commit()

    if current_user.is_authenticated:
        return render_template('profile/account.html', user=user, userChars=user.chars)
    else:
        return "User not found", 404

# @profile_bp.route('/<username>/<character>/change_class', methods=['GET', 'POST'])
# def change_class(username, character):
#     user = User.query.filter_by(username=username).first()
#     if not user:
#         return "User not found", 404

#     char = Character.query.filter_by(owner_id=user.id, name=character).first()
#     if not char:
#         return "Character not found", 404

#     if request.method == 'POST':
#         new_class_id = request.form.get('class_id')  # Get the new class ID from the form
#         char.class_id = new_class_id  # Update the character's class
#         db.session.commit()
#         return redirect(url_for('profile_bp.character_detail', username=username, character=char.name))

#     # Assuming you have a way to get all available classes
#     classes = DnDClass.query.all()
#     return render_template('profile/change_class.html', user=user, character=char, classes=classes)
