import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BackToBackChartComponent } from './back-to-back-chart/back-to-back-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { UnivariateScatterPlotComponent } from './univariate-scatter-plot/univariate-scatter-plot.component';
import { SlopeChartComponent } from './slope-chart/slope-chart.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [	
    AppComponent,
    BackToBackChartComponent,
      StackedBarChartComponent,
      UnivariateScatterPlotComponent,
      SlopeChartComponent,
      MainPageComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
