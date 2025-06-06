import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';
import { Reaction } from '../model/comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  reactions: Reaction[] = [];

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
  this.commentService.getAllComments().subscribe({
    next: (data) => {
      this.reactions = data;
      console.log('Loaded reactions:', this.reactions);  // <-- log here after data arrives
    },
    error: (err) => console.error('Failed to load comments', err)
  });
}


onReactionApproved(updatedReaction: Reaction): void {
  this.reactions = this.reactions.filter(r => r.id !== updatedReaction.id);
}

  onReactionDeleted(id: number) {
    this.reactions = this.reactions.filter(r => r.id !== id);
  }
}
