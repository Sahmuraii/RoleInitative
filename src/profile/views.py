from flask import render_template, Blueprint, request, redirect, url_for
from flask_login import current_user
from sqlalchemy import select
from src.auth.models import User
from src.profile.models import Character
from src.profile.models import Character_Class, DND_Class
from src import db

profile_bp = Blueprint('profile_bp', __name__, template_folder='../templates')


@profile_bp.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    user = current_user
    if request.method == 'POST':
        requested_charname = request.form.get("charname")
        char = Character(owner_id=user.id, name=requested_charname, alignment="Neutral", faith="None", proficency_bonus=2, total_level=1)
        db.session.add(char)
        db.session.commit()

    if user:
        userChars = db.session.execute(select(Character).where(Character.owner_id == user.id)).scalars().all()
        return render_template('profile/account.html', user=user, userChars=userChars)
    else:
        return "User not found", 404

@profile_bp.route('/profile/<username>/<character>', methods=['GET', 'POST'])
def character_detail(username, character):
    user = User.query.filter_by(username=username).first()
    if not user:
        return "User not found", 404

    # Get the character by owner ID and name
    char = Character.query.filter_by(owner_id=user.id, name=character).first()
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
        return redirect(url_for('profile_bp.character_detail', username=username, character=character))

    # Render the template with character and dnd_class
    return render_template('profile/character_detail.html',user=user,character=char, current_class=current_class, current_level=current_level,all_classes=all_classes)



# @profile_bp.route('/<username>/<character>/change_class', methods=['GET', 'POST'])
# def change_class(username, character):
#     user = User.query.filter_by(username=username).first()
#     if not user:
#         return "User not found", 404

#     char = Character.query.filter_by(owner_id=user.id, name=character).first()
#     if not char:
#         return "Character not found", 404

#     if request.method == 'POST':
#         new_class_id = request.form.get('class_id')  # Get the new class ID from the form
#         char.class_id = new_class_id  # Update the character's class
#         db.session.commit()
#         return redirect(url_for('profile_bp.character_detail', username=username, character=char.name))

#     # Assuming you have a way to get all available classes
#     classes = DnDClass.query.all()
#     return render_template('profile/change_class.html', user=user, character=char, classes=classes)
