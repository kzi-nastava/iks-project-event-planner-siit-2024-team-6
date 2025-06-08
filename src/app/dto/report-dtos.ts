export interface ReportDTO {
  id: number;
  reporterUsername: string;
  reportedUsername: string;
  reason: string;
}
export interface NewReportDTO {
  reason: string;
  reporterId: number;
  reportedId: number;
}
