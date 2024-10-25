from flask import render_template, Blueprint
from app.models import Users

profile_bp = Blueprint('profile', __name__, template_folder='../templates')

@profile_bp.route('/profile/<username>')
def profile(username):
    user = Users.query.filter_by(username=username).first()
    if user:
        return render_template('profile.html', user=user)
    else:
        return "User not found", 404
