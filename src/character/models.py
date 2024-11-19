from src import db
from src.auth.models import User
from sqlalchemy.orm import backref

class Character(db.Model):
    __tablename__ = "character"
    char_id = db.Column(db.Integer, primary_key=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    name = db.Column(db.String(250), nullable=False)
    alignment = db.Column(db.String(50), nullable=True)
    faith = db.Column(db.String(50), nullable=True)
    proficency_bonus = db.Column(db.Integer, nullable=True)
    total_level = db.Column(db.Integer, nullable=True)
    charClass = db.relationship("Character_Class", backref="char")
    charRace = db.relationship("Character_Race", backref=backref("char", uselist=False))
    charStats = db.relationship("Character_Stats", backref=backref("char", uselist=False))

class DNDRace(db.Model):
    __tablename__ = "dnd_race"
    race_id = db.Column(db.Integer, primary_key=True, nullable=False)
    #features_id = db.Column(db.Integer, db.ForeignKey('DND_Race_Features.features_id'), nullable=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    speed = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(50), nullable=False)
    age = db.Column(db.String(50), nullable=False)
    is_offical = db.Column(db.Boolean, nullable=True) 
    characters = db.relationship("Character_Race") #Characters that are this race

class Character_Race(db.Model):
    __tablename__ = "character_race"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    race_id = db.Column(db.Integer, db.ForeignKey(DNDRace.race_id), nullable=False)

#class Race_Proficiency_Option(db.Model):
#    __tablename__ = "race_proficiency_option"
#    proficiency_list_id = db.Column(db.Integer, db.ForeignKey('Proficiency_List.proficiency_list_id'), primary_key=True, nullable=False)
#    given_by_race = db.Column(db.Integer, db.ForeignKey(''), nullable=False)

class DND_Class(db.Model):
    __tablename__ = "dnd_class"
    class_id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    hit_die = db.Column(db.Integer, nullable=False)
    is_offical = db.Column(db.Boolean)
    characters = db.relationship("Character_Class") #Characters that have this class

class Character_Class(db.Model):
    __tablename__ = "character_class"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey(DND_Class.class_id), nullable=False)
    class_level = db.Column(db.Integer, nullable=False)

class Character_Stats(db.Model):
    __tablename__ = "character_stats"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    constitution = db.Column(db.Integer, nullable=False)
    intelligence = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)