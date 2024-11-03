from flask import render_template, request, redirect, url_for, Blueprint, flash
from flask_login import login_user, logout_user, login_required, current_user

import bcrypt
from src.auth.models import User

from .forms import LoginForm, RegisterForm
from .. import db

auth_bp = Blueprint("auth_bp", __name__, template_folder="templates")

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        flash("You are already registered.", "info")
        return redirect(url_for("core.home"))
    form = RegisterForm(request.form)
    if form.validate_on_submit():
        # Grab information from the form
        requested_username = form.username.data
        requested_password = form.password.data
        requested_email = form.email.data

        # Encrypt the password. We can check against this later during log in
        password_hash = bcrypt.hashpw(requested_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user = User(username=requested_username, password=password_hash, email=requested_email)
        db.session.add(user)
        db.session.commit()

        # Log in the user after they register
        login_user(user)
        flash("You registered and are now logged in. Welcome!", "success")

        return redirect(url_for("core.home"))
    return render_template("auth/register.html", form=form)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        flash("You are already logged in.", "info")
        return redirect(url_for("core.home"))
    form = LoginForm(request.form)
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()

        # Stored password is encoded, so if we have a match between the encoding of the
        # entered password and the stored password, the user is valid.
        password_match = bcrypt.checkpw(form.password.data.encode('utf-8'), user.password.encode('utf-8'))

        # if user is not none and they entered the correct password
        if user and password_match:
            login_user(user)
            return redirect(url_for("core.home"))
        else:
            flash("Invalid email or password. Please check your entered information, then try again", "danger")
            return render_template("auth/login.html", form=form)
    return render_template("auth/login.html", form=form)

@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("auth_bp.login"))
