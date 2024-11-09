from flask_login import UserMixin
from src import db

from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_on = db.Column(db.TIMESTAMP, nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    is_confirmed = db.Column(db.Boolean, nullable=False, default=False)
    confirmed_on = db.Column(db.TIMESTAMP, nullable=True)
    chars = db.relationship("Character", backref="owner", lazy="dynamic")

    def __init__(self, email, username, password, is_admin=False, is_confirmed=False, confirmed_on=None):
        self.email = email
        self.username = username
        self.password = password
        self.created_on = datetime.now()
        self.is_admin = is_admin
        self.is_confirmed = is_confirmed
        self.confirmed_on = confirmed_on

class Character(db.Model):
    char_id = db.Column(db.Integer, primary_key=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    campaign_id = db.Column(db.Integer, nullable=True)
    name = db.Column(db.String(250), nullable=False)
    alignment = db.Column(db.String(50))
    faith = db.Column(db.String(50))

class Character_Race(db.Model):
    char_id = db.Column(db.Integer, db.ForeignKey('character.char_id'), primary_key=True, nullable=False)
    is_offical = db.Column(db.Boolean, nullable=True) 
    race_id = db.Column(db.Integer, db.ForeignKey('DND_Race.race_id', nullable=False))

class DND_Race(db.Model):
    race_id = db.Column(db.Integer, primary_key=True, nullable=False)
    features_id = db.Column(db.Integer, db.ForeignKey('DND_Race_Features.features_id'), nullable=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    speed = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(50), nullable=False)
    age = db.Column(db.String(50), nullable=False)

class Race_Proficiency_Option(db.Model):
    proficiency_list_id = db.Column(db.Integer, db.ForeignKey('Proficiency_List.proficiency_list_id'), primary_key=True, nullable=False)
    given_by_race = db.Column(db.Integer, db.ForeignKey(''), nullable=False)