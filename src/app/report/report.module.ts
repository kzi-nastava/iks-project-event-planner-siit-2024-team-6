import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    ReportListComponent,
    ReportCardComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule
  ]
})
export class ReportModule { }
