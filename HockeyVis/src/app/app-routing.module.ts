import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackToBackChartComponent } from './back-to-back-chart/back-to-back-chart.component';
import { ChordComponent } from './chord/chord.component';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';

const routes: Routes = [
  { path: 'backToBack', component: BackToBackChartComponent },
  { path: 'stackedBar', component: StackedBarChartComponent },
  { path: 'chord', component: ChordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
