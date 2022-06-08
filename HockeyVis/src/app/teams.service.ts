import { Injectable } from '@angular/core';
import { TEAM_NAMES } from 'src/assets/constants';
import { Team } from './team';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private teams = new Array<Team>();

  constructor() {
    this.createTeams()
   }

   createTeams() :void{
     for (const teamName of TEAM_NAMES){
       const newTeam = new Team(teamName)
       this.teams.push(newTeam)
     }
   }

   getTeamByName(teamName: string) : Team {
    return this.teams[TEAM_NAMES.indexOf(teamName)]
   }
}
