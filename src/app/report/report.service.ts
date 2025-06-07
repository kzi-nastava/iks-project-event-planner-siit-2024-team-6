// report.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportDTO } from '../dto/report-dtos';

interface ReportsResponse {
  reports: ReportDTO[];
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = '/api/report';

  constructor(private http: HttpClient) {}

  getReports(page: number, size: number): Observable<ReportsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ReportsResponse>(this.baseUrl, { params });
  }

  approveReport(reportId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${reportId}/approve`, {});
  }

  rejectReport(reportId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reportId}`);
  }
}
