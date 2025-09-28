import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReactionDTO } from '../dto/reaction-dtos';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/reactions';

  constructor(private http: HttpClient) {}

 getPendingComments(page: number, size: number): Observable<any> {
  return this.http.get<any>(`/api/reactions/pending?page=${page}&size=${size}`);
}

  updateCommentStatus(id: number, status: 'approved' | 'deleted'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  acceptComment(id: number): Observable<ReactionDTO> {
    return this.http.put<ReactionDTO>(`${this.apiUrl}/${id}/accept`, {});
  }
}
