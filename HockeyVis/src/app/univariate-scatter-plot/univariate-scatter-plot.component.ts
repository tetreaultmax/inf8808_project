import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import {randomExponential, randomNormal} from "d3";

@Component({
  selector: 'app-univariate-scatter-plot',
  templateUrl: './univariate-scatter-plot.component.html',
  styleUrls: ['./univariate-scatter-plot.component.css'],
})

export class UnivariateScatterPlotComponent implements OnInit {

  constructor() { }

  movingAverage(values: number[], N: number): Float64Array{
    let i = 0;
    let sum = 0;
    const means = new Float64Array(values.length).fill(NaN);
    for (let n = Math.min(N - 1, values.length); i < n; ++i) {
      sum += values[i];
    }
    for (let n = values.length; i < n; ++i) {
      sum += values[i];
      means[i] = sum / N;
      sum -= values[i - N + 1];
    }
    return means;
  }

  ngOnInit(): void{

    const width = window.innerWidth;
    const height = window.innerHeight;
    const widthChart = 0.8 * width
    const heightChart = 0.8 * height
    const marginTop = 0.1 * height
    const marginSide = 0.1 * width
    const mockData = Array.from({length: 100}, () => Math.floor(Math.random() * 60));

    d3.csv("/assets/goal_times.csv").then((data) =>{
      let svg = d3.select("#univariateScatter")
        .append("svg")
        .attr('class', 'univariate-scatter-plot')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("width", widthChart)
        .attr("height", heightChart)
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
        .attr("transform", "translate(0," + (heightChart/2) + ")")
        .call(xAxis)
        .selectAll(".tick line, .tick text")
        .attr("transform", "translate(0,-15)")

      let periodGroup = svg.append("g")
        .attr("class", "period legend")

      periodGroup.append('text')
        .text("Période 1")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + widthChart / 6 + ",0)")

      periodGroup.append('text')
        .text("Période 2")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + 3 * widthChart / 6 + ",0)")

      periodGroup.append('text')
        .text("Période 3")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + 5 * widthChart / 6 + ",0)")

      let histogram = d3.bin()
      let buckets = histogram(data.map(d => Number(d["Seconds_Elapsed"])/60))

      buckets.forEach((value) => {
        svg.selectAll("dot")
          .data(value)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", function (d) {
            return xScale(d)
          })
          .attr("cy", randomNormal(heightChart/2, value.length/3))
          .attr('r', 5)
          .style("opacity", "50%")
          .style("fill", "rgb(43, 140, 190)")
      })
    })
  }
}
