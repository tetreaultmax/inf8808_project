import { HttpClient } from '@angular/common/http';
import { ElementRef, HostListener, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
interface StackedChart{
	goals: number,
	shots: number,
	misses: number,
	blocked: number,
	year: number
}
@Injectable({
  providedIn: 'root'
})
export class StackedBarChartService {

	constructor(private http: HttpClient){
		var data = [
			{year: 2007, shots: 65294, misses: 26889, blocked: 29648, goals: 7034},
			{year: 2008, shots: 67671, misses: 28492, blocked: 32237, goals: 7345},
			{year: 2009, shots: 68390, misses: 29017, blocked: 33422, goals: 7245},
			{year: 2010, shots: 68580, misses: 29108, blocked: 34902, goals: 7045},
			{year: 2011, shots: 67223, misses: 28686, blocked: 34796, goals: 6954},
			{year: 2012, shots: 38467, misses: 16536, blocked: 20597, goals: 4048},
			{year: 2013, shots: 68009, misses: 29067, blocked: 34757, goals: 6986},
			{year: 2014, shots: 67704, misses: 28776, blocked: 35598, goals: 6929},
			{year: 2015, shots: 66979, misses: 28635, blocked: 34845, goals: 6803},
			{year: 2016, shots: 68030, misses: 29123, blocked: 34994, goals: 6928},
			{year: 2017, shots: 74176, misses: 31195, blocked: 37423, goals: 7691},
			{year: 2018, shots: 72708, misses: 30392, blocked: 36261, goals: 7765},
			{year: 2019, shots: 61843, misses: 25261, blocked: 29615, goals: 6648},
			{year: 2020, shots: 47221, misses: 19350, blocked: 22554, goals: 5176},
			{year: 2021, shots: 75232, misses: 30424, blocked: 35369, goals: 8374}
		  ];
		var colors = ['#7FFFD4', '#D2691E', '#8B0000', '#808080'];
		var categories = ["shots", "misses", "blocked", "goals"]
		var margin = 50;
		var width = window.innerWidth;
		var height = window.innerHeight;
		var legendHeight = 100
		var keys = ["Buts", "Tirs bloqués", "Tirs ratés", "Tirs tentés"]
		var stackedData = d3.stack().keys(categories)(data as any)
		const buildBarChart = () => {
			var svg = d3.select("#stackedBar")
				.append("svg")
				.attr('class', 'stacked-chart')
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("width", width/2)
				.attr("height", height/2)
				.attr("transform", 'translate(' + margin + ',' + margin + ')')
				
			svg.selectAll("mydots")
				.data(keys)
				.enter()
				.append("circle")
				  .attr("cx", 0)
				  .attr("cy", function(d,i){ return i*25})
				  .attr("r", 7)
				  .style("fill", function(d, i){ return colors[3 - i]})
				  .attr("transform", 'translate(' + (width/2 + 10) + ',0)')
			svg.selectAll("mylabels")
				.data(keys)
				.enter()
				.append("text")
				.attr("y", function(d,i){ return i*25})
				.text(function(d){ return d})
				.attr("text-anchor", "left")
				.style("alignment-baseline", "middle")
				.attr("transform", 'translate(' + (width/2 + 20) + ',0)')
				
			var domain = data.map(function(d) { return String(d.year); })
			var xScale = d3.scaleBand().padding(1).domain(domain).range([0, width/2])

			let max = 0
			data.forEach(d => {
				const total = d.goals + d.misses + d.shots + d.blocked
				if (total > max) {
					max = total
				}
			})

			var yScale = d3.scaleLinear()
				.domain([0, max]).nice()
				.range([height/2 - margin, 0]);

			var yAxis = d3.axisLeft(yScale).tickSize(-width/2)
	
			var xAxis = d3.axisBottom(xScale)
	
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
	
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (height/2 - margin) + ")")
				.call(xAxis);
			svg.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate(' + width/4 + ',' + (height/2 - 10) + ')')
				.style('font-family', 'Helvetica')
				.style('font-size', 12)
				.text('Saisons');
			svg.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate(-40,' + (height/2 - margin)/2 + ')rotate(-90)')
				.style('font-family', 'Helvetica')
				.style('font-size', 12)
				.text('Nombre de tirs');

			
			var groups = svg.selectAll("g.bars")
				.data(stackedData)
				.enter().append("g")
				.attr("class", "bars")
				.style("fill", function(d, i) { return colors[i]; })
				.style("stroke", "#000")

			groups.selectAll("rect")
				.data(function(d) { return d; })
				.enter()
				.append("rect")
				.attr('width', 40)
				.attr("x", function(d) { return +(xScale(String(d.data['year'])) as Number); })
				.attr("y", function(d) { return yScale(d[1]); })
				.attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
				.attr("transform", 'translate(' + (-20) + ',0)')
		}
		setTimeout( buildBarChart, 500)
		
	}
}