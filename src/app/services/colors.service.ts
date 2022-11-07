import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  constructor(private http: HttpClient) {}

  getColors(): Observable<unknown> {
    return this.http.get('https://reqres.in/api/unknown?per_page=3&page=1');
  }
}
