import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import {randomNormal} from "d3";

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
    const height = 0.7 * window.innerHeight;
    const widthChart = 0.7 * width
    const heightChart = 0.7 * height
    const marginTop = 50
    const marginSide = 100
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
        .attr("transform", "translate(0," + (heightChart - 50) + ")")
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

      svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) {
          return xScale(Number(d["Seconds_Elapsed"])/60)
        })
        .attr("cy", randomNormal(heightChart - 50, 25))
        .attr('r', 3)
    })
  }
}
