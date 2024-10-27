# models.py
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    chars = db.relationship("Characters", backref="owner", lazy="dynamic")

class Characters(db.Model):
    char_id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    campaign_id = db.Column(db.Integer)
    name = db.Column(db.String(250), nullable = False)
    class_id = db.Column(db.ARRAY(db.Integer), nullable = False)
    subclass_id = db.Column(db.ARRAY(db.Integer))
    level = db.Column(db.ARRAY(db.Integer), nullable = False)
    race_id = db.Column(db.Integer, nullable = False)
