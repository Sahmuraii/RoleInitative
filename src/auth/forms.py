from flask_wtf import FlaskForm
from wtforms import EmailField, PasswordField
from wtforms.fields.simple import StringField
from wtforms.validators import DataRequired, Email, EqualTo, Length

from src.auth.models import User


class LoginForm(FlaskForm):
    # No need to ask for username/display name to log in
    email = EmailField(
        "Email",
        validators=[
            DataRequired(),
            Email()
        ]
    )
    password = PasswordField(
        "Password",
        validators=[
            DataRequired()
        ]
    )


class RegisterForm(FlaskForm):
    username = StringField(
        "Username",
        validators=[
            DataRequired(),
            Length(min=3, max=20, message="Username must be between 3 and 20 characters")
        ]
    )
    email = EmailField(
        "Email",
        validators=[
            DataRequired(),
            Email(message=None),
            Length(min=6, max=40)
        ]
    )
    password = PasswordField(
        "Password",
        validators=[
            DataRequired(),
            Length(min=8, max=25)
        ]
    ),
    confirm = PasswordField(
        "Repeat password",
        validators=[
            DataRequired(),
            EqualTo("password", message="Passwords must match."),
        ],
    )

    def validate(self):
        if not super(RegisterForm, self).validate():
            return False
        user = User.query.filter_by(email=self.email.data).first()
        if user:
            # Do not allow duplicate emails
            self.email.errors.append("Email already registered")
            return False
        username = User.query.filter_by(username=self.username.data).first()
        if username:
            # Do not allow duplicate usernames
            self.username.errors.append("Username already registered")
            return False
        if self.password.data != self.confirm.data:
            self.password.errors.append("Passwords must match")
            return False
        return True