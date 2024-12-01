from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from flask_login import current_user, login_required
from sqlalchemy import select
from src.auth.models import User
from src.character.models import Character, Character_Class, DND_Class, DND_Race, DND_Background, Character_Details, Character_Stats, Character_Race
from src import db
import math

character_bp = Blueprint('character_bp', __name__, template_folder='../templates')

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

    return render_template('character/character.html', user=user, character=char, current_class=current_class, current_level=current_level, all_classes=all_classes)


@character_bp.route("/character/create", methods=['GET', 'POST'])
def create():
    
    all_races = DND_Race.query.all()
    all_classes = DND_Class.query.all()
    all_backgrounds = DND_Background.query.all()
    if request.method == 'POST':
        #returns list of levels where the class is the index. will have to be changed in the future for homebrew content
        #in the future we will need to keep track of the indexes and associate them with the user's chosen homebrew classes
        levels = request.form.getlist("multiclass_level")
        classes = []

        char_name = request.form.get('charname')
        #ruleset = request.form.get('ruleset')
        #xp_method = request.form.get('xp_method')
        #encumbrance = request.form.get('encumbrance')
        

        for i in range(len(levels)):
            if levels[i] != "0":
                classes.append(i+1)
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
        appearance = request.form.get('appearance')
        backstory = request.form.get('backstory')
        bonds = request.form.get('bonds')
        misc_description = request.form.get('misc_description')

        race = request.form.get('charrace')

        #equipment = request.form.getlist('equipment')

        new_character = Character(
            owner_id=current_user.id,
            name=char_name,
            faith=None,
            proficiency_bonus=math.ceil(sum(map(int, levels)) / 4) + 1,
            total_level=sum(map(int, levels)),)
        
        db.session.add(new_character)
        db.session.commit()

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
            misc = misc_description
        )

        db.session.add(new_character_details)
        db.session.commit()

        new_character_stats = Character_Stats(
            char_id = new_character.char_id,
            strength = strength,
            dexterity = dexterity,
            constitution = constitution,
            intelligence = intelligence,
            wisdom = wisdom,
            charisma = charisma
        )

        db.session.add(new_character_stats)
        db.session.commit()

        new_character_race = Character_Race(
            char_id = new_character.char_id,
            race_id = race
        )

        #TODO: Save character class(es)
        #TODO: Save Character HP
        #TODO: Save Character Death Saves
        
        db.session.add(new_character_race)
        db.session.commit()
    
    return render_template("character/character_creator.html", all_backgrounds=all_backgrounds, all_classes=all_classes, all_races=all_races)

@character_bp.route('/delete_character/<character_id>', methods=['POST'])
@login_required
def delete_character(character_id):
    # Find the character by ID
    character = Character.query.filter_by(char_id=character_id, owner_id=current_user.id).first()

    # This technically worked. But it's ugly so need some kind of solution to make it less ugly
    if not character:
        return jsonify({"error": "Character not found or unauthorized"}), 404
    try:
        # Delete the character from the database
        db.session.delete(character)
        db.session.commit()
        return jsonify({"message": "Character deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while deleting the character"}), 500