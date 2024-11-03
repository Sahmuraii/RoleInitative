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
    char_id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    campaign_id = db.Column(db.Integer)
    name = db.Column(db.String(250), nullable = False)
    class_id = db.Column(db.ARRAY(db.Integer), nullable = False)
    subclass_id = db.Column(db.ARRAY(db.Integer))
    level = db.Column(db.ARRAY(db.Integer), nullable = False)
    race_id = db.Column(db.Integer, nullable = False)
