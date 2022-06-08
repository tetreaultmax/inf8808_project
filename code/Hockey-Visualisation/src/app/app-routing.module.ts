import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackToBackChartComponent } from './back-to-back-chart/back-to-back-chart.component';

const routes: Routes = [
  { path: 'backToBackChart', component: BackToBackChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
