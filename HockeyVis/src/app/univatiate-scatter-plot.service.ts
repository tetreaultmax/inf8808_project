import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {randomNormal} from "d3";

@Injectable({
  providedIn: 'root'
})
export class UnivatiateScatterPlotService {

  constructor() {
    const width = window.innerWidth;
    const height = 0.7 * window.innerHeight;
    const widthChart = 0.7 * width
    const heightChart = 0.7 * height
    const marginTop = 50
    const marginSide = 100
    const mockData = Array.from({length: 100}, () => Math.floor(Math.random() * 60));

    const buildUnivariateScatter = () => {
      let svg = d3.select("#univariateScatter")
        .append("svg")
        .attr('class', 'univariate-scatter-plot')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("width", widthChart)
        .attr("height",heightChart)
        .attr("transform", 'translate(' + marginSide + ',' + marginTop + ')')

      let xScale = d3.scaleLinear()
        .domain([0, 60])
        .range([0, widthChart])

      let xAxis = d3.axisBottom(xScale)
        .ticks(4)
        .tickSize(30)
        .tickSizeOuter(0)

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (heightChart - 50) + ")")
        .call(xAxis)
        .selectAll(".tick line, .tick text")
        .attr("transform", "translate(0,-15)")

      svg.selectAll("dot")
        .data(mockData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) {
          return xScale(d)
        })
        .attr("cy", randomNormal(heightChart - 50, 50))
        .attr('r', 3)
      }

      setTimeout(buildUnivariateScatter, 500)
    }
}
