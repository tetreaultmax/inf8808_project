import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, ɵHttpInterceptingHandler } from '@angular/common/http';
import * as d3 from 'd3';
import {  TEAM_NAMES, YEARS } from 'src/assets/constants';
import { ChordDiagramService } from '../chord-diagram.service';
import { ScaleService } from '../scale.service';
import { TeamsService } from '../teams.service';
import { environment } from 'src/environments/environment';

const margin = {top: 20, right: 30, bottom: 40, left: 90},
      height = 600 - margin.top - margin.bottom;

@Component({
  selector: 'app-back-to-back-chart',
  templateUrl: './back-to-back-chart.component.html',
  styleUrls: ['./back-to-back-chart.component.css']
})

export class BackToBackChartComponent implements OnInit {
  public width : number = window.innerWidth
  private chartWidth : number = 0.45 * this.width
  public yAxisWidth : number = 0.1 * this.width
  public legendHeight : number = 40
  private xAxisHeight : number = 30
  private selectedTeam = 'MTL';
  private xScale!: d3.ScaleLinear<number, number, never>
  private yScale!: d3.ScaleBand<string>
  private color  = 'gray'
  constructor(private http: HttpClient, private teams: TeamsService, private scale: ScaleService, private chordDiagram : ChordDiagramService) { 
  }

  ngOnInit(): void {
    this.setChart()
  }  
  
  private setChart() : void{
    for (const year of YEARS){
      d3.csv('../assets/team_goal/team_goal_data_' + year.toString() + '.csv').then(data => {
        data.map(d => {
          const teamByYear = this.teams.getTeamByName(String(d['team'])).getSeasonByYear(year)
          teamByYear.goalsScored = Number(d['goals_for'])
          teamByYear.goalsAgainst = Number(d['goals_against'])
        })
      })
    }
    const buildBarChart = () => {
      this.prepareChart()
      this.buildBarChart()
    }
    setTimeout( buildBarChart, 500)
  }

  private prepareChart(){
    this.createElements()
    this.positionPanel()
    this.yScale =  this.scale.getYScale(height)
    this.buildYAxe()
    this.buildXAxe()
    this.appendRectanglesMenu()  
    this.xScale =  this.scale.getXScale(this.chartWidth, this.selectedTeam) 
  }

  public buildBarChart() : void{  
    this.buildLegend()
    this.positionTeamMenu()
    this.appendRectangles('.leftChart')
    this.appendRectangles('.rightChart')
    this.buildLeftChart()
    this.buildRightChart()
    this.addRightBands()
    this.addLeftBands()
  }

  private buildYAxe(): void{
    const callChordDiagram = (year : string) : void => this.chordDiagram.display(year, this.selectedTeam, this.width, height, this.legendHeight) 
    const svg = d3.select('.y.axis')
    .attr('width', this.yAxisWidth)
    .attr("transform", "translate(" + (this.chartWidth + this.yAxisWidth/2 + 3)  + "," + this.legendHeight + ")")
    svg.append('g')
      .call(d3.axisLeft(this.yScale)
      .tickSizeInner(0))
      .attr('text-anchor', 'middle')
      .attr('font-size', '15px')
      .style('cursor', 'pointer')
      .on('mouseover',  function(d: any){
        d3.select(d.target).attr('font-size', '20px')
      })
      .on('mouseout',  function(d: any){
        d3.select(d.target).attr('font-size', '15px')
      })
      .on('click',  function(d: any){
        callChordDiagram(d.srcElement.__data__)
      })
      .select(".domain")
      .remove()
  }

  private buildLegend() : void{
    const color = this.color
    d3.select('.legend').selectAll('*').remove()
    const legend = d3.select('.legend')
      .attr("width", this.width)
      .attr("height", this.legendHeight)
    
    legend.append('g')
      .append('circle')
      .attr('fill', color)
      .attr('r', 5)
      .attr('cx', 50)
      .attr('cy', this.legendHeight/2)
      
    legend.append('text')
      .text(this.selectedTeam)
      .attr('x', 65)
      .attr('y', this.legendHeight/2)
      .style('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
  }

  private buildXAxe(): void{
    const svg = d3.select('.x.axis')
      .attr("width", this.width)
      .attr("height", this.xAxisHeight + 10)
    svg.append('text')
      .attr("transform", "translate(" + 0 + "," + (height + this.xAxisHeight + this.legendHeight)  + ")")
      .text('Buts encaissés')
      .attr('font-size', this.xAxisHeight)
    svg.append('text')
      .attr("transform", "translate(" + (this.width - margin.right) + "," + (height + this.xAxisHeight + this.legendHeight )  + ")")
      .style('text-anchor', 'end')
      .text('Buts marqués')
      .attr('font-size', this.xAxisHeight)
    svg.append('text')
      .attr("transform", "translate(" + (this.width/2) + "," + (height + this.xAxisHeight + this.legendHeight )  + ")")
      .style('text-anchor', 'middle')
      .text('Saison')
      .attr('font-size', this.xAxisHeight)
  }

  private buildLeftChart() : void {
    d3.select('#leftChart')
        .attr("width", this.chartWidth)
        .attr("height", height)
  }

  private buildRightChart() : void {
    d3.select('#rightChart')
        .attr("width", this.chartWidth)
        .attr("height", height)
  } 

  private appendRectangles(toSelect : string) : void{
    const team = this.teams.getTeamByName(this.selectedTeam).seasons
    const svg = d3.select(toSelect).selectAll('.bar-chart')
    d3.select(toSelect).selectAll('g').remove()
    svg.selectAll('rect')
      .remove()
    const g = svg.data(team)
      .enter()
      .append('g')
    g.append('rect')
      .attr('class', this.selectedTeam)
    g.append('text')
      .attr('class', this.selectedTeam)
  }
  
  private addLeftBands() : void{
    const g = d3.select('.leftChart') as any
    const color = this.color
    const sizeBar = 0.90 * this.yScale.bandwidth()
    g.selectAll('rect.' + this.selectedTeam)
      .attr("width", (d: { goalsAgainst: number }) => { return this.xScale(d.goalsAgainst); })
      .attr("height", sizeBar )
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + this.legendHeight  })
      .attr('x', (d: { goalsAgainst: number }) => { return this.chartWidth - this.xScale(d.goalsAgainst); })
      .attr('fill', color)
      .on('mouseover',  function(d: any){
        d3.select(d.target).attr('fill', '#3A3B3C').attr('height',1.3* sizeBar)
      })
      .on('mouseout',  function(d: any){
        d3.select(d.target).attr('height',sizeBar).attr('fill', color)
      })
      
    g.selectAll('text.' + this.selectedTeam)
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))!  + sizeBar/2 + this.legendHeight + 2 })
      .attr('x', (d: { goalsAgainst: number }) => { return this.chartWidth - this.xScale(d.goalsAgainst) + 5 })
      .attr('font-size', sizeBar + 1)
      .attr('fill','white')
      .attr('text-anchor', 'start')
      .style('alignment-baseline', 'middle')
      .text((d: { goalsAgainst: number }) => { return d.goalsAgainst})
  }

  private addRightBands() : void{
    const g = d3.select('.rightChart') as any
    const color = this.color
    const sizeBar = 0.90 * this.yScale.bandwidth()
    g.selectAll('rect.' + this.selectedTeam)
      .attr('x', this.chartWidth + this.yAxisWidth)
      .attr('y',  (d: { year: number; }) => { return this.yScale(((d.year + '-' + (d.year + 1) )))! + this.legendHeight  })
      .attr('width', (d: { goalsScored: d3.NumberValue; }) => { return this.xScale(d.goalsScored); })
      .attr('height', sizeBar)
      .attr('fill', color)
      .on('mouseover',  function(d: any){
        d3.select(d.target).attr('fill', '#3A3B3C').attr('height',1.3* sizeBar)
      })
      .on('mouseout',  function(d: any){
        d3.select(d.target).attr('height',sizeBar).attr('fill', color)
      })
    
    g.selectAll('text.' + this.selectedTeam)
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + sizeBar/2 + this.legendHeight + 2 })
      .attr('x', (d: { goalsScored: number }) => { return this.chartWidth + this.yAxisWidth + this.xScale(d.goalsScored) - 5; })
      .attr('font-size', sizeBar)
      .attr('fill','white')
      .attr('text-anchor', 'end')
      .style('alignment-baseline', 'middle')
      .text((d: { goalsScored: number }) => { return d.goalsScored})
  }



  private createElements() : void {
    const div = d3.select('#dataviz')
    const svg = div.append('svg').attr('class', 'bar-chart')
      .attr('width', this.width)
      .attr('height', height + this.legendHeight + this.xAxisHeight + 10)
    const g = svg.append('g').attr('id', 'graph')
    g.append('g').attr('class', 'legend')
    g.append('g').attr('class', 'menu')
    g.append('g').attr('class', 'x axis')
    g.append('g').attr('class', 'y axis')
    g.append('g').attr('class', 'leftChart')
    g.append('g').attr('class', 'rightChart')
    svg.append('g').attr('id', 'panel')
  }

  positionPanel(){
    d3.select('#panel')
    .style('width', '215px')
    .style('border', '1px solid black')
    .style('padding', '10px')
    .style('visibility', 'hidden')
    .style('background-color', 'blue')
    .attr('x', 65)
    .attr('y', this.legendHeight/2)
  }

  private appendRectanglesMenu() : void{
    const svg = d3.select('.menu').selectAll('.bar-chart')
    const g = svg.data(TEAM_NAMES)
      .enter()
      .append('g')
    g.append('rect')
    g.append('text')
  }

  positionTeamMenu() :void{
    d3.select('.menu').selectAll('.bar-chart').attr('class', 'menu')
      .attr('width', this.chartWidth)
      .attr('height', this.legendHeight) 
    
    const g = d3.select('.menu') as any
    
    const width = (3/2 * this.chartWidth + this.yAxisWidth)/TEAM_NAMES.length*2 *0.9
    const height = this.legendHeight/2 
    const chartWidth = this.chartWidth
    const callTeam = (team : string) : void => this.changeTeam(team)
    g.selectAll('rect')
      .attr('x', function(d : any,i: number): number{
        return (i < TEAM_NAMES.length/2) ? width * i + chartWidth/2 : width * (i - TEAM_NAMES.length/2) + chartWidth/2
      })
      .attr('y', function(d : any,i: number): number{
        return (i < TEAM_NAMES.length/2) ? 0 : height
      })
      .attr('fill', '#D3D3D3')
      .attr('stroke', 'black')
      .attr('width', width)
      .attr('height', height * 0.9)
      .style('cursor', 'pointer')
      .on('click',  function(d: any){
        callTeam(d.srcElement.__data__)
      })
    
    g.selectAll('text')
      .attr('width', width)
      .attr('height', height * 0.9)
      .attr('x', function(d : any,i: number): number{
        return (i < TEAM_NAMES.length/2) ? width * i + chartWidth/2 + width/2 : width * (i - TEAM_NAMES.length/2) + chartWidth/2 + + width/2 
      })
      .attr('y', function(d : any,i: number): number{
        return (i < TEAM_NAMES.length/2) ? height *0.8 : 2*(height*0.9)
      })
      .attr('fill', 'black')
      .style('alignment-baseline', 'baseline')
      .text((d: { goalsScored: number }) => { return d})
      .attr('font-size', height *0.7)
      .attr('text-anchor', 'middle')
      .style('cursor', 'pointer')
      .on('click',  function(d: any){
        callTeam(d.srcElement.__data__)
      })
  }

  changeTeam(team: string) : void{
    this.selectedTeam = team
    this.buildBarChart()
  }

}
