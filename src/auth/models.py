# models.py
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_on = db.Column(db.DateTime, nullable=False)
    chars = db.relationship("Characters", backref="owner", lazy="dynamic")

    def __init__(self, email, username, password, isAdmin=False):
        self.email = email
        self.username = username
        self.password = password
        self.created_on = datetime.now()
        self.is_admin = isAdmin

class Character(db.Model):
    char_id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    campaign_id = db.Column(db.Integer)
    name = db.Column(db.String(250), nullable = False)
    class_id = db.Column(db.ARRAY(db.Integer), nullable = False)
    subclass_id = db.Column(db.ARRAY(db.Integer))
    level = db.Column(db.ARRAY(db.Integer), nullable = False)
    race_id = db.Column(db.Integer, nullable = False)
