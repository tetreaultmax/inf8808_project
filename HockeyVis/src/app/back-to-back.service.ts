import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { YEARS } from 'src/assets/constants';
import { environment } from 'src/environments/environment';
import { TeamsService } from './teams.service';

type teamSeason = {
  teamName: string;
  goalsScored: number;
  goalsAgainst: number;

}

@Injectable({
  providedIn: 'root'
})
export class BackToBackService {

  constructor(private http: HttpClient, private teams: TeamsService) { 
    this.loadData()
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
      const team = this.teams.getTeamByName(teamSeason[0])
      console.log(teamSeason[0])
      console.log(team.getSeasonByYear(year))
      
    }
  }
}
