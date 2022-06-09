import { HttpClient, ɵHttpInterceptingHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    const g = this.createElements()     
    this.setXScale()
    this.setYScale()
    this.appendRectangles(g, '#leftChart')
    this.appendRectangles(g, '#rightChart')
    this.buildYAxe()
    this.buildXAxe()
    this.buildLeftChart()
    this.buildRightChart()
  }

  private setXScale() : void{
    const team = this.teams.getTeamByName('MTL').seasons
    const goals = team.map(function(d) { return Math.max(d.goalsAgainst, d.goalsScored)  }) as number[]
    this.xScale = d3.scaleLinear()
     .domain([0, d3.max(goals)! ])
     .range([ 0, this.width * 0.40 ]);
  }

  private setYScale() : void{
    this.yScale = d3.scaleBand()
    .domain(SEASONS_YEARS.reverse())
    .range([0, height])
  }

  private buildYAxe(): void{
    const svg = d3.select('.y.axis')
    svg.append('g')
      .attr("transform", "translate(" + this.width/2  + "," + 0 + ")")
      .call(d3.axisLeft(this.yScale)
      .tickSizeInner(0))
      .select(".domain")
      .remove()
  }

  private buildXAxe(): void{
    d3.select('.x.axis')
      .attr("width", this.width)
      .attr("height", 40)
  }

  private buildLeftChart() : void {
    const svg = d3.select('#leftChart')
        .attr("width", 0.40 * this.width)
        .attr("height", height)
    this.addLeftBands(svg)
  }

  private buildRightChart() : void {
    const svg = d3.select('#rightChart')
        .attr("width", 0.40 * this.width)
        .attr("height", height)
    this.addRightBands(svg)
  } 

  private appendRectangles(g : d3.Selection<SVGGElement, unknown, HTMLElement, any>, toSelect : string) : void{
    const team = this.teams.getTeamByName('MTL').seasons
    g.selectAll(toSelect)
      .data(team)
      .enter()
      .append('g')
      .append('rect')
  }
  
  private addLeftBands(svg : any) : void{
    const team = this.teams.getTeamByName('MTL').seasons

    const xPosition = (goals: number) : number => 0.40 * this.width - this.xScale(goals)

    // svg.selectAll('rect')
    //   .enter()
    //   .attr('y', xPosition(this.data))
    //   //.attr("width", (d: { goalsAgainst: d3.NumberValue; }) => { return this.xScale(d.goalsAgainst); })
    //   .attr("height", this.yScale.bandwidth() - 25)
    //   .attr('fill', 'red')
    //   .attr('opacity', 0.5)
  
    
  }

  private addRightBands(svg : any) : void{
    const team = this.teams.getTeamByName('MTL').seasons

    svg.selectAll('rect')
      .attr('x', 0)
      .attr('y',  (d: { year: number; }) => { return this.yScale(((d.year + '-' + (d.year + 1) ).toString()))})
      .attr('width', (d: { goalsScored: d3.NumberValue; }) => { return this.xScale(d.goalsScored); })
      .attr('height', this.yScale.bandwidth() - 25)
      .attr('fill', 'red')
  }

  private createElements() : d3.Selection<SVGGElement, unknown, HTMLElement, any> {
    const div = d3.select('#dataviz')
      .attr('width', this.width)
      .attr('height', height)
    const svg = div.append('svg').attr('class', 'bar-chart')
      .attr('width', this.width)
      .attr('height', height)
    const g = svg.append('g').attr('id', 'graph')
    g.append('g').attr('class', 'x axis')
    g.append('g').attr('class', 'y axis')
    g.append('g').attr('id', 'leftChart')
    g.append('g').attr('id', 'rightChart')
    return g
  }
}


function d(d: any): string | number | boolean | readonly (string | number)[] | d3.ValueFn<d3.EnterElement, unknown, string | number | boolean | readonly (string | number)[] | null> | null {
  throw new Error('Function not implemented.');
}
