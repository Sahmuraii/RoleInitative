from flask import render_template, Blueprint, request, redirect, url_for
from src import db 
from src.character.models import DND_Background, DND_Spell

homebrew_bp = Blueprint('homebrew_bp', __name__, template_folder='../templates')

@homebrew_bp.route('/create_homebrew', methods=['GET', 'POST'])
def create_homebrew():
    if request.method == 'POST':
        return redirect(url_for('homebrew_bp.create_homebrew'))
    return render_template('homebrew/create_homebrew.html')

@homebrew_bp.route('/create_background', methods=['GET', 'POST'])
def create_background():
    if request.method == 'POST':
        name = request.form.get('name') # Get the name of the background
        description = request.form.get('description') # Get the description of the background

        skill_proficiencies = request.form.getlist('skill_proficiency[]') # Get the skill proficiencies added by background
        tool_proficiencies = request.form.getlist('tool_proficiency[]') # Get the tool proficiencies added by background
        language_proficiencies = request.form.getlist('language_proficiency[]') # Get the language proficiencies added by background
        equipment = request.form.getlist('equipment[]') # Get the equipment added by background

        feature_name = request.form.get('feature_name') # Get the name of the feature given
        feature_description = request.form.get('feature_description') # Get the description of the feature given
        
        personality_traits = request.form.getlist('personality_traits') # Get the personality traits suggested
        ideals = request.form.getlist('ideals') # Get the ideals suggested
        bonds = request.form.getlist('bonds') # Get the bonds suggested
        flaws = request.form.getlist('flaws') # Get the flaws suggested

        # Suggested Characteristics JSON
        suggested_characteristics = {
            "personality_traits": personality_traits,
            "ideals": ideals,
            "bonds": bonds,
            "flaws": flaws
        }

        # Create a new DND_Background object
        new_background = DND_Background(
            background_name=name,
            background_description=description,
            skill_proficiencies=skill_proficiencies,
            tool_proficiencies=tool_proficiencies,
            language_proficiencies=language_proficiencies,
            equipment=equipment,
            feature_name=feature_name,
            feature_effect=feature_description,
            suggested_characteristics=suggested_characteristics,
            specialty_table=None 
        )

        # Add to the database session and commit
        try:
            db.session.add(new_background)
            db.session.commit()
            print(f"Background {name} successfully added to the database.")
        except Exception as e:
            db.session.rollback()
            print(f"Error adding background to the database: {e}")

        return redirect(url_for('homebrew_bp.create_background'))  # Redirect to the same page after submission

    return render_template('homebrew/create_background.html')

@homebrew_bp.route('/create_spell', methods=['GET', 'POST'])
def create_spell():
    if request.method == 'POST':
        spell_name = request.form.get('spell_name')
        spell_level = request.form.get('spell_level')
        spell_school = request.form.get('spell_school')
        casting_time = request.form.get('casting_time')
        reaction_condition = request.form.get('reaction_condition')
        range_area = request.form.get('range_area')
        components = [
            request.form.get('verbal') == 'true',
            request.form.get('somatic') == 'true',
            request.form.get('material') == 'true'
        ]
        material = request.form.get('material')
        duration = request.form.get('duration')
        description = request.form.get('description')
        higher_level = request.form.get('higher_level')
        classes = request.form.getlist('classes[]')
        subclasses = request.form.getlist('subclasses[]')

        # Create a new DND_Spell object
        new_spell = DND_Spell(
            spell_name=spell_name,
            spell_level=int(spell_level),
            spell_school=spell_school,
            casting_time=casting_time,
            reaction_condition=reaction_condition,
            range_area=range_area,
            components=components,
            material=material,
            duration=duration,
            description=description,
            higher_level=higher_level,
            classes=classes,
            subclasses=subclasses
        )

        # Add to the database session and commit
        try:
            db.session.add(new_spell)
            db.session.commit()
            print(f"Spell {spell_name} successfully added to the database.")
        except Exception as e:
            db.session.rollback()
            print(f"Error adding spell to the database: {e}")

        return redirect(url_for('homebrew_bp.create_spell'))  # Redirect to the same page after submission

    return render_template('homebrew/create_spell.html')