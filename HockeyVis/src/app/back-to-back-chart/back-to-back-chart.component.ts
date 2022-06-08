import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { SEASONS_YEARS } from 'src/assets/constants';
import { BackToBackService } from '../back-to-back.service';

const margin = {top: 20, right: 30, bottom: 40, left: 90},
    height = 400 - margin.top - margin.bottom;
@Component({
  selector: 'app-back-to-back-chart',
  templateUrl: './back-to-back-chart.component.html',
  styleUrls: ['./back-to-back-chart.component.css'],
  providers: [BackToBackService]
})
export class BackToBackChartComponent implements OnInit {
    private width = window.innerWidth;
  
    constructor(private backToBackService : BackToBackService) { 
  }

  ngOnInit(): void {
    this.buildBarChart()
  }  
  
  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
    this.width = window.innerWidth
  }

  private buildBarChart() : void{
    
    const svg = d3.select('#my_dataviz')
      .append("svg")
        .attr("width", '100%')
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("width", '100%')
        .attr("height", height + margin.top + margin.bottom)
    this.buildXAxes(svg)
  }

  private buildXAxes(svg : any): void{
    const xAxes = d3.scaleBand()
    .domain(SEASONS_YEARS.reverse())
    .range([0, height])
  

    svg.append('g')
      .attr("transform",
        "translate(" + (this.width + margin.left + margin.right)/2 + "," + margin.top + ")")
      .call(d3.axisLeft(xAxes)
      .tickSizeInner(0)).select(".domain")
        .remove()

  }

}
