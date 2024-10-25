from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from .models import Users

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    
    # Load configuration from config.py or environment variables
    app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://{user}:{pw}@{url}/{db}'.format(
        user=getenv('DATABASE_USER'),
        pw=getenv('DATABASE_PASSWORD'),
        url=getenv('DATABASE_URL'),
        db=getenv('DATABASE_NAME')
    )
    app.config["SECRET_KEY"] = getenv('FLASK_SECRET_KEY')
    
    # Initialize database and login manager
    db.init_app(app)
    login_manager.init_app(app)

    # Import Blueprints
    from app.auth import auth_bp
    from app.profile import profile_bp

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(profile_bp, url_prefix='/profile')

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    @login_manager.user_loader
    def load_user(user_id):
        return Users.query.get(user_id)

    # Home route
    @app.route('/')
    def home():
        return render_template('home.html')

    return app
