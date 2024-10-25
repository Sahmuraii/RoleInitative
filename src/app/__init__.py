from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import getenv
from . import models

db = SQLAlchemy()
login_manager = LoginManager()

app = Flask(__name__)

# Load configuration from config.py or environment variables
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://{user}:{pw}@{url}/{db}'.format(
    user=getenv('DATABASE_USER'),
    pw=getenv('DATABASE_PASSWORD'),
    url=getenv('DATABASE_URL'),
    db=getenv('DATABASE_NAME')
)
app.config["SECRET_KEY"] = getenv('FLASK_SECRET_KEY')
    

db.init_app(app)
login_manager.init_app(app)

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)

from app.auth import auth_bp
from app.profile import profile_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(profile_bp, url_prefix='/profile')

# Home route
@app.route('/')
def home():
    return render_template('home.html')

