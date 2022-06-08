import { HttpClient } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SEASONS_YEARS, YEARS } from 'src/assets/constants';
import { environment } from 'src/environments/environment';
import { TeamsService } from './teams.service';

const margin = {top: 20, right: 30, bottom: 40, left: 90},
    height = 400 - margin.top - margin.bottom;
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


  public setXScale() : void{
    const team = this.teams.getTeamByName('MTL').seasons
    const goals = team.map(function(d) { return d.goalsAgainst })
    console.log(goals)
    this.xScale = d3.scaleLinear()
    .domain([0, 13000])
    .range([ 0, this.width * 0.4 ]);
  }



  public getYScale(height: number) : void{
    this.yScale = d3.scaleBand()
    .domain(SEASONS_YEARS.reverse())
    .range([0, height])
  }

  private buildBarChart() : void{
    const svg = d3.select('#yAxis')
      .attr("width", 0.1 * this.width)
      .attr("height", height + margin.top + margin.bottom)
        
    this.buildYAxe(svg)
    this.setXScale()
    this.buildLeftChart()
    this.buildRightChart()
  }

  private buildYAxe(svg : any): void{
    const yAxe = this.getYScale(height)
    svg.append('g')
      .attr("transform",
          "translate(" + 0.075 * this.width + "," + margin.top + ")")
      .call(d3.axisLeft(this.yScale)
      .tickSizeInner(0)).select(".domain")
        .remove()
  }

  private buildLeftChart() : void {
    const svg = d3.select('#leftChart')
        .attr("width", 0.40 * this.width)
        .attr("height", height + margin.top + margin.bottom)
  }

  private buildRightChart() : void {
    const svg = d3.select('#rightChart')
        .attr("width", 0.40 * this.width)
        .attr("height", height + margin.top + margin.bottom)
  }  
}
