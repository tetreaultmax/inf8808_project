import { Injectable } from '@angular/core';
import { TeamsService } from './teams.service';
import * as d3 from 'd3';
import { SEASONS_YEARS } from 'src/assets/constants';

@Injectable({
  providedIn: 'root'
})
export class ScaleService {

  constructor(private teams: TeamsService) { }

  public getXScale(width : number, selectedTeam: string) : d3.ScaleLinear<number, number, never>{
    return d3.scaleLinear()
     .domain([ 0, 350 ])
     .range([ 0, 0.95* width ]);
  }

  public getYScale(height: number) : d3.ScaleBand<string>{
    return d3.scaleBand()
    .domain(SEASONS_YEARS.reverse())
    .range([0, height])
    .paddingInner(0.2)
  }

  public getColorScale(selectedTeams :  Set<string>) : d3.ScaleOrdinal<string, unknown, never>{
    return d3.scaleOrdinal(d3.schemeDark2).domain(selectedTeams)
  }

  // public getLegendScale(selectedTeams : Set<string>, width : number) : d3.ScaleBand<string>{
  //   return d3.scaleBand().domain(selectedTeams).range([20, width])
  // }


}
