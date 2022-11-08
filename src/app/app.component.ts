import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, map, Observable, Subject, takeUntil } from 'rxjs';
import { ColorDetail, ColorsResponse } from './models/types';
import { ColorsService } from './services/colors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'infinite-scroll';

  pageForAPI = 0;

  // colors$: Observable<ColorDetail[]> = this.colors.getColors();
  colorsArr: ColorDetail[] = [];

  scrollObservable$!: Observable<unknown>;

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
    this.getColors();
    console.log(this.documentHeight);
    this.scrollObservable$.subscribe((scrollTop) => {
      if ((scrollTop as number) > 976) {
        this.bringMoreColors();
      }
    });

    // this.scrollObservable$.subscribe((scrollTop) =>
    //   console.log(typeof scrollTop)
    // );
  }

  ngOnDestroy(): void {
    this._destroy.next(null);
  }

  getColors() {
    this.colors
      .getColors(this.pageForAPI)
      .subscribe((data) => this.colorsArr.push(...data));

    this.pageForAPI++;
  }

  yPositionForEvent() {
    return document.documentElement.scrollTop;
  }

  bringMoreColors() {
    console.log(this.pageForAPI);
    this.colors.getColors(this.pageForAPI).subscribe((data) => {
      this.colorsArr.push(...data);
      this.pageForAPI++;
    });
  }
}
