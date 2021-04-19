import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EP } from './ep';
import { Observable } from 'rxjs';

@Injectable()
export class SwaggerEngineService {
  private _url : string = '//localhost:8000/v2/store/inventory';
  // private _url : string = '/assets/data/q.json';
  constructor(private http: HttpClient) { }
  // constructor() { }
  getData() : Observable <EP[]>  {
    return this.http.get<EP[]>(this._url)
  }

}
