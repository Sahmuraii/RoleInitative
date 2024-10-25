from flask import render_template, request, redirect, url_for, Blueprint
from flask_login import login_user, logout_user
from app.models import Users
from app import db
import bcrypt

auth_bp = Blueprint('auth', __name__, template_folder='../templates')

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        requested_username = request.form.get("username")
        requested_password = request.form.get("password")

        password_hash = bcrypt.hashpw(requested_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user = Users(username=requested_username, password=password_hash)
        db.session.add(user)
        db.session.commit()

        return redirect(url_for("auth.login"))
    return render_template("sign_up.html")

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = Users.query.filter_by(username=request.form.get("username")).first()
    
        if user is None:
            return render_template("login.html")
        
        entered_password = request.form.get("password")
        password_match = bcrypt.checkpw(entered_password.encode('utf-8'), user.password.encode('utf-8'))
        if password_match:
            login_user(user)
            return redirect(url_for("home"))
    return render_template("login.html")

@auth_bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("home"))
