// report.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportDTO, NewReportDTO } from '../dto/report-dtos';
import { PagedResponse } from '../shared/model/paged-response.model';

interface ReportsResponse {
  reports: ReportDTO[];
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = '/api/report';

  constructor(private http: HttpClient) {}

  getReports(page: number, size: number): Observable<PagedResponse<ReportDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<ReportDTO>>(this.baseUrl, { params });
  }

  approveReport(reportId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${reportId}/approve`, {});
  }

  rejectReport(reportId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reportId}`);
  }
  reportUser(newReport: NewReportDTO): Observable<ReportDTO> {
    return this.http.post<ReportDTO>(this.baseUrl, newReport);
  }
}
