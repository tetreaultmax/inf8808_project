import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-slope-chart',
  templateUrl: './slope-chart.component.html',
  styleUrls: ['./slope-chart.component.css']
})
export class SlopeChartComponent implements OnInit {

  constructor() { }
  ngOnInit() {
	const path = "/assets/stats/top_players_year.csv"
	d3.csv(path).then(data =>{
		const X = data.map(d => {
			return String(d['year'])
		})
		let max = 0
		const Y = data.map(d => {
			if (Number(d['points']) > max){
				max = Number(d['points'])
			}
			return Number(d['points'])
		})
		const Z = data.map(d => {
			return String(d['player'])
		})
		var color = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a']
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
		var svg = d3.select("#lineChart")
			.append("svg")
			.attr('class', '.lineChart')
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("width", widthChart)
			.attr("height",heightChart)
			.attr("transform", 'translate(' + 1.2*marginSide + ',' + marginTop + ')')
		svg.append('text')
			.attr("transform", 'translate(' + (placeLegend) + ',0)')
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.text('Veuillez cliquer sur une bulle pour interagir: ');
		svg.selectAll("mydots")
			.data(Array.from(new d3.InternSet(Z)))
			.enter()
			.append("circle")
			.attr("cx", 0)
			.attr("cy", function(d,i){ return i*spaceLegend})
			.attr("r", radius)
			.style("fill", function(d, i){ return color[color.length - 1 - i]})
			.attr("transform", 'translate(' + (placeLegend) + ',30)')
			.style('cursor', 'pointer')
			.on('mouseover', function(d){
				d3.select(this).attr("r", 1.4 * radius)
			})
			.on('mouseout', function(d){
				d3.select(this).attr("r",  radius)
			})
			.on('click', function(d, i){
				const names = Array.from(new d3.InternSet(Z))
				let arr_player: d3.DSVRowString<string>[] = []
				data.forEach(d => {
					if (d['player'] == i){
						arr_player.push(d)
					}
				})	
				var points: [number, number][] = []
				arr_player.forEach((playerData, i) => {
					points.push([
						Number(xScale(String(playerData['year']))),
						yScale(Number(playerData['points']))]) 				
				})
				var pos = 0
				for (var j = 0; j < 10; j++){
					if (names[j] == i){
						pos = j
					}
				}
				var id_line = 'line_' + String(pos)
				var exist = document.getElementById(id_line)
				if (exist == null){
					const lineGroup = svg.append('g').append('path').attr('id', id_line).style('fill', 'none').style('stroke', color[color.length - 1 - pos]).style('stroke-width', '2px')
					const line = d3.line().x(year => year[0]).y(year => year[1])
					lineGroup.attr('d', line(points))
				}
				else{
					svg.selectAll('#' + id_line).remove()
				}
				
			})

		svg.selectAll("mylabels")
			.data(Array.from(new d3.InternSet(Z)))
			.enter()
			.append("text")
			.attr("y", function(d,i){ return i*spaceLegend})
			.text(function(d){ return d})
			.attr("text-anchor", "left")
			.style("alignment-baseline", "middle")
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.attr("transform", 'translate(' + (placeLegend + 10) + ',30)')
		const yScale = d3.scaleLinear().domain([0, max]).range([heightChart - margin, 0])
		const xDomain = d3.sort(Array.from(new d3.InternSet(X)))
		const xScale = d3.scaleBand().domain(xDomain).range([0, widthChart])
		const xAxis = d3.axisBottom(xScale)
		const yAxis = d3.axisLeft(yScale)
		svg.append("g")
			.attr("class", "y axis")
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.call(yAxis);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + -40 + "," + (heightChart - margin) + ")")
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
			.text('Nombres de points');
		svg.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(' + widthChart/2 + ',' + -20 + ')')
			.style('font-family', 'Helvetica')
			.style('font-size', 24)
			.text("Évolution du nombre de points des meilleurs pointeurs de l'histoire encore actif");
		const allPlayers = Array.from(new d3.InternSet(Z))
		let all_stats: any[] = []
		allPlayers.forEach((player, i) => {
			let arr_player: d3.DSVRowString<string>[] = []
			data.forEach(d => {
				if (d['player'] == player){
					arr_player.push(d)
				}
			})
			all_stats.push(arr_player)
		})
		all_stats.forEach((d, i) => {
			const lineGroup = svg.append('g').append('path').attr('id', 'line_' + String(i)).style('fill', 'none').style('stroke', color[color.length - 1 - i]).style('stroke-width', '2px')
			const line = d3.line().x(year => year[0]).y(year => year[1])
			const points: [number, number][] = d.map((point: { [x: string]: any; }) => [
					Number(xScale(String(point['year']))),
					yScale(Number(point['points']))]
			)
			lineGroup.attr('d', line(points))
		})	
	})
  }
}
