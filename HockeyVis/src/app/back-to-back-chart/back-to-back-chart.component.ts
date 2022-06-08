import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BackToBackService } from '../back-to-back.service';

@Component({
  selector: 'app-back-to-back-chart',
  templateUrl: './back-to-back-chart.component.html',
  styleUrls: ['./back-to-back-chart.component.css'],
  providers: [BackToBackService]
})
export class BackToBackChartComponent implements OnInit {

  constructor(private backToBackService : BackToBackService) { 
  }

  ngOnInit(): void {
  }

}
