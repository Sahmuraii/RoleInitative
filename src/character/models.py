from src import db
from src.auth.models import User
from sqlalchemy.orm import backref

#----------------------------------------------------------
#   Character table
class Character(db.Model):
    __tablename__ = "character"
    char_id = db.Column(db.Integer, primary_key=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    name = db.Column(db.String(250), nullable=False)
    faith = db.Column(db.String(50), nullable=True)
    proficency_bonus = db.Column(db.Integer, nullable=True)
    total_level = db.Column(db.Integer, nullable=True)
    charClass = db.relationship("Character_Class", backref="char")
    charRace = db.relationship("Character_Race", backref=backref("char", uselist=False))
    charStats = db.relationship("Character_Stats", backref=backref("char", uselist=False))


#----------------------------------------------------------
#   D&D tables
class DND_Race(db.Model):
    __tablename__ = "dnd_race"
    race_id = db.Column(db.Integer, primary_key=True, nullable=False)
    #features_id = db.Column(db.Integer, db.ForeignKey('DND_Race_Features.features_id'), nullable=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    speed = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(50), nullable=False)
    is_offical = db.Column(db.Boolean, nullable=True) 
    characters = db.relationship("Character_Race") #Characters that are this race

class DND_Class(db.Model):
    __tablename__ = "dnd_class"
    class_id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    hit_die = db.Column(db.Integer, nullable=False)
    is_offical = db.Column(db.Boolean)
    characters = db.relationship("Character_Class") #Characters that have this class


#----------------------------------------------------------
#   D&D relation tables
#   >>> Proficiencies
class Proficiency_Types(db.Model):
    __tablename__ = "proficiency_types"
    type_id = db.Column(db.Integer, primary_key=True, nullable=False)
    type_name = db.Column(db.Integer, nullable=False)

class Proficiencies(db.Model):
    __tablename__ = "proficiencies"
    proficiency_id = db.Column(db.Integer, primary_key=True, nullable=False)
    proficiency_name = db.Column(db.String(80), nullable=False)
    proficiency_type = db.Column(db.Integer, db.ForeignKey(Proficiency_Types.type_id), nullable=False)
    is_offical = db.Column(db.Boolean)

class Proficiency_List(db.Model):
    __tablename__ = "proficiency_list"
    proficiency_list_id = db.Column(db.Integer, primary_key=True, nullable=False)
    #proficiency_id = db.Column(db.Integer, db.ForeignKey(Proficiencies.proficiency_id), primary_key=True, nullable=False)
    proficiency_id = db.Column(db.Integer, primary_key=True, nullable=False)
    is_offical = db.Column(db.Boolean)

class DND_Race_Proficiency_Option(db.Model):
    __tablename__ = "dnd_race_proficiency_option"
    #proficiency_list_id = db.Column(db.Integer, db.ForeignKey(Proficiency_List.proficiency_list_id), primary_key=True, nullable=False)
    #given_by_race = db.Column(db.Integer, db.ForeignKey(DND_Race.race_id), primary_key=True, nullable=False)
    proficiency_list_id = db.Column(db.Integer, primary_key=True, nullable=False)
    given_by_race = db.Column(db.Integer, primary_key=True, nullable=False)
    max_choices = db.Column(db.Integer, nullable=False)

class DND_Class_Proficiency_Option(db.Model):
    __tablename__ = "dnd_class_proficiency_option"
    #proficiency_list_id = db.Column(db.Integer, db.ForeignKey(Proficiency_List.proficiency_list_id), primary_key=True, nullable=False)
    #given_by_class = db.Column(db.Integer, db.ForeignKey(DND_Class.class_id), primary_key=True, nullable=False)
    proficiency_list_id = db.Column(db.Integer, primary_key=True, nullable=False)
    given_by_class = db.Column(db.Integer, primary_key=True, nullable=False)
    max_choices = db.Column(db.Integer, nullable=False)


#   >>> Choices
class Proficiency_Choice(db.Model):
    __tablename__ = "proficiency_choices"
    choice_list_id = db.Column(db.Integer, primary_key=True, nullable=False)
    #proficiency_list_id = db.Column(db.Integer, db.ForeignKey(Proficiency_List.proficiency_list_id), primary_key=True, nullable=False)
    proficiency_list_id = db.Column(db.Integer, primary_key=True, nullable=False)


#   >>> Conditions
class DND_Condition(db.Model):
    __tablename__ = "dnd_condition"
    condition_id = db.Column(db.Integer, primary_key=True, nullable=False)
    condition_name = db.Column(db.String(50), nullable=False)
    condition_description = db.Column(db.String(250), nullable=False)


#   >>> Items / Equipment
class DND_Items(db.Model):
    __tablename__ = "dnd_item"
    item_id = db.Column(db.Integer, primary_key=True, nullable=False)
    item_name = db.Column(db.String(80), nullable=False)
    item_description = db.Column(db.String(250), nullable=False)
    worth = db.Column(db.String(50), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    item_type = db.Column(db.Integer, db.ForeignKey(Proficiency_Types.type_id), nullable=False)
    is_equipable = db.Column(db.Boolean)
    is_official = db.Column(db.Boolean)

class DND_Item_Proficiencies(db.Model):
    __tablename__ = "dnd_item_proficiencies"
    item_id = db.Column(db.Integer, db.ForeignKey(DND_Items.item_id), primary_key=True, nullable=False)
    proficiency_id = db.Column(db.Integer, db.ForeignKey(Proficiencies.proficiency_id), primary_key=True, nullable=False)

class Equipment_Positions(db.Model):
    __tablename__ = "equipment_positions"
    position_id = db.Column(db.Integer, primary_key=True, nullable=False)
    position_name = db.Column(db.String(50), nullable=False)


#----------------------------------------------------------
#   Character relation tables
class Character_Race(db.Model):
    __tablename__ = "character_race"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    race_id = db.Column(db.Integer, db.ForeignKey(DND_Race.race_id), nullable=False)

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

#   >>> HP / Death Saves
class Character_Hit_Points(db.Model):
    __tablename__ = "character_hit_points"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    hit_points = db.Column(db.Integer, nullable=False)
    temp_hit_points = db.Column(db.Integer, nullable=False)

class Character_Death_Saves(db.Model):
    __tablename__ = "character_death_saves"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    success_throws = db.Column(db.Integer, nullable=False)
    fail_throws = db.Column(db.Integer, nullable=False)


#   >>> Chosen Proficiencies
class Character_Proficiency_Choices(db.Model):
    __tablename__ = "character_proficiency_choices"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    #proficiency_list_id = db.Column(db.Integer, db.ForeignKey(Proficiency_List.proficiency_list_id), primary_key=True, nullable=False)
    #choice_list_id = db.Column(db.Integer, db.ForeignKey(Proficiency_Choice.choice_list_id), primary_key=True, nullable=False)
    proficiency_list_id = db.Column(db.Integer, primary_key=True, nullable=False)
    choice_list_id = db.Column(db.Integer, primary_key=True, nullable=False)


#   >>> Conditions
class Character_Condition(db.Model):
    __tablename__ = "character_condition"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    condition_id = db.Column(db.Integer, db.ForeignKey(DND_Condition.condition_id), primary_key=True, nullable=False)
    duration_rounds = db.Column(db.Integer, nullable=False, default=-1)


#   >>> Items / Equipment
class Character_Inventory(db.Model):
    __tablename__ = "character_inventory"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id), primary_key=True, nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey(DND_Items.item_id), primary_key=True, nullable=False)
    item_amount = db.Column(db.Float, nullable=False)
    equipped_position = db.Column(db.Integer, db.ForeignKey(Equipment_Positions.position_id))
