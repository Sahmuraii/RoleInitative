from flask import render_template, Blueprint, request, redirect, url_for
from flask_login import current_user
from sqlalchemy import select
from src.auth.models import User
from src.character.models import Character, Character_Class, DND_Class, DND_Race, DND_Background
from src import db

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
        for i in range(len(levels)):
            if levels[i] != "0":
                classes.append(i+1)
        #just a dummy html page that displays two arrays
        return render_template("character/test_display.html", classes=classes, levels=levels)
    

    return render_template("character/character_creator.html", all_backgrounds=all_backgrounds, all_classes=all_classes, all_races=all_races)