import { Component, HostListener, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { BackToBackService } from '../back-to-back.service';


@Component({
  selector: 'app-back-to-back-chart',
  templateUrl: './back-to-back-chart.component.html',
  styleUrls: ['./back-to-back-chart.component.css'],
  providers: [BackToBackService]
})
export class BackToBackChartComponent implements OnInit {
  
    constructor(private backToBackService : BackToBackService) { 
  }

  ngOnInit(): void {
  }  
  
  @HostListener('window:resize', ['$event'])
    onResize() {
    this.backToBackService.width = window.innerWidth
    window.location.reload();
  }  
}
