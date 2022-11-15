import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ColorDetail, ColorsResponse } from './models/types';
import { ColorsService } from './services/colors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'infinite-scroll';

  pageForAPI = 1;

  colorsArr: ColorDetail[] = [];

  scrollObservable$: Observable<number>;

  private destroy$: Observable<unknown>;

  private _destroy = new Subject<unknown>();

  documentHeight = document.documentElement.clientHeight;

  constructor(private colors: ColorsService) {
    this.destroy$ = this._destroy.asObservable();

    this.scrollObservable$ = fromEvent(document, 'scroll').pipe(
      takeUntil(this.destroy$),
      map((data) => this.yPositionForEvent())
    );
  }

  ngOnInit(): void {
    this.getInitialColors();

    console.log(this.documentHeight);

    this.scrollObservable$.subscribe((scrollTop) => {
      console.log(scrollTop);
      // if (scrollTop > this.pageForAPI * 3 * this.documentHeight * 0.8) {
      //   this.pageForAPI++;
      //   this.bringMoreColors();
      // }

      if (scrollTop > this.pageForAPI * 3 * this.documentHeight * 0.6) {
        this.pageForAPI++;
        this.bringMoreColors();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy.next(null);
  }

  getInitialColors() {
    this.colors
      .getColors(this.pageForAPI)
      .subscribe((data) => this.colorsArr.push(...data));
  }

  yPositionForEvent() {
    return document.documentElement.scrollTop;
  }

  bringMoreColors() {
    console.log(this.pageForAPI);

    this.colors.getColors(this.pageForAPI).subscribe((data) => {
      if (data.length > 0) {
        this.colorsArr.push(...data);
      } else this._destroy.next(null);
    });
  }
}
