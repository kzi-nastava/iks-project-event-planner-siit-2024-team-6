import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    CommentListComponent,
    CommentCardComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule
  ]
})
export class CommentModule { }
