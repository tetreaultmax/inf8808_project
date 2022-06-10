import { HttpClient, ɵHttpInterceptingHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {  YEARS } from 'src/assets/constants';
import { environment } from 'src/environments/environment';
import { ScaleService } from './scale.service';
import { TeamsService } from './teams.service';

const margin = {top: 20, right: 30, bottom: 40, left: 90},
    height = 600 - margin.top - margin.bottom;
@Injectable({
  providedIn: 'root'
})

export class BackToBackService {
  public width : number = window.innerWidth
  private chartWidth : number = 0.45 * this.width
  private yAxisWidth : number = 0.1 * this.width
  private legendHeight : number = 40
  private xAxisHeight : number = 30
  private selectedTeams : string[] = ['MTL', 'LAK']
  private xScale!: d3.ScaleLinear<number, number, never>
  private yScale!: d3.ScaleBand<string>
  private legendScale!: d3.ScaleBand<string>
  private colorScale!: d3.ScaleOrdinal<string, unknown, never>


  constructor(private http: HttpClient, private teams: TeamsService, private scale: ScaleService) { 
    this.setChart()
  }

  private setChart() : void{
    this.loadData()
    const buildBarChart = () => {
      this.buildBarChart()
    }
    setTimeout( buildBarChart, 500)
    

  }

  private loadData() : void {
    const fileDirectory = '/assets/team_goal/team_goal_data_'
    for (const year of YEARS){
      this.http.get(environment.host + fileDirectory + year.toString() + '.csv', {responseType: 'text'})
                  .subscribe(data => this.parseData(year, data));
    }
  }

  private parseData(year: number, data: string){
    const list = data.split('\n')
    for (const season of list.slice(1, list.length -1)){
      const teamSeason = season.split(',')
      const teamByYear = this.teams.getTeamByName(teamSeason[0]).getSeasonByYear(year)
      teamByYear.goalsScored = Number(teamSeason[1])
      teamByYear.goalsAgainst = Number(teamSeason[2])
    }
  }

  public buildBarChart() : void{   
    this.createElements()     
    this.xScale =  this.scale.getXScale(this.chartWidth)
    this.yScale =  this.scale.getYScale(height)
    this.legendScale = this.scale.getLegendScale(this.selectedTeams, this.width/2)
    this.colorScale = this.scale.getColorScale(this.selectedTeams)
    this.buildYAxe()
    this.buildXAxe()
    this.buildLegend()
    let counter = 0
    for (const team of this.selectedTeams) {
      this.appendRectangles('.leftChart', team)
      this.appendRectangles('.rightChart', team)
      this.buildLeftChart()
      this.buildRightChart()
      this.addRightBands(counter, team)//, this.xScale, this.yScale, this.colorScale, this.selectedTeams, this.chartWidth, this.legendWidth)
      this.addLeftBands(counter, team)//, this.xScale, this.yScale, this.colorScale, this.selectedTeams, this.chartWidth)
      // this.addNumber('.leftChart', counter)
      // this.addNumber('.rightChart', counter)
      counter ++
    }
  }

  //counter : number, team : string, xScale : any, yScale : any, colorScale : any, selectedTeams : string [], chartWidth : number

  private buildYAxe(): void{
    const svg = d3.select('.y.axis')
    .attr('width', this.yAxisWidth)
    .attr("transform", "translate(" + (this.chartWidth + this.yAxisWidth/2 + 3)  + "," + this.legendHeight + ")")
    svg.append('g')
      .call(d3.axisLeft(this.yScale)
      .tickSizeInner(0))
      .attr('text-anchor', 'middle')
      .attr('font-size', '15px')
      .select(".domain")
      .remove()
  }

  private buildLegend() : void{
    const legendScale = this.legendScale
    const colorScale = this.colorScale
    const legend = d3.select('.legend')
      .attr("width", this.width)
      .attr("height", this.legendHeight)
    
    legend.selectAll('.bar-chart')
      .data(this.selectedTeams)
      .enter()
      .append('g')
      .append('circle')
      .attr('fill', function(d: string): number{
        return colorScale(d) as number
      })
      .attr('r', 5)
      .attr('cx', function(d: string): number{
        return legendScale(d) as number
      })
      .attr('cy', this.legendHeight/2)

    legend.selectAll('.bar-chart')
      .data(this.selectedTeams)
      .enter()
      .append('text')
      .text(function(d: string): string{
        return d as string
      })
      .attr('x', function(d: string): number{
        return legendScale(d) as number + 20
      })
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
    const svg = d3.select('#leftChart')
        .attr("width", this.chartWidth)
        .attr("height", height)
    
  }

  private buildRightChart() : void {
    const svg = d3.select('#rightChart')
        .attr("width", this.chartWidth)
        .attr("height", height)
  } 

  private appendRectangles(toSelect : string, teamSelected : string) : void{
    const team = this.teams.getTeamByName(teamSelected).seasons
    const svg = d3.select(toSelect).selectAll('.bar-chart')
    const g = svg.data(team)
      .enter()
      .append('g')
    g.append('rect')
      .attr('class', teamSelected)
    g.append('text')
      .attr('class', teamSelected)
  }
  
  private addLeftBands(counter : number, team : string) : void{
    const g = d3.select('.leftChart') as any
    const offset = this.yScale.bandwidth()/this.selectedTeams.length * counter
    const color = this.colorScale(team)
    const sizeBar = 0.95 * this.yScale.bandwidth()/this.selectedTeams.length
    g.selectAll('rect.' + team)
      .attr("width", (d: { goalsAgainst: number }) => { return this.xScale(d.goalsAgainst); })
      .attr("height", sizeBar )
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + offset + this.legendHeight  })
      .attr('x', (d: { goalsAgainst: number }) => { return this.chartWidth - this.xScale(d.goalsAgainst); })
      .attr('fill', color)
      .on('mouseover',  function(d: any){
        d3.select(d.target).attr('height', sizeBar * 1.2)
          .attr('opacity', 0.5)
      })
      .on('mouseout',  function(d: any){
        d3.select(d.target).attr('height',sizeBar)
        .attr('opacity', 1)
      })
      
    
    g.selectAll('text.' + team)
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + offset + sizeBar -1 + this.legendHeight })
      .attr('x', (d: { goalsAgainst: number }) => { return this.chartWidth - this.xScale(d.goalsAgainst) + 5 ; })
      .attr('font-size', '11px')
      .attr('fill','white')
      .text((d: { goalsAgainst: number }) => { return d.goalsAgainst})
  }

  private addRightBands(counter : number, team : string) : void{
    const g = d3.select('.rightChart') as any
    const offset = this.yScale.bandwidth()/this.selectedTeams.length * counter
    const color = this.colorScale(team)
    const sizeBar = 0.95 * this.yScale.bandwidth()/this.selectedTeams.length
    g.selectAll('rect.' + team)
      .attr('x', this.chartWidth + this.yAxisWidth)
      .attr('y',  (d: { year: number; }) => { return this.yScale(((d.year + '-' + (d.year + 1) )))! + offset + this.legendHeight })
      .attr('width', (d: { goalsScored: d3.NumberValue; }) => { return this.xScale(d.goalsScored); })
      .attr('height', sizeBar)
      .attr('fill', color)
      .on('mouseover',  function(d: any){
        d3.select(d.target).attr('height', sizeBar * 1.2)
          .attr('opacity', 0.5)
      })
      .on('mouseout',  function(d: any){
        d3.select(d.target).attr('height',sizeBar)
        .attr('opacity', 1)
      })
    
    g.selectAll('text.' + team)
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + offset + sizeBar -2 + this.legendHeight })
      .attr('x', (d: { goalsScored: number }) => { return this.chartWidth + this.yAxisWidth + this.xScale(d.goalsScored) - 20; })
      .attr('font-size', '11px')
      .attr('fill','white')
      .text((d: { goalsScored: number }) => { return d.goalsScored})
  }


  private createElements() : void {
    const div = d3.select('#dataviz')
    const svg = div.append('svg').attr('class', 'bar-chart')
      .attr('width', this.width)
      .attr('height', height + this.legendHeight + this.xAxisHeight + 10)
    const g = svg.append('g').attr('id', 'graph')
    g.append('g').attr('class', 'legend')
    g.append('g').attr('class', 'x axis')
    g.append('g').attr('class', 'y axis')
    g.append('g').attr('class', 'leftChart')
    g.append('g').attr('class', 'rightChart')
  }
}
