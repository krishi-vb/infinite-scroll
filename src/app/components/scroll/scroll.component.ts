import { Component, OnInit } from '@angular/core';
import { ColorsService } from 'src/app/services/colors.service';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss'],
})
export class ScrollComponent implements OnInit {
  constructor(private colors: ColorsService) {}

  ngOnInit(): void {
    this.colors.getColors().subscribe(console.log);
  }
}
