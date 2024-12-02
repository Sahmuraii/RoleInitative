from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from flask_login import current_user, login_required
from sqlalchemy import select
from src.auth.models import User
from src.character.models import Character, Character_Class, DND_Class, DND_Race, DND_Background, Character_Details, Character_Stats, Character_Race, Character_Hit_Points, Character_Death_Saves, DND_Skill
from src import db
import math, json

character_bp = Blueprint('character_bp', __name__, template_folder='../templates')

def get_character_info(char_id) -> dict:
    char_info = {}

    #Load Base Character Info
    char = Character.query.filter_by(char_id=char_id).first().__dict__
    char.pop('_sa_instance_state', None)
    char_info.update(char)

    #Load Character Race and Race Based Character Stats
    race = (db.session.execute(
            select(Character_Race.race_id, DND_Race.name, DND_Race.speed, DND_Race.size)
            .join(DND_Race, DND_Race.race_id == Character_Race.race_id)
            .where(Character_Race.char_id == char_id)
        ).first())
    char_info.update({'race_id':race[0], 'race_name':race[1], 'speed':race[2], 'size':race[3]})

    #Load Character Class(es)
    classes = (db.session.execute(
            select(Character_Class.class_id, Character_Class.class_level, DND_Class.name)
            .join(DND_Class, DND_Class.class_id == Character_Class.class_id)
            .where(Character_Class.char_id == char_id)
            .order_by(Character_Class.class_id)
        ))
    char_info.update({'classes': []})
    for cls in classes:
        char_info['classes'].append({'class_id':cls[0], 'level':cls[1], 'class_name':cls[2]})

    #Load Character Modifier Scores
    mods = (db.session.execute(
            select(Character_Stats)
            .where(Character_Race.char_id == char_id)
        ).first())
    mods = Character_Stats.query.filter_by(char_id=char_id).first().__dict__
    char_info.update({'modifier_scores': []})
    mods.pop('_sa_instance_state', None); mods.pop('char_id', None)
    for attribute in mods:
        char_info['modifier_scores'].append({'modifier_name': attribute, 'score': mods[attribute], 'value': math.floor((mods[attribute] - 10) / 2)})

    #Load Character Health
    char_hp = Character_Hit_Points.query.filter_by(char_id=char_id).first().__dict__
    char_hp.pop('_sa_instance_state', None)
    char_info.update(char_hp)

    #Load Character Death Saves
    char_death_saves = Character_Death_Saves.query.filter_by(char_id=char_id).first().__dict__
    char_death_saves.pop('_sa_instance_state', None)
    char_info.update(char_death_saves)

    #Load Character Skills
    skills = (db.session.execute(
            select(DND_Skill.skill_id, DND_Skill.skill_name, DND_Skill.modifier_type, DND_Skill.linked_proficiency_id)
            .where(DND_Skill.is_offical == True)
            .order_by(DND_Skill.skill_name, DND_Skill.modifier_type, DND_Skill.skill_id)
        ))
    char_info.update({'skills': []})
    for skill in skills:
        mod_type_conversion = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
        mod_value = 0
        for mod in char_info['modifier_scores']:
            if mod['modifier_name'] != mod_type_conversion[skill[2]]: continue
            mod_value = mod['value']
        char_info['skills'].append({'skill_id':skill[0], 'skill_name':skill[1], 'modifier_type':mod_type_conversion[skill[2]], 'modifier_value': mod_value, 'linked_proficiency_id':skill[3]})

    #Load Character Armor Class
    for mod in char_info['modifier_scores']:
        if mod['modifier_name'] != 'dexterity': continue
        char_info.update({'armor_class': mod['value'] + 10})

    #Load Character Initiative
    for mod in char_info['modifier_scores']:
        if mod['modifier_name'] != 'dexterity': continue
        char_info.update({'initiative': mod['value']})

    #Load Character Passive Perception
    for mod in char_info['modifier_scores']:
        if mod['modifier_name'] != 'wisdom': continue
        char_info.update({'passive_perception': mod['value'] + 10})

    #print(char_info)
    return char_info




#{'proficiency_bonus': 5, 'inspiration': None, 'char_id': 21, 'owner_id': 8, 'name': 'Karnation2', 'total_level': 16, 'race_id': 1, 'race_name': 'Dragonborn', 'speed': 30, 'size': 'Medium', 'classes': [{'class_id': 3, 'level': 10, 'class_name': 'Cleric'}, {'class_id': 5, 'level': 3, 'class_name': 'Fighter'}, {'class_id': 6, 'level': 3, 'class_name': 'Monk'}], 'modifier_scores': [{'dexterity': 8, 'constitution': 8, 'wisdom': 8, 'strength': 8, 'intelligence': 8, 'charisma': 8}], 'hit_points': 0, 'temp_hit_points': 0, 'max_hit_points': 0, 'success_throws': 0, 'fail_throws': 0}




@character_bp.route("/character/<character_id>", methods=['GET', 'POST'])
def character(character_id):
    user = current_user
    if not current_user.is_authenticated:
        return "Unauthorized access", 403
    
    char = Character.query.filter_by(owner_id=user.id, char_id=character_id).first()
    if not char:
        return "Character not found", 404

    # Get the current class and level of the character
    current_class_info = (
        db.session.execute(
            select(Character_Class.class_id, Character_Class.class_level, DND_Class.name)
            .join(DND_Class, DND_Class.class_id == Character_Class.class_id)
            .where(Character_Class.char_id == char.char_id)
        ).first()
    )

    current_class = current_class_info[2] if current_class_info else None  # Class name 
    current_level = current_class_info[1] if current_class_info else None  # Class level

    all_classes = DND_Class.query.all()

    if request.method == 'POST':
        # Get the selected class ID and class level from the form
        new_class_id = request.form.get('class_id')
        new_class_level = int(request.form.get('class_level', 1))  # Default level is 1

        # Update or insert the Character_Class entry
        char_class_entry = Character_Class.query.filter_by(char_id=char.char_id).first()
        if char_class_entry:
            # Update the existing entry
            char_class_entry.class_id = new_class_id
            char_class_entry.class_level = new_class_level
        else:
            # Create a new entry
            new_char_class = Character_Class(
                char_id=char.char_id,
                class_id=new_class_id,
                class_level=new_class_level
            )
            db.session.add(new_char_class)

        db.session.commit()  # Save the changes
        return redirect(url_for('character_bp.character', character_id=character_id))

    return render_template('character/character.html', user=user, character=char, current_class=current_class, current_level=current_level, all_classes=all_classes, char_si=get_character_info(char.char_id))



@character_bp.route("/character/create", methods=['GET', 'POST'])
def create():
    
    all_races = DND_Race.query.all()
    all_classes = DND_Class.query.all()
    all_backgrounds = DND_Background.query.all()
    if request.method == 'POST':
        #returns list of levels where the class is the index. will have to be changed in the future for homebrew content
        #compare indexes of users choices with indexes of classes. save chosen level along with class_id to an array
        levels = request.form.getlist("multiclass_level")
        classes = []
        for i in range(len(levels)):
            if levels[i] != "0":
                classes.append({'level':levels[i], 'class_id':f'{all_classes[i].class_id}'})

        char_name = request.form.get('charname')
        #ruleset = request.form.get('ruleset')
        #xp_method = request.form.get('xp_method')
        #encumbrance = request.form.get('encumbrance')
        
        #just a dummy html page that displays two arrays

        strength = request.form.get('final-str')
        dexterity = request.form.get('final-dex')
        constitution = request.form.get('final-con')
        intelligence = request.form.get('final-int')
        wisdom = request.form.get('final-wis')
        charisma = request.form.get('final-cha')

        #selected_background = request.form.get('background')
        alignment = request.form.get('alignment')
        personality = request.form.get('personality')
        height = request.form.get('height')
        weight = request.form.get('weight')
        skin_color = request.form.get('skin_color')
        hair_color = request.form.get('hair_color')
        eye_color = request.form.get('eye_color')
        age = request.form.get('age')
        faith = request.form.get('faith')
        appearance = request.form.get('appearance')
        backstory = request.form.get('backstory')
        bonds = request.form.get('bonds')
        misc_description = request.form.get('misc_description')

        race = request.form.get('charrace')

        #equipment = request.form.getlist('equipment')

        new_character = Character(
            owner_id=current_user.id,
            name=char_name,
            proficiency_bonus=math.ceil(sum(map(int, levels)) / 4) + 1,
            total_level=sum(map(int, levels)),
        )
        db.session.add(new_character)

        db.session.commit() #Code below breaks without this, as it relies on having a valid character id

        new_character_details = Character_Details(
            char_id = new_character.char_id,
            height = height,
            weight = weight,
            alignment = alignment,
            skin_color = skin_color,
            hair_color = hair_color,
            eye_color = eye_color,
            age = age,
            personality = personality,
            backstory = backstory,
            appearance = appearance,
            bonds = bonds,
            misc = misc_description,
            faith = faith,
        )
        db.session.add(new_character_details)

        new_character_stats = Character_Stats(
            char_id = new_character.char_id,
            strength = strength,
            dexterity = dexterity,
            constitution = constitution,
            intelligence = intelligence,
            wisdom = wisdom,
            charisma = charisma,
        )
        db.session.add(new_character_stats)

        new_character_race = Character_Race(
            char_id = new_character.char_id,
            race_id = race,
        )
        db.session.add(new_character_race)

        for new_class in classes:
            new_character_class = Character_Class(
                char_id = new_character.char_id,
                class_id = new_class['class_id'],
                class_level = new_class['level']
            )
            db.session.add(new_character_class)

        #TODO: Save Characters Actual HP (not just temp values)
        new_character_hp = Character_Hit_Points(
            char_id = new_character.char_id,
            hit_points = 0,
            max_hit_points = 0,
            temp_hit_points = 0
        )
        db.session.add(new_character_hp)

        #TODO: Save Character Death Saves (not just temp values)
        new_character_hp = Character_Death_Saves(
            char_id = new_character.char_id,
            success_throws = 0,
            fail_throws = 0
        )
        db.session.add(new_character_hp)

        # Only commit once all character data is ready to be entered
        db.session.commit()
        
        return redirect(url_for('character_bp.character', character_id=new_character.char_id))
    
    return render_template("character/character_creator.html", all_backgrounds=all_backgrounds, all_classes=all_classes, all_races=all_races)

@character_bp.route('/delete_character/<character_id>', methods=['POST', 'GET'])
@login_required
def delete_character(character_id):
    if request.method == 'POST':
        # Find the character by ID
        character = Character.query.filter_by(char_id=character_id, owner_id=current_user.id).first()

        # This technically worked. But it's ugly so need some kind of solution to make it less ugly
        if not character:
            return jsonify({"error": "Character not found or unauthorized"}), 404
        try:
            # Delete the character from the database
            db.session.delete(character)
            db.session.commit()
            return redirect(url_for('core.home'))
            #return jsonify({"message": "Character deleted successfully"}), 200
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({"error": "An error occurred while deleting the character"}), 500
    if request.method == 'GET':
        return redirect(url_for('core_bp.home'))