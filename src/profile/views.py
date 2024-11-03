from flask import render_template, Blueprint, request
from src.auth.models import User, Character
from src import db

profile_bp = Blueprint('profile_bp', __name__, template_folder='../templates')


@profile_bp.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    user = User.query.filter_by(username=username).first()
    if request.method == 'POST':
        requested_charname = request.form.get("charname")
        char = Character(owner_id=user.id, campaign_id=None, name=requested_charname, class_id=[1], subclass_id=[1],
                          level=[1], race_id=1)
        db.session.add(char)
        db.session.commit()

    if user:
        return render_template('profile/account.html', user=user, userChars=user.chars)
    else:
        return "User not found", 404
