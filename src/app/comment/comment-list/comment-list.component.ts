import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';
import { Reaction } from '../model/comment.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  reactions: Reaction[] = [];
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

  onReactionApproved(updatedReaction: Reaction): void {
    this.reactions = this.reactions.filter(r => r.id !== updatedReaction.id);
    this.totalCount--;
  }

  onReactionDeleted(id: number): void {
    this.reactions = this.reactions.filter(r => r.id !== id);
    this.totalCount--;
  }
}
