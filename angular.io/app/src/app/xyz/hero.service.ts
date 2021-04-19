import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor() { }
  getList() {
    return ['a', 'b', 'c', 'e']
  }
}
