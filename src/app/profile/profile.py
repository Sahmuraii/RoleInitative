from flask import render_template
from . import profile_bp
from app.models import Users

@profile_bp.route('/profile/<username>')
def profile(username):
    user = Users.query.filter_by(username=username).first()
    if user:
        return render_template('profile.html', user=user)
    else:
        return "User not found", 404
