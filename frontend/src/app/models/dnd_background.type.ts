export type DND_Background = {
    background_id: number,
    background_name: string,
    background_description: string,
    skil_proficiencies: string[],
    tool_proficiencies: string[],
    language_proficiencies: string[],
    equipment: string[],
    feature_name: string,
    feature_effect: string,
    suggested_characteristics: JSON,
    specialty_table: JSON
}