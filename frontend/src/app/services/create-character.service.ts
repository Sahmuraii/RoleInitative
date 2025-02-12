import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { DND_Class } from '../models/dnd_class.type';
import { DND_Race } from '../models/dnd_race.type';

@Injectable({
  providedIn: 'root'
})
export class CreateCharacterService {
  http = inject(HttpClient)
  constructor() { }
  
  getClassData() {
    return this.http.get<Array<DND_Class>>(`${API_URL}/json/classes`)
  }

  getRaceData() {
    return this.http.get<Array<DND_Race>>(`${API_URL}/json/races`)
  }
}
