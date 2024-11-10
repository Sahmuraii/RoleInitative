from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import getenv
from dotenv import load_dotenv

from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

# Load configuration from config.py or environment variables
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://{user}:{pw}@{url}/{db}'.format(
    user=getenv('DATABASE_USER'),
    pw=getenv('DATABASE_PASSWORD'),
    url=getenv('DATABASE_URL'),
    db=getenv('DATABASE_NAME')
)
app.config["SECRET_KEY"] = getenv('FLASK_SECRET_KEY')
app.config["SECURITY_PASSWORD_SALT"] = getenv("SECURITY_PASSWORD_SALT", default="very-important")

# Mail Settings
app.config["MAIL_DEFAULT_SENDER"] = "noreply@flask.com"
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_DEBUG"] = False
app.config["MAIL_USERNAME"] = getenv("EMAIL_USER")
app.config["MAIL_PASSWORD"] = getenv("EMAIL_PASSWORD")

login_manager = LoginManager()
login_manager.init_app(app)
db = SQLAlchemy(app)

# Uncomment and run to verify proper URL
#print(app.config["SQLALCHEMY_DATABASE_URI"])
bcrypt = Bcrypt(app)

migrate = Migrate(app, db)
mail = Mail(app)

# Registering blueprints
from src.auth.views import auth_bp
from src.core.views import core_bp
from src.profile.views import profile_bp

app.register_blueprint(auth_bp)
app.register_blueprint(core_bp)
app.register_blueprint(profile_bp)

from src.auth.models import User

login_manager.login_view = "auth_bp.login"
login_manager.login_message_category = "danger"

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == int(user_id)).first()




########################
#### error handlers ####
########################


#@app.errorhandler(401)
#def unauthorized_page(error):
#    return render_template("errors/401.html"), 401
#
#
#@app.errorhandler(404)
#def page_not_found(error):
#    return render_template("errors/404.html"), 404
#
#
#@app.errorhandler(500)
#def server_error_page(error):
#    return render_template("errors/500.html"), 500

