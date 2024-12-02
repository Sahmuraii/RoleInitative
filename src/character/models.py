from src import db
from src.auth.models import User
from sqlalchemy.orm import backref

#----------------------------------------------------------
#   Character table (Parent)
class Character(db.Model):
    __tablename__ = "character"
    char_id = db.Column(db.Integer, primary_key=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    name = db.Column(db.String(250), nullable=False)
    proficiency_bonus = db.Column(db.Integer, nullable=True)
    total_level = db.Column(db.Integer, nullable=True)
    inspiration = db.Column(db.Integer, nullable=True)

    # Relationships
    charRace = db.relationship("Character_Race", backref=backref("char", uselist=False), cascade="all, delete-orphan") #uselist False indicates one-to-one relationship
    charClass = db.relationship("Character_Class", backref="char", cascade="all, delete-orphan")
    charStats = db.relationship("Character_Stats", backref=backref("char", uselist=False), cascade="all, delete-orphan")
    charDetails = db.relationship('Character_Details', backref=backref("char", uselist=False), cascade="all, delete-orphan")
    charHitPoints = db.relationship('Character_Hit_Points', backref=backref("char", uselist=False), cascade="all, delete-orphan")
    charDeathSaves = db.relationship('Character_Death_Saves', backref=backref("char", uselist=False), cascade="all, delete-orphan")
    charProficiencyChoices = db.relationship('Character_Proficiency_Choices', backref='char', cascade="all, delete-orphan")
    charCondition = db.relationship('Character_Condition', backref='char', cascade="all, delete-orphan")
    charInventory = db.relationship('Character_Inventory', backref='char', cascade="all, delete-orphan")

#----------------------------------------------------------
#   D&D tables
class DND_Race(db.Model):
    __tablename__ = "dnd_race"
    race_id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=True)
    speed = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(50), nullable=False)
    is_offical = db.Column(db.Boolean, nullable=True) 
    alignment_description = db.Column(db.String(500), nullable=True)
    age_description = db.Column(db.String(500), nullable=True)
    size_description = db.Column(db.String(500), nullable=True)
    language_description = db.Column(db.String(500), nullable=True)
    languages = db.Column(db.ARRAY(db.String(500)), nullable=True)
    traits = db.Column(db.ARRAY(db.String(50)), nullable=True)
    ability_bonuses = db.Column(db.ARRAY(db.String(50)), nullable=True)
    starting_proficiencies = db.Column(db.ARRAY(db.String(50)), nullable=True)
    subraces = db.Column(db.ARRAY(db.String(50)), nullable=True)

class DND_Class(db.Model):
    __tablename__ = "dnd_class"
    class_id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    hit_die = db.Column(db.Integer, nullable=False)
    is_offical = db.Column(db.Boolean)
    characters = db.relationship("Character_Class") #Characters that have this class

class DND_Background(db.Model):
    __tablename__ = 'dnd_background'
    background_id = db.Column(db.Integer, primary_key=True, nullable=False)
    background_name = db.Column(db.String(100), nullable=False, unique=True)  
    background_description = db.Column(db.Text, nullable=False)  
    skill_proficiencies =  db.Column(db.ARRAY(db.String(50)), nullable=True)
    tool_proficiencies =  db.Column(db.ARRAY(db.String(50)), nullable=True)
    language_proficiencies =  db.Column(db.ARRAY(db.String(50)), nullable=True)
    equipment = db.Column(db.ARRAY(db.String(50)), nullable=True)
    feature_name = db.Column(db.String(50), nullable=False)
    feature_effect = db.Column(db.Text, nullable=False)
    suggested_characteristics = db.Column(db.JSON, nullable=True)
    specialty_table = db.Column(db.JSON, nullable=True)


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


#   >>> Skills
class DND_Skill(db.Model):
    __tablename__ = "dnd_skills"
    skill_id = db.Column(db.Integer, primary_key=True, nullable=False)
    skill_name = db.Column(db.String(50), nullable=False)
    modifier_type = db.Column(db.Integer, nullable=False)
    linked_proficiency_id = db.Column(db.Integer)
    is_offical = db.Column(db.Boolean)


#   >>> Conditions
class DND_Condition(db.Model):
    __tablename__ = "dnd_condition"
    condition_id = db.Column(db.Integer, primary_key=True, nullable=False)
    condition_name = db.Column(db.String(50), nullable=False)
    condition_description = db.Column(db.String(1500), nullable=False)


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
#   Character relation tables (Children - Soon to be orphans)
class Character_Race(db.Model):
    __tablename__ = "character_race"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    race_id = db.Column(db.Integer, db.ForeignKey(DND_Race.race_id), nullable=False)

class Character_Class(db.Model):
    __tablename__ = "character_class"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey(DND_Class.class_id), primary_key=True, nullable=False)
    class_level = db.Column(db.Integer, nullable=False)

class Character_Stats(db.Model):
    __tablename__ = "character_stats"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    strength = db.Column(db.Integer, nullable=False)
    dexterity = db.Column(db.Integer, nullable=False)
    constitution = db.Column(db.Integer, nullable=False)
    intelligence = db.Column(db.Integer, nullable=False)
    wisdom = db.Column(db.Integer, nullable=False)
    charisma = db.Column(db.Integer, nullable=False)

class Character_Details(db.Model):
    __tablename__ = "character_details"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    height=db.Column(db.String(20))
    weight=db.Column(db.String(50))
    alignment=db.Column(db.String(50))
    skin_color=db.Column(db.String(50)) 
    hair_color=db.Column(db.String(50))
    eye_color=db.Column(db.String(50))
    age=db.Column(db.String(50))
    personality=db.Column(db.String(500))
    backstory=db.Column(db.String(500)) #description of the character's story, shown as "Character Backstory" on the sheet
    appearance=db.Column(db.String(500)) #simple description for the character's appearance
    bonds=db.Column(db.String(500)) #shown as "Alliances and Organizations" on the official character sheet
    misc=db.Column(db.String(500)) #any other info the player wants to enter
    faith = db.Column(db.String(50), nullable=True)

#   >>> HP / Death Saves
class Character_Hit_Points(db.Model):
    __tablename__ = "character_hit_points"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    hit_points = db.Column(db.Integer, nullable=False)
    max_hit_points = db.Column(db.Integer, nullable=False)
    temp_hit_points = db.Column(db.Integer, nullable=False)
    # Should we have max_temp_hit_points TODO: Look into multiple temp hit point sources and the logic for what even matters

class Character_Death_Saves(db.Model):
    __tablename__ = "character_death_saves"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    success_throws = db.Column(db.Integer, nullable=False)
    fail_throws = db.Column(db.Integer, nullable=False)


#   >>> Chosen Proficiencies
class Character_Proficiency_Choices(db.Model):
    __tablename__ = "character_proficiency_choices"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    #proficiency_list_id = db.Column(db.Integer, db.ForeignKey(Proficiency_List.proficiency_list_id), primary_key=True, nullable=False)
    #choice_list_id = db.Column(db.Integer, db.ForeignKey(Proficiency_Choice.choice_list_id), primary_key=True, nullable=False)
    proficiency_list_id = db.Column(db.Integer, primary_key=True, nullable=False)
    choice_list_id = db.Column(db.Integer, primary_key=True, nullable=False)


#   >>> Skills
class Character_Extra_Skill(db.Model):
    __tablename__ = "character_extra_skill"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    skill_id = db.Column(db.Integer, primary_key=True, nullable=False)


#   >>> Conditions
class Character_Condition(db.Model):
    __tablename__ = "character_condition"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    condition_id = db.Column(db.Integer, db.ForeignKey(DND_Condition.condition_id), primary_key=True, nullable=False)
    duration_rounds = db.Column(db.Integer, nullable=False, default=-1)
    condition_strength = db.Column(db.Integer, nullable=False, default=1)


#   >>> Items / Equipment
class Character_Inventory(db.Model):
    __tablename__ = "character_inventory"
    char_id = db.Column(db.Integer, db.ForeignKey(Character.char_id, ondelete='CASCADE'), primary_key=True, nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey(DND_Items.item_id), primary_key=True, nullable=False)
    item_amount = db.Column(db.Float, nullable=False)
    equipped_position = db.Column(db.Integer, db.ForeignKey(Equipment_Positions.position_id))

class DND_Class_Feature(db.Model):
    __tablename__ = "dnd_class_features"
    feature_id = db.Column(db.Integer, primary_key=True, nullable=False)
    feature_name = db.Column(db.String(100), nullable=False)
    feature_description = db.Column(db.TEXT, nullable=False)
    feature_prerequisite = db.Column(db.JSON, nullable=False)
    feature_required_level = db.Column(db.Integer, nullable=False)
    feature_base_class = db.Column(db.Integer, db.ForeignKey(DND_Class.class_id), nullable=False)