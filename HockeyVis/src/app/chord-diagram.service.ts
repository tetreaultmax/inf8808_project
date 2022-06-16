import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { environment } from 'src/environments/environment';
import { ScaleService } from './scale.service';

@Injectable({
  providedIn: 'root'
})
export class ChordDiagramService {
  private numberPlayers = 5
  private matrix = Array(this.numberPlayers).fill(0).map(()=>Array(this.numberPlayers).fill(0)) as number[][]
  private players = new Array<string>()

  constructor(private http: HttpClient, private scaleService: ScaleService) {}

  public display(year : string, team : string, width: number, height: number, legendHeight: number){
    const g =  d3.select('#panel')
      .style('visibility', 'visible')
      .append('g')

    g.append('rect')
      .attr('width', width*0.8)
      .attr('height', height + legendHeight)
      .attr('x', width*0.1)
      .attr('y', legendHeight)
      .attr('opacity', 0.97)
      .attr('fill', 'white')
      .attr('stroke', 'black')
    
      this.buildDisplay(g, width, height, legendHeight, year, team)
  }

  private buildDisplay(g: any, width : number, height: number, legendHeight: number, year : string, team: string){
    this.players = new Array<string>()
    this.buildCloseWindow(g, width*0.9 - 90, legendHeight + 20)
    this.loadData(year, team)
    this.buildErrorMessage(width, height)
    this.buildTitle(team, width, height + legendHeight, year)
    const buildDiagram = () => {
      this.createDiagram(width, height)
    }
    setTimeout( buildDiagram, 100)
  }

  private buildTitle(team : string, width : number, height : number, year : string){
    d3.select('#panel').select('g')
      .append('text')
      .text('Allo')
      .attr('x', width/2)
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .attr('font-size', 25)
      .text('Collaboration entre les meilleurs marqueurs de ' + team + ' durant la saison ' + year + '.')

  }

  private buildCloseWindow(g : d3.Selection<SVGGElement, unknown, HTMLElement, any>, x : number, y:number ){
    const closeWindow = () : void => this.closeWindow() 
    g.append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('font-size', 20)
    .text('FERMER')
    .on('click', function(d: any){
      closeWindow()
    })
  }

  private closeWindow(){
    d3.select('#panel').selectAll('*').remove()
  }

  private loadData(year: string, team :string){
    const fileDirectory = '/assets/points/' + year.slice(0,4) + '/'
    this.http.get(environment.host + fileDirectory + team + '.csv', {responseType: 'text'})
      .subscribe(data => this.parseData(data),
      () => this.handleError())
      
  }

  private handleError(){
    d3.select('#panel').selectAll('*').attr('visibility', 'hidden')
    d3.select('#error').attr('visibility', 'visible')
    d3.select('#panel').select('rect').style('visibility', 'visible')
    d3.select('#panel').select('text').style('visibility', 'visible')
    
  }

  private buildErrorMessage(width: number, height: number){
    d3.select('#panel').select('g').append('text')
      .text('Données non disponibles')
      .attr('id', 'error')
      .attr("transform", "translate(" + width/2  + "," + 0.55 * height + ")")
      .attr('visibility', 'hidden')
      .attr('text-anchor', 'middle')
      .attr('font-size', '30px')

  }

  private parseData(data: string) : void{
    const list = data.split('\n')
    let counter : number = 0
    for (const players of list.slice(1, list.length -1)){
      const points = players.split(',')
      const playerName = points[0].split(' ', 2)[1]
      const newRow = points.slice(1, this.numberPlayers + 1).map(function(item){ return parseInt(item)})
      this.players.push(playerName)
      this.matrix[counter] = newRow
      if (++ counter === this.numberPlayers) return      
    }
  }


  private createDiagram(width: number, height: number){
    const res = this.createRes()
    const arc = this.createArc()
    const svg = d3.select('#panel').select('g')
    const g = this.createGGroup(svg, res)
    this.appendPath(g, width, height, arc)
    this.appendText(g, arc)
    this.buildRibbons(svg, res, width, height)
  }

  private buildRibbons(svg: any, res:any, width: number, height: number){
    const colorScale = this.scaleService.getColorScale(this.players) 
    const players = this.players
    svg.datum(res)
    .append("g")
    .selectAll("path")
    .data(function(d : any) { return d; })
    .enter()
    .append("path")
    .attr("transform", "translate(" + width/2  + "," + 0.55 * height + ")")
      .attr("d", d3.ribbon()
        .radius(200) as any
      )
      .style("fill", function(d : any){ 
        return colorScale(players[d.target.index]) as number })
      .attr('opacity', 0.8)
      .style("stroke", "black");
  }

  private appendPath(g: any, width : number, height:number, arc : any){
    const colorScale = this.scaleService.getColorScale(this.players) 
    const players = this.players
    g.append('path')
      .attr("transform", "translate(" + width/2  + "," + 0.55 * height + ")")
      .style('alignment-baseline', 'baseline')
      .style('fill', function(d : any,i : any){
        return colorScale(players[i]) as number})
      .attr('id', function(d : any,i : any){
          return i
        })
      .style('stroke', 'black')
      .attr('d', arc)
  }

  private appendText(g:any, arc:any) {
    const players = this.players
    g.append('text')
      .attr("x", 6)
      .attr("dy", 15)
      .append('textPath')
      .attr('xlink:href', function(d : any,i : any){
        return '#' + i
      })
      .attr('d', arc)
      .text((function(d: any,i: any){
        return (players[i].length < d.value*3) ? players[i] : ''
      }))

  }

  private createGGroup(svg: any, res: any){
      return svg.datum(res)
      .append('g')
      .selectAll('g')
      .data(function(d : any) { return d.groups; })
      .enter()
      .append('g')
    }

  private createArc() {
    return d3.arc()
      .innerRadius(210)
      .outerRadius(240) as any
  }

  private createRes() {
    return d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)
      (this.matrix)
  }
  
}
