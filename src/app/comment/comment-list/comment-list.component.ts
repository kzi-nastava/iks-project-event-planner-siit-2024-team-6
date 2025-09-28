import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';
import { ReactionDTO } from '../../dto/reaction-dtos';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  reactions: ReactionDTO[] = [];
  pageSize = 5;
  currentPage = 0;
  totalCount = 0;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getPendingComments(this.currentPage, this.pageSize).subscribe({
      next: (pageData) => {
        this.reactions = pageData.content;
        this.totalCount = pageData.totalElements;
      },
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadComments();
  }

  onReactionApproved(updatedReaction: ReactionDTO): void {
    this.reactions = this.reactions.filter(r => r.id !== updatedReaction.id);
    this.totalCount--;
  }

  onReactionDeleted(id: number): void {
    this.reactions = this.reactions.filter(r => r.id !== id);
    this.totalCount--;
  }
}
