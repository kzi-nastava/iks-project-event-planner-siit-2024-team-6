import { Component, OnInit } from '@angular/core';
import { ReportDTO } from '../../dto/report-dtos';
import { ReportService } from '../report.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  reports: ReportDTO[] = [];
  totalCount = 0;
  pageSize = 5;
  currentPage = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.reports = response.reports;
        this.totalCount = response.totalCount;
      },
      error: (err) => {
        console.error('Failed to load reports', err);
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadReports();
  }

  onSuspendUser(report: ReportDTO) {
    this.reportService.approveReport(report.id).subscribe(() => {
      this.loadReports();
    });
  }

  onRejectReport(report: ReportDTO) {
    this.reportService.rejectReport(report.id).subscribe(() => {
      this.loadReports();
    });
  }
}
