import { Component, HostListener, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css']
})
export class StackedBarChartComponent implements OnInit {

  ngOnInit() {
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

		var colors = ['#2b8cbe', '#7bccc4', '#bae4bc','#f0f9e8'];
		var categories = ["shots", "misses", "blocked", "goals"]
		const width = window.innerWidth;
    	const height = window.innerHeight;
    	const widthChart = 0.8 * width
		const heightChart = 0.8 * height
		const marginTop = 0.1 * height
    	const marginSide = 0.07 * width
		const spaceLegend = 0.1 * heightChart
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
			.attr("transform", 'translate(' + marginSide + ',' + marginTop + ')')

		svg.selectAll("mydots")
			.data(keys)
			.enter()
			.append("circle")
			.attr("cx", 0)
			.attr("cy", function(d,i){ return i*spaceLegend})
			.attr("r", radius)
			.style("fill", function(d, i){ return colors[colors.length - 1 - i]})
			.attr("transform", 'translate(' + (widthChart + 10) + ',0)')
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
			.attr("transform", 'translate(' + (widthChart + 20) + ',0)')

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
			.range([heightChart - marginTop, 0]);

		var yAxis = d3.axisLeft(yScale).tickSize(-widthChart)

		var xAxis = d3.axisBottom(xScale)

		svg.append("g")
			.attr("class", "y axis")
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.call(yAxis);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (heightChart - marginTop) + ")")
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
			.attr('transform', 'translate(' + -marginTop + ',' + (heightChart - marginTop)/2 + ')rotate(-90)')
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.text('Nombre de tirs');
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(' + widthChart/2 + ',' + -20 + ')')
			.style('font-family', 'Helvetica')
			.style('font-size', 24)
			.text("Évolution du nombre de tirs durant les 15 dernières années");	
		svg.append('text')
			.attr("transform", 'translate(' + (widthChart) + ',' + heightChart/2+ ')')
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
			.attr("id", "bar")
			.attr('width', 40)
			.attr("x", function(d) { return +(xScale(String(d.data['year'])) as Number); })
			.attr("y", function(d) { return yScale(d[1]); })
			.attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
			.attr("transform", 'translate(' + (-20) + ',0)')
			.on('mouseover', (event, d) => {
				d3.select('#tooltip').text(`Fréquence de tirs: ${d[1] - d[0]}`).style('opacity', 1).style('font-family', 'Helvetica')
				.style('font-size', 20)
				d3.select(event.target).style('filter', 'brightness(50%)')
			  })
			.on('mouseout', event => {
				d3.select('#tooltip').style('opacity', 0);
				d3.select(event.target).style('filter', 'brightness(100%)')
			});
		}
		buildBarChart()
	})
  }
}
