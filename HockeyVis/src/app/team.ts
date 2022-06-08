import { YEARS } from 'src/assets/constants';
import { Season } from './season';


export class Team {
  seasons = new Array<Season>()
  name: string

  constructor (name: string) {
    this.name = name
    this.generateSeasons()
  }

  private generateSeasons() : void {
      for (const year of YEARS){
          const season: Season = {year: year, 
            goalsScored: 0,
            goalsAgainst: 0,
            points: 0, }
          this.seasons.push(season)
      }
  }

  public getName() : string {
    return this.name
  }

  public getSeasonByYear(year: number) : Season {
    return this.seasons[year - YEARS[0]]
  }


}