import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentCardComponent } from './comment-card/comment-card.component';



@NgModule({
  declarations: [
    CommentListComponent,
    CommentCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CommentModule { }
