import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { MessagesCenterComponent } from './messages-center/messages-center.component';
import { FormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';



@NgModule({
  declarations: [
    ChatComponent,
    MessagesCenterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
