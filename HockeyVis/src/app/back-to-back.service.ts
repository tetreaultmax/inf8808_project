import { HttpClient } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SEASONS_YEARS, YEARS } from 'src/assets/constants';
import { environment } from 'src/environments/environment';
import { TeamsService } from './teams.service';

const margin = {top: 20, right: 30, bottom: 40, left: 90},
    height = 600 - margin.top - margin.bottom;
@Injectable({
  providedIn: 'root'
})

export class BackToBackService {
  public width : number = window.innerWidth
  private xScale!: d3.ScaleLinear<number, number, never>
  private yScale!: d3.ScaleBand<string>


  constructor(private http: HttpClient, private teams: TeamsService) { 
    this.setChart()
  }

  private setChart() : void{
    this.loadData()
    const buildBarChart = () => {
      this.buildBarChart()
    }
    setTimeout( buildBarChart, 200)
    

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
    const svg = d3.select('#yAxis')
      .attr("width", 0.1 * this.width)
      .attr("height", height + margin.top + margin.bottom)
        
    this.setXScale()
    this.setYScale()
    this.buildYAxe(svg)
    this.buildLeftChart()
    this.buildRightChart()
  }

  private setXScale() : void{
    const team = this.teams.getTeamByName('MTL').seasons
    const goals = team.map(function(d) { return Math.max(d.goalsAgainst, d.goalsScored)  }) as number[]
    this.xScale = d3.scaleLinear()
     .domain([0, d3.max(goals)! ])
     .range([ 0, this.width * 0.4 ]);
  }

  private setYScale() : void{
    this.yScale = d3.scaleBand()
    .domain(SEASONS_YEARS.reverse())
    .range([0, height])
  }

  private buildYAxe(svg : any): void{
    svg.append('g')
      .attr("transform",
          "translate(" + 0.075 * this.width + "," + margin.top + ")")
      .call(d3.axisLeft(this.yScale)
      .tickSizeInner(0)).select(".domain")
        .remove()
  }

  private buildLeftChart() : void {
    const svg = d3.select('#leftChart')
    .attr("transform",
          "translate(" + 0 + "," + margin.top + ")")
        .attr("width", 0.40 * this.width)
        .attr("height", height + margin.top + margin.bottom)
    this.addLeftBands(svg)
  }

  private buildRightChart() : void {
    const svg = d3.select('#rightChart')
        .attr("transform",
          "translate(" + 0 + "," + margin.top + ")")
        .attr("width", 0.40 * this.width)
        .attr("height", height + margin.top + margin.bottom)
    this.addRightBands(svg)
  } 
  
  private addLeftBands(svg : any) : void{
    const team = this.teams.getTeamByName('MTL').seasons
    console.log(team)

    svg.selectAll('rect')
      .data(team)
      .enter()
      .append('rect')
      .attr('x', (d: { goalsAgainst: d3.NumberValue; }) => { return 0.40 * this.width - this.xScale(d.goalsAgainst); })
      .attr('y',  (d: { year: number; }) => { return this.yScale(((d.year + '-' + (d.year + 1) ).toString()))})
      .attr("width", (d: { goalsAgainst: d3.NumberValue; }) => { return this.xScale(d.goalsAgainst); })
      .attr("height", this.yScale.bandwidth() - 25)
      .attr('fill', 'red')
      .attr('opacity', 0.5)

  }

  private addRightBands(svg : any) : void{
    const team = this.teams.getTeamByName('MTL').seasons
    console.log(team)

    svg.selectAll('rect')
      .data(team)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y',  (d: { year: number; }) => { return this.yScale(((d.year + '-' + (d.year + 1) ).toString()))})
      .attr("width", (d: { goalsScored: d3.NumberValue; }) => { return this.xScale(d.goalsScored); })
      .attr("height", this.yScale.bandwidth() - 25)
      .attr('fill', 'red')

  }
}
