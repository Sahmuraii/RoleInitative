from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from os import getenv

from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)

# Load configuration from config.py or environment variables
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://{user}:{pw}@{url}/{db}'.format(
    user=getenv('DATABASE_USER'),
    pw=getenv('DATABASE_PASSWORD'),
    url=getenv('DATABASE_URL'),
    db=getenv('DATABASE_NAME')
)
app.config["SECRET_KEY"] = getenv('FLASK_SECRET_KEY')

login_manager = LoginManager()
login_manager.init_app(app)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Registering blueprints
from src.auth.views import auth_bp
from src.core.views import core_bp

app.register_blueprint(auth_bp)
app.register_blueprint(core_bp)

from src.auth.models import User

login_manager.login_view = "auth.login"
login_manager.login_message_category = "danger"


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

