from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from src import db 
from src.character.models import UserBackground, UserSpell

homebrew_bp = Blueprint('homebrew_bp', __name__, template_folder='../templates')

@homebrew_bp.route('/create_homebrew', methods=['GET', 'POST'])
def create_homebrew():
    if request.method == 'POST':
        return redirect(url_for('homebrew_bp.create_homebrew'))
    return render_template('homebrew/create_homebrew.html')

@homebrew_bp.route('/create_background', methods=['GET', 'POST'])
def create_background():
    print("Received a request to /create_background")
    print("Request method:", request.method)
    print("Request headers:", request.headers)
    print("Request data:", request.get_json())
    if request.method == 'POST':
        print("Method = Post")
        # Parse JSON data from the request
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Extract data from the JSON payload
        user_id = data.get('user_id')  # Get the user ID to tie the background to a user
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        name = data.get('name')  # Get the name of the background
        description = data.get('description')  # Get the description of the background

        skill_proficiencies = data.get('skillProficiencies', [])  # Get the skill proficiencies
        tool_proficiencies = data.get('toolProficiencies', [])  # Get the tool proficiencies
        language_proficiencies = data.get('languageProficiencies', [])  # Get the language proficiencies
        equipment = data.get('equipment', [])  # Get the equipment

        feature_name = data.get('featureName')  # Get the name of the feature
        feature_description = data.get('featureDescription')  # Get the description of the feature

        personality_traits = data.get('personalityTraits', [])  # Get the personality traits
        ideals = data.get('ideals', [])  # Get the ideals
        bonds = data.get('bonds', [])  # Get the bonds
        flaws = data.get('flaws', [])  # Get the flaws

        # Suggested Characteristics JSON
        suggested_characteristics = {
            "personality_traits": personality_traits,
            "ideals": ideals,
            "bonds": bonds,
            "flaws": flaws
        }

        # Optional: If this is a modified version of an existing background
        original_background_id = data.get('original_background_id')  # Get the original background ID (if applicable)

        # Create a new UserBackground object
        new_background = UserBackground(
            user_id=user_id,  # Tie the background to the user
            background_name=name,
            background_description=description,
            skill_proficiencies=skill_proficiencies,
            tool_proficiencies=tool_proficiencies,
            language_proficiencies=language_proficiencies,
            equipment=equipment,
            feature_name=feature_name,
            feature_effect=feature_description,
            suggested_characteristics=suggested_characteristics,
            specialty_table=None,
        )

        # Add to the database session and commit
        try:
            db.session.add(new_background)
            db.session.commit()
            print(f"Background {name} successfully added to the database.")
            return jsonify({"message": "Background created successfully!"}), 201
        except Exception as e:
            db.session.rollback()
            print(f"Error adding background to the database: {e}")
            return jsonify({"error": "Failed to create background"}), 500

    # Handle GET request (if needed)
    return render_template('homebrew/create_background.html')

@homebrew_bp.route('/create_spell', methods=['GET', 'POST'])
def create_spell():
    print("Received a request to /create_spell")
    print("Request method:", request.method)
    print("Request headers:", request.headers)
    print("Request data:", request.get_json())

    if request.method == 'POST':
        print("Method = POST")
        # Parse JSON data from the request
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Extract data from the JSON payload
        user_id = data.get('userID')  # Get the user ID to tie the spell to a user
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        spell_name = data.get('name')  # Get the spell name
        version = data.get('version')  # Get the version (optional)
        level = data.get('level')  # Get the spell level
        school = data.get('school')  # Get the spell school
        casting_time = data.get('castingTime')  # Get the casting time
        reaction_description = data.get('reactionDescription')  # Get the reaction description (optional)
        components = data.get('components', [])  # Get the spell components
        materials_description = data.get('materialsDescription')  # Get the materials description (optional)
        spell_range_type = data.get('spellRangeType')  # Get the range type
        range = data.get('range')  # Get the range value (optional)
        area_length = data.get('areaLength')  # Get the area length (optional)
        area_type = data.get('areaType')  # Get the area type (optional)
        duration_type = data.get('durationType')  # Get the duration type
        duration = data.get('duration')  # Get the duration (optional)
        duration_time = data.get('durationTime')  # Get the duration time (optional)
        description = data.get('description')  # Get the spell description
        ritual_spell = data.get('ritualSpell')  # Get whether it's a ritual spell
        higher_level_description = data.get('higherLevelDescription')  # Get the higher-level description (optional)
        higher_level_scaling = data.get('HigherLevelScaling')  # Get the higher-level scaling (optional)
        classes = data.get('classes', [])  # Get the classes that can use the spell
        subclasses = data.get('subclasses', [])  # Get the subclasses that can use the spell
        isSaveOrAttack = data.get('isSaveOrAttack')  # Get whether it's a save or attack spell
        save_stat = data.get('saveStat')  # Get the save stat (optional)
        attack_type = data.get('attackType')  # Get the attack type (optional)
        damage = data.get('damage')  # Get the damage (optional)
        damage_type = data.get('damageType')  # Get the damage type (optional)
        effect = data.get('effect')  # Get the effect (optional)
        inflicts_conditions = data.get('inflictsConditions')  # Get whether it inflicts conditions
        conditions = data.get('conditions', [])  # Get the conditions inflicted (optional)

        # Create a new UserSpell object
        new_spell = UserSpell(
            user_id=user_id,  # Tie the spell to the user
            spell_name=spell_name,
            version=version,
            level=level,
            school=school,
            casting_time=casting_time,
            reaction_description=reaction_description,
            components=components,
            materials_description=materials_description,
            spell_range_type=spell_range_type,
            range=range,
            area_length=area_length,
            area_type=area_type,
            duration_type=duration_type,
            duration=duration,
            duration_time=duration_time,
            description=description,
            ritual_spell=ritual_spell,
            higher_level_description=higher_level_description,
            higher_level_scaling=higher_level_scaling,
            classes=classes,
            subclasses=subclasses,
            isSaveOrAttack=isSaveOrAttack,
            save_stat=save_stat,
            attack_type=attack_type,
            damage=damage,
            damage_type=damage_type,
            effect=effect,
            inflicts_conditions=inflicts_conditions,
            conditions=conditions
        )

        # Add to the database session and commit
        try:
            db.session.add(new_spell)
            db.session.commit()
            print(f"Spell {spell_name} successfully added to the database.")
            return jsonify({"message": "Spell created successfully!"}), 201
        except Exception as e:
            db.session.rollback()
            print(f"Error adding spell to the database: {e}")
            return jsonify({"error": "Failed to create spell"}), 500

    # Handle GET request (if needed)
    return render_template('homebrew/create_spell.html')