import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ColorDetail, ColorsResponse } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  constructor(private http: HttpClient) {}

  pageNumbers: number[] = [];

  getColors(page: number): Observable<ColorDetail[]> {
    this.pageNumbers.push(page);

    // let tempPage = page - 1;

    if (this.pageNumbers.includes(page)) {
      return this.http
        .get<ColorsResponse>(
          `https://reqres.in/api/unknown?per_page=3&page=${page}`
        )
        .pipe(map((res: ColorsResponse) => res.data as ColorDetail[]));
    }

    return of([]);
  }
}
