import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BackToBackChartComponent } from './back-to-back-chart/back-to-back-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { UnivariateScatterPlotComponent } from './univariate-scatter-plot/univariate-scatter-plot.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LastPageComponent } from './last-page/last-page.component';

@NgModule({
  declarations: [		
    AppComponent,
    BackToBackChartComponent,
      StackedBarChartComponent,
      UnivariateScatterPlotComponent,
      LineChartComponent,
      MainPageComponent,
      LastPageComponent
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
