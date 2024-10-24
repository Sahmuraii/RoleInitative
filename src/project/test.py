from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user
from dotenv import load_dotenv
from os import getenv
import bcrypt

# Load environment variables from the .env file (if present)
load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://{user}:{pw}@{url}/{db}'.format(user=getenv('DATABASE_USER'),pw=getenv('DATABASE_PASSWORD'),url=getenv('DATABASE_URL'),db=getenv('DATABASE_NAME'))
app.config["SECRET_KEY"] = getenv('FLASK_SECRET_KEY')
db = SQLAlchemy()

login_manager = LoginManager()
login_manager.init_app(app)

class Users(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(250), unique=True, nullable=False)
	password = db.Column(db.String(250), nullable=False)


db.init_app(app)


with app.app_context():
	db.create_all()


@login_manager.user_loader
def loader_user(user_id):
	return Users.query.get(user_id)

@app.route('/profile/<username>')
def profile(username):
    # Query the database to find the user by username
    user = Users.query.filter_by(username=username).first()
    if user:
        # Pass the user data to the template
        return render_template('profile.html', user=user)
    else:
        return "User not found", 404


@app.route('/register', methods=["GET", "POST"])
def register():
	if request.method == "POST":
		requested_username = request.form.get("username")
		requested_pasword = request.form.get("password")

		password_hash = bcrypt.hashpw(requested_pasword.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') #obscure raw password

		user = Users(username=requested_username,
					password=password_hash)
		db.session.add(user)
		db.session.commit()

		return redirect(url_for("login"))
	return render_template("sign_up.html")


@app.route("/login", methods=["GET", "POST"])
def login():
	if request.method == "POST":
		user = Users.query.filter_by(
			username=request.form.get("username")).first()
	
		if user is None:
			return render_template("login.html")
		
		entered_password = request.form.get("password")
		password_match = bcrypt.checkpw(entered_password.encode('utf-8'), user.password.encode('utf-8'))
		if password_match:
			login_user(user)
			return redirect(url_for("home"))
	return render_template("home.html")


@app.route("/logout")
def logout():
	logout_user()
	return redirect(url_for("home"))


@app.route("/")
def home():
	return render_template("home.html")


if __name__ == "__main__":
	app.run()
