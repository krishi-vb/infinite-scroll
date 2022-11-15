import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ColorDetail, ColorsResponse } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  constructor(private http: HttpClient) {}

  // pageNumbers: number[] = [];

  getColors(page: number): Observable<ColorDetail[]> {
    console.log('this is page', page);
    return this.http
      .get<ColorsResponse>(`https://reqres.in/api/unknown`, {
        params: new HttpParams().set('per_page', '3').set('page', `${page}`),
      })
      .pipe(map((res: ColorsResponse) => res.data as ColorDetail[]));
  }
}
