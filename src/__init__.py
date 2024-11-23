from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from os import getenv
from dotenv import load_dotenv

from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from flask_cors import CORS

from datetime import timedelta

import requests

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

API_BASE_URL = "https://www.dnd5eapi.co/api"
API_CLASS_URL = "https://www.dnd5eapi.co/api/classes"
API_RACE_URL = "https://www.dnd5eapi.co/api/races"

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
from src.character.views import character_bp

app.register_blueprint(auth_bp)
app.register_blueprint(core_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(character_bp)

from src.auth.models import User
from src.character.models import DND_Class, DND_Race

login_manager.login_view = "auth_bp.login"
login_manager.login_message_category = "danger"

def fetch_and_populate_classes():
    # Fetch all classes from the D&D API

    class_descriptions = {
        "Barbarian": "A fierce warrior of primitive background who can enter a battle rage",
        "Bard": "An inspiring magician whose power echoes the music of creation",
        "Cleric": "A priestly champion who wields divine magic in service of a higher power",
        "Druid": "A priest of the Old Faith, wielding the powers of nature — moonlight and plant growth, fire and lightning — and adopting animal forms",
        "Fighter": "A master of martial combat, skilled with a variety of weapons and armor",
        "Monk": "A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection",
        "Paladin": "A holy warrior bound to a sacred oath",
        "Ranger": "A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization",
        "Rogue": "A scoundrel who uses stealth and trickery to overcome obstacles and enemies",
        "Sorcerer": "A spellcaster who draws on inherent magic from a gift or bloodline",
        "Warlock": "A wielder of magic that is derived from a bargain with an extraplanar entity",
        "Wizard": "A scholarly magic-user capable of manipulating the structures of reality"
    }

    response = requests.get(API_CLASS_URL, headers={"Accept": "application/json"})
    
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Failed to fetch data. Status Code: {response.status_code}")
        return
    
    # Extract the classes from the response
    classes = response.json().get("results", [])
    
    # Iterate over each class
    for cls in classes:
        class_index = cls["index"]  # Extract the class index (e.g., "barbarian")
        class_details_url = f"{API_CLASS_URL}/{class_index}"  # Construct the URL to fetch detailed information
        
        # Fetch detailed information for each class
        class_details_response = requests.get(class_details_url, headers={"Accept": "application/json"}) # Make the request
        
        if class_details_response.status_code != 200: # Check if the request was successful
            print(f"Failed to fetch details for {cls['name']}. Status Code: {class_details_response.status_code}") # Log the error
            continue # Skip to the next class
        
        class_details = class_details_response.json() # Extract the class details
        
        # Prepare the DND_Class object to be added to the database
        new_class = DND_Class(
            name=class_details["name"],
            description=class_descriptions.get(class_details["name"]),
            hit_die=class_details["hit_die"],
            is_offical=True
        )
        
        existing_class = DND_Class.query.filter_by(name=class_details["name"]).first()  # Check if the class already exists

        if existing_class:
            continue
        else:
            db.session.add(new_class)
            continue
    
    # Commit all changes to the database
    try:
        db.session.commit()
        print("Classes successfully populated!")
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")

def fetch_and_populate_races(): 
    response = requests.get(API_RACE_URL, headers={"Accept": "application/json"})

    if response.status_code != 200:
        print(f"Failed to fetch data. Status Code: {response.status_code}")
        return
    
    races = response.json().get("results", [])

    for race in races:
        race_index = race["index"]  
        race_details_url = f"{API_RACE_URL}/{race_index}" 

        # Fetch detailed information for each class
        race_details_response = requests.get(race_details_url, headers={"Accept": "application/json"}) # Make the request
        
        if race_details_response.status_code != 200: # Check if the request was successful
            print(f"Failed to fetch details for {race['name']}. Status Code: {race_details_response.status_code}") # Log the error
            continue # Skip to the next class
        
        race_details = race_details_response.json() # Extract the class details
        
        # Prepare the DND_Class object to be added to the database
        new_race = DND_Race(
            name = race_details["name"],
            speed = race_details["speed"],
            ability_bonuses = [f"+{bonus['bonus']} {bonus['ability_score']['name']}" for bonus in race_details["ability_bonuses"]],
            alignment_description = race_details["alignment"],
            age_description = race_details["age"],
            size = race_details["size"],
            size_description = race_details["size_description"],
            languages = [language["name"] for language in race_details["languages"]],
            language_description = race_details["language_desc"],
            traits = [trait["name"] for trait in race_details["traits"]],
            subraces = [subrace["name"] for subrace in race_details["subraces"]],
            starting_proficiencies = [proficiency["name"] for proficiency in race_details["starting_proficiencies"]],
            is_offical = True
        )
        
        existing_race = DND_Race.query.filter_by(name=race_details["name"]).first()  # Check if the class already exists

        if existing_race:
            continue
        else:
            db.session.add(new_race)
            continue
    
    try:
        db.session.commit()
        print("Races successfully populated!")
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")

with app.app_context():
    db.create_all()
    #fetch_and_populate_classes()
    fetch_and_populate_races()


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id == int(user_id)).first()

@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=60)
    session.modified = True