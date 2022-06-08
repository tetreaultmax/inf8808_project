import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { YEARS } from 'src/assets/constants';
import { environment } from 'src/environments/environment';
import { Team } from './team';

@Injectable({
  providedIn: 'root'
})
export class BackToBackService {

  constructor(private http: HttpClient) { 
    const teams = new Team('LAK')
    console.log(teams.seasons)
    //this.loadData()
  }

  private loadData() : void {
    const fileDirectory = '/assets/team_goal/team_goal_data_'
    for (const year of YEARS){
      this.http.get(environment.host + fileDirectory + year + '.csv', {responseType: 'text'})
                  .subscribe(data => console.log(data));
    }
  }
}
