from flask import render_template, Blueprint, request
from app.models import Users, Characters
from app import db

profile_bp = Blueprint('profile', __name__, template_folder='../templates')

@profile_bp.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    user = Users.query.filter_by(username=username).first()
    if request.method == 'POST':
        requested_charname = request.form.get("charname")
        char = Characters(owner_id = user.id, campaign_id = None, name = requested_charname, class_id = [1], subclass_id = [1], level = [1], race_id = 1)
        db.session.add(char)
        db.session.commit()
    
    
    
    if user:
        return render_template('profile.html', user=user, userChars=user.chars)
    else:
        return "User not found", 404
