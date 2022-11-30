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

  documentHeight = document.documentElement.clientHeight;

  @HostListener('window:scroll', ['$event']) scroll(event: Event) {
    if (
      this.getScrollTopValue() >
      this.pageForAPI * 3 * this.documentHeight * 0.6
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
    let colorsSubscription = this.colors
      .getColors(this.pageForAPI)
      .subscribe((newColorsArr) => {
        if (newColorsArr.length > 0) {
          this.colorsArr = [...this.colorsArr, ...newColorsArr];
        } else {
          colorsSubscription.unsubscribe();
        }
      });
  }
}
