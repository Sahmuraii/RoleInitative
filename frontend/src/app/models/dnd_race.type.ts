export type DND_Race = {
    race_id: number,
    name: string, 
    description: string,
    speed: number,
    size: string,
    is_official: boolean,
    alignment_description: string,
    age_description: string,
    size_description: string,
    language_description: string,
    languages: string[],
    traits: string[],
    ability_bonuses: string[],
    starting_proficiencies: string[],
    subraces: string[]

}