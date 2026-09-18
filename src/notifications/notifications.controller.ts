import {Controller, Post} from "@nestjs/common";
import {ChatGateway} from "../websocket/websocket.gateway";

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Post('notification')
  sendWebsocketNotification() {
   this.chatGateway.sendGlobalNotification('Hello everyone!')
  }
}