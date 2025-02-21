import { Proficiency } from "./proficiency.type"

export type Class_Proficiency_Option = {
    class_id: number,
    description: string,
    given_by_class: number,
    given_when_multiclass: boolean,
    hit_die: number,
    is_official: boolean,
    list_description: string,
    max_choices: number,
    name: string,
    proficiency_list_id: number,
    proficiency_options: Proficiency[]
}