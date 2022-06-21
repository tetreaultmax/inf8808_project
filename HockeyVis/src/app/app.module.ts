import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackToBackChartComponent } from './back-to-back-chart/back-to-back-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { UnivariateScatterPlotComponent } from './univariate-scatter-plot/univariate-scatter-plot.component';
import { SlopeChartComponent } from './slope-chart/slope-chart.component';

@NgModule({
  declarations: [		
    AppComponent,
    BackToBackChartComponent,
      StackedBarChartComponent,
      UnivariateScatterPlotComponent,
      SlopeChartComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
