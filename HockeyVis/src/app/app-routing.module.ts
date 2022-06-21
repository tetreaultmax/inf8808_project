import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackToBackChartComponent } from './back-to-back-chart/back-to-back-chart.component';
import { SlopeChartComponent } from './slope-chart/slope-chart.component';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { UnivariateScatterPlotComponent } from './univariate-scatter-plot/univariate-scatter-plot.component';

const routes: Routes = [
  { path: 'backToBack', component: BackToBackChartComponent },
  { path: 'stackedBar', component: StackedBarChartComponent },
  { path: 'univariateScatter', component: UnivariateScatterPlotComponent },
  { path: 'slopeChart', component: SlopeChartComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
