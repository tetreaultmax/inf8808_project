import { HttpClient, ɵHttpInterceptingHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SEASONS_YEARS, YEARS } from 'src/assets/constants';
import { environment } from 'src/environments/environment';
import { TeamsService } from './teams.service';

const margin = {top: 20, right: 30, bottom: 40, left: 90},
    height = 700 - margin.top - margin.bottom;
@Injectable({
  providedIn: 'root'
})

export class BackToBackService {
  public width : number = window.innerWidth
  public chartWidth : number = 0.45 * this.width
  public legendWidth : number = 0.1 * this.width
  public selectedTeams : string[] = ['MTL', 'LAK', 'SJS']
  private xScale!: d3.ScaleLinear<number, number, never>
  private yScale!: d3.ScaleBand<string>
  private colorScale!: d3.ScaleOrdinal<string, unknown, never>


  constructor(private http: HttpClient, private teams: TeamsService) { 
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
    this.setXScale()
    this.setYScale()
    this.setColorScale()
    this.buildYAxe()
    this.buildXAxe()
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

  private setXScale() : void{
    const team = this.teams.getTeamByName('MTL').seasons
    const goals = team.map(function(d) { return Math.max(d.goalsAgainst, d.goalsScored)  }) as number[]
    this.xScale = d3.scaleLinear()
     .domain([0, d3.max(goals)! ])
     .range([ 0, this.chartWidth ]);
  }

  private setYScale() : void{
    this.yScale = d3.scaleBand()
    .domain(SEASONS_YEARS.reverse())
    .range([0, height])
    .paddingInner(0.2)
  }

  private setColorScale() : void{
    this.colorScale = d3.scaleOrdinal(d3.schemeDark2).domain(this.selectedTeams)
  }

  private buildYAxe(): void{
    const svg = d3.select('.y.axis')
    .attr('width', this.legendWidth)
    .attr("transform", "translate(" + (this.chartWidth + this.legendWidth/2 + 3)  + "," + 0 + ")")
    svg.append('g')
      .call(d3.axisLeft(this.yScale)
      .tickSizeInner(0))
      .attr('text-anchor', 'middle')
      .attr('font-size', '15px')
      .select(".domain")
      .remove()
  }

  private buildXAxe(): void{
    const svg = d3.select('.x.axis')
      .attr("width", this.width)
      .attr("height", 40)
    svg.append('text')
      .attr("transform", "translate(" + 0 + "," + (height + 30)  + ")")
      .text('Buts encaissés')
      .attr('font-size', 30)
    svg.append('text')
      .attr("transform", "translate(" + (this.width - margin.right) + "," + (height + 30)  + ")")
      .style('text-anchor', 'end')
      .text('Buts marqués')
      .attr('font-size', 30)
    svg.append('text')
      .attr("transform", "translate(" + (this.width/2) + "," + (height + 30)  + ")")
      .style('text-anchor', 'middle')
      .text('Saison')
      .attr('font-size', 30)
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
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + offset })
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
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + offset + sizeBar -1})
      .attr('x', (d: { goalsAgainst: number }) => { return this.chartWidth - this.xScale(d.goalsAgainst) + 5; })
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
      .attr('x', this.chartWidth + this.legendWidth)
      .attr('y',  (d: { year: number; }) => { return this.yScale(((d.year + '-' + (d.year + 1) )))! + offset })
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
      .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + offset + sizeBar -2 })
      .attr('x', (d: { goalsScored: number }) => { return this.chartWidth + this.legendWidth + this.xScale(d.goalsScored) - 20; })
      .attr('font-size', '11px')
      .attr('fill','white')
      .text((d: { goalsAgainst: number }) => { return d.goalsAgainst})
      
    
  }

  // private addNumber(toSelect : string, counter : number){
  //   const g = d3.select(toSelect) as any
  //   const offset = this.yScale.bandwidth()/this.selectedTeams.length * counter
  //   g.selectAll('text')
  //     .attr('y', (d: { year: number }) => { return this.yScale(d.year + '-' + (d.year + 1))! + offset })
  //     .attr('x', (d: { goalsAgainst: number }) => { return this.chartWidth - this.xScale(d.goalsAgainst); })
  //     .text('allo')

  // }

  private createElements() : void {
    const div = d3.select('#dataviz')
      .attr('width', this.width)
      .attr('height', height)
    const svg = div.append('svg').attr('class', 'bar-chart')
      .attr('width', this.width)
      .attr('height', height + 50)
    const g = svg.append('g').attr('id', 'graph')
    g.append('g').attr('class', 'x axis')
    g.append('g').attr('class', 'y axis')
    g.append('g').attr('class', 'leftChart')
    g.append('g').attr('class', 'rightChart')
  }
}

// function addLeftBands(counter : number, team : string, xScale : any, yScale : any, colorScale : any, selectedTeams : string [], chartWidth : number){
//   const g = d3.select('.leftChart') as any
//   const offset = yScale.bandwidth()/selectedTeams.length * counter
//   const color = colorScale(team)
//   g.selectAll('rect.' + team)
//     .transition()
//     .duration(500)
//     .attr("width", (d: { goalsAgainst: number }) => { return xScale(d.goalsAgainst); })
//     .attr("height", 0.7 * yScale.bandwidth()/selectedTeams.length)
//     .attr('y', (d: { year: number }) => { return yScale(d.year + '-' + (d.year + 1))! + offset })
//     .attr('x', (d: { goalsAgainst: number }) => { return chartWidth - xScale(d.goalsAgainst); })
//     .attr('fill', color)
//     .attr('opacity', '0.5')
// }

// function addRightBands(counter : number, team : string, xScale : any, yScale : any, colorScale : any, selectedTeams : string [], chartWidth : number, legendWidth : number) {
//   const g = d3.select('.rightChart') as any
//   const offset = yScale.bandwidth()/selectedTeams.length * counter
//   const color = colorScale(team)
//   g.selectAll('rect.' + team)
//     .transition()
//     .duration(500)
//     .attr('x', chartWidth + legendWidth)
//     .attr('y', (d: { year: number; }) => { return yScale(((d.year + '-' + (d.year + 1) ).toString()))! + offset })
//     .attr('width', (d: { goalsScored: d3.NumberValue; }) => { return xScale(d.goalsScored); })
//     .attr('height', 0.7 * yScale.bandwidth()/selectedTeams.length)
//     .attr('fill', color)
//     // .on('mouseover',  function(d: any){
//     //   d3.select(d.target).attr('opacity', '0.5')
//     // })
//   }
