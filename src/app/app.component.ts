import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, map, Observable, Subject, takeUntil } from 'rxjs';
import { ColorDetail } from './models/types';
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
      map(() => this.getScrollTopValue())
    );
  }

  ngOnInit(): void {
    this.getInitialColors();

    this.scrollObservable$.subscribe((scrollTop) => {
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
    this.colors.getColors(this.pageForAPI).subscribe((colorsArr) => {
      this.colorsArr = [...colorsArr];
    });
  }

  getScrollTopValue() {
    return document.documentElement.scrollTop;
  }

  bringMoreColors() {
    console.log('bringing colors from page', this.pageForAPI);
    this.colors.getColors(this.pageForAPI).subscribe((colorsArr) => {
      if (colorsArr.length > 0) {
        this.colorsArr = [...this.colorsArr, ...colorsArr];
      } else this._destroy.next(null);
    });
  }
}
