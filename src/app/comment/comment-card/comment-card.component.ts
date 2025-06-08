import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Reaction } from '../model/comment.model';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css'],
})
export class CommentCardComponent {
  @Input() reaction!: Reaction;
  @Output() reactionUpdated = new EventEmitter<Reaction>();
  @Output() reactionDeleted = new EventEmitter<number>();

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private commentService: CommentService
  ) {}

  approveComment(): void {
  if (!this.reaction.id) return;

  this.commentService.acceptComment(this.reaction.id).subscribe({
    next: (updated) => {
      const updatedReaction = { ...this.reaction, status: 'ACCEPTED' };
      this.reactionUpdated.emit(updatedReaction);
      this.snackBar.open('Reaction approved.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
      });
    },
    error: () => {
      this.snackBar.open('Failed to approve reaction.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
      });
    }
  });
}


  deleteComment(): void {
    if (!this.reaction.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { question: 'Are you sure you want to delete this reaction?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.deleteComment(this.reaction.id).subscribe({
          next: () => {
            this.reactionDeleted.emit(this.reaction.id!);
            this.snackBar.open('Reaction deleted.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            });
          },
          error: () => {
            this.snackBar.open('Failed to delete reaction.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            });
          }
        });
      }
    });
  }
}
