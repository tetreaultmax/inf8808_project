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
	constructor(){
		d3.csv("/assets/shot_data.csv").then((data) =>{
			const new_data: { year: number; shots: number; misses: number; blocked: number; goals: number; }[] = []
			data.forEach(d => {
				const year = Number(d['year'])
				const shots = Number(d['shot'])
				const misses = Number(d['miss'])
				const blocked = Number(d['block'])
				const goals = Number(d['goal'])
				new_data.push({year, shots, misses, blocked, goals})
			})
			
			var colors = ['#7FFFD4', '#D2691E', '#8B0000', '#808080'];
			var categories = ["shots", "misses", "blocked", "goals"]
			var margin = 50;
			var marginTop = 50
			var marginSide = 100
			var width = 0.9 * window.innerWidth;
			var height = 0.8* window.innerHeight;
			var widthChart = 0.7 * width
			var heightChart = 0.9 * height
			var placeLegend = widthChart + 10
			var spaceLegend = 50
			var radius = 10
			var keys = ["Buts", "Tirs bloqués", "Tirs ratés", "Tirs tentés"]
			var stackedData = d3.stack().keys(categories)(new_data)

			const buildBarChart = () => {
			var svg = d3.select("#stackedBar")
				.append("svg")
				.attr('class', 'stacked-chart')
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("width", widthChart)
				.attr("height",heightChart)
				.attr("transform", 'translate(' + 1.2*marginSide + ',' + marginTop + ')')

			svg.selectAll("mydots")
				.data(keys)
				.enter()
				.append("circle")
				.attr("cx", 0)
				.attr("cy", function(d,i){ return i*spaceLegend})
				.attr("r", radius)
				.style("fill", function(d, i){ return colors[colors.length - 1 - i]})
				.attr("transform", 'translate(' + (placeLegend) + ',0)')
			svg.selectAll("mylabels")
				.data(keys)
				.enter()
				.append("text")
				.attr("y", function(d,i){ return i*spaceLegend})
				.text(function(d){ return d})
				.attr("text-anchor", "left")
				.style("alignment-baseline", "middle")
				.style('font-family', 'Helvetica')
				.style('font-size', 20)
				.attr("transform", 'translate(' + (placeLegend + 10) + ',0)')

			var domain = data.map(function(d) { return String(d['year']); })
			var xScale = d3.scaleBand().padding(1).domain(domain).range([0, widthChart])

			let max = 0
			data.forEach(d => {
				const total = Number(d['goal']) + Number(d['miss']) + Number(d['shot']) + Number(d['block'])
				if (total > max) {
					max = total
				}
			})

			var yScale = d3.scaleLinear()
				.domain([0, max]).nice()
				.range([heightChart - margin, 0]);

			var yAxis = d3.axisLeft(yScale).tickSize(-widthChart)

			var xAxis = d3.axisBottom(xScale)

			svg.append("g")
				.attr("class", "y axis")
				.style('font-family', 'Helvetica')
				.style('font-size', 20)
				.call(yAxis);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (heightChart - margin) + ")")
				.style('font-family', 'Helvetica')
				.style('font-size', 20)
				.call(xAxis);
			svg.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate(' + widthChart/2 + ',' + (heightChart) + ')')
				.style('font-family', 'Helvetica')
				.style('font-size', 20)
				.text('Saisons');
			svg.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate(' + -2 * marginTop + ',' + (heightChart - margin)/2 + ')rotate(-90)')
				.style('font-family', 'Helvetica')
				.style('font-size', 20)
				.text('Nombre de tirs');
			svg.append('text')
				.attr("transform", 'translate(' + (placeLegend) + ',200)')
				.style('font-family', 'Helvetica')
				.style('font-size', 20)
				.attr('id', 'tooltip')

			var groups = svg.selectAll("g.bars")
				.data(stackedData)
				.enter().append("g")
				.attr("class", "bars")
				.style("fill", function(d, i) { return colors[i]; })



			groups.selectAll("rect")
				.data(function(d) { return d; })
				.enter()
				.append("rect")
				.attr('width', 40)
				.attr("x", function(d) { return +(xScale(String(d.data['year'])) as Number); })
				.attr("y", function(d) { return yScale(d[1]); })
				.attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
				.attr("transform", 'translate(' + (-20) + ',0)')
				.on('mouseover', (event, d) => {
					d3.select('#tooltip').text(`Fréquence de tirs: ${d[1] - d[0]}`).style('opacity', 1).style('font-family', 'Helvetica')
					.style('font-size', 20)
				  })
				.on('mouseout', () => d3.select('#tooltip').style('opacity', 0));
			}
			setTimeout( buildBarChart, 500)
		})
	}
}