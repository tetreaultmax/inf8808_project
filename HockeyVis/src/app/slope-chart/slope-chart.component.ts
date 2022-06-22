import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-slope-chart',
  templateUrl: './slope-chart.component.html',
  styleUrls: ['./slope-chart.component.css']
})
export class SlopeChartComponent implements OnInit {

  constructor() { }
  ngOnInit() {
	const YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
	const allLeaders = this.loadData(YEARS)
  }

  loadData(YEARS: Number[]){
	var allLeaders: { name: string | undefined; points: Number; }[][] = []
	var allName: (string | undefined)[] = []
	YEARS.forEach(year =>{
		const path = "/assets/stats/stats_" + String(year)+".csv"
		var yearLeaders: { name: string | undefined; points: Number; }[] = []
		d3.csv(path).then(data =>{
			for (let i =0; i < 10; i++){
				const name = String(data[i]['Name'])
				const points = Number(data[i]['P'])
				yearLeaders.push({name: name, points: points})
			}
		})
		allLeaders.push(yearLeaders)
	})
	return allLeaders
  }

}
