from flask import Blueprint, render_template
from flask_login import login_required, current_user
from src.auth.models import User
from src.utils.decorators import check_is_confirmed

core_bp = Blueprint("core", __name__, template_folder="templates")

data = {
    "id": "foundId",
    "email": "foundEmail",
    "username": "foundUsername",
    "password": "foundPassword",
    "created_on": "1/1/24",
    "is_admin": False,
    "is_confirmed": False,
    "confirmed_on": "no date"
}


@core_bp.route("/")
@check_is_confirmed
def home():
    user = current_user
    if user:
        return render_template("core/home.html", user=user)
    else:
        return "User not found", 404