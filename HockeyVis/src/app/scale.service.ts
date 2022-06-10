import { Injectable } from '@angular/core';
import { TeamsService } from './teams.service';
import * as d3 from 'd3';
import { SEASONS_YEARS } from 'src/assets/constants';

@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  constructor(private teams: TeamsService) { }

  public getXScale(width : number) : d3.ScaleLinear<number, number, never>{
    const team = this.teams.getTeamByName('MTL').seasons
    const goals = team.map(function(d) { return Math.max(d.goalsAgainst, d.goalsScored)  }) as number[]
    return d3.scaleLinear()
     .domain([0, d3.max(goals)! ])
     .range([ 0, width ]);
  }

  public getYScale(height: number) : d3.ScaleBand<string>{
    return d3.scaleBand()
    .domain(SEASONS_YEARS.reverse())
    .range([0, height])
    .paddingInner(0.2)
  }

  public getColorScale(selectedTeams : string[]) : d3.ScaleOrdinal<string, unknown, never>{
    return d3.scaleOrdinal(d3.schemeDark2).domain(selectedTeams)
  }

  public getLegendScale(selectedTeams : string[], width : number) : d3.ScaleBand<string>{
    return d3.scaleBand().domain(selectedTeams).range([20, width])
  }


}
