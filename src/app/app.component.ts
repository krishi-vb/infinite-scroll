import { Component, HostListener, OnInit } from '@angular/core';
import { ColorDetail } from './models/types';
import { ColorsService } from './services/colors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'infinite-scroll';

  pageForAPI = 1;

  colorsArr: ColorDetail[] = [];

  fetchingDisabled = false;

  @HostListener('window:scroll', ['$event']) scroll(event: Event) {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      this.pageForAPI++;
      this.fetchNextThreeColors();
    }
  }

  constructor(private colors: ColorsService) {}

  ngOnInit(): void {
    this.getInitialColors();
  }

  private getInitialColors() {
    this.colors.getColors(this.pageForAPI).subscribe((colorsArr) => {
      this.colorsArr = [...colorsArr];
    });
  }

  private getScrollTopValue() {
    return document.documentElement.scrollTop;
  }

  private fetchNextThreeColors() {
    console.log('bringing colors from page', this.pageForAPI);
    if (!this.fetchingDisabled) {
      this.colors.getColors(this.pageForAPI).subscribe((newColorsArr) => {
        if (newColorsArr.length > 0) {
          this.colorsArr = [...this.colorsArr, ...newColorsArr];
        } else this.fetchingDisabled = true;
      });
    }
  }
}
