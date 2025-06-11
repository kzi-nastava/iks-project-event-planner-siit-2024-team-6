// chat-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { MessagesCenterComponent } from './messages-center/messages-center.component';

const routes: Routes = [
  { path: '', component: MessagesCenterComponent },
  { path: ':id', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
