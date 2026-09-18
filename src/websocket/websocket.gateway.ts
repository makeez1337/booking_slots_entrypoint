import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://yourfrontend.com'], // Restrict origins for security
    credentials: true,
  },
  namespace: 'chat', // Organizes endpoints under /chat
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  // 1. Lifecycle Hook: Runs when the gateway initializes
  afterInit(server: Server) {
    console.log('Socket.io server initialized');
  }

  // 2. Lifecycle Hook: Runs when a client connects
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // You can read handshake headers or tokens here:
    // const token = client.handshake.auth.token;
  }

  // 3. Lifecycle Hook: Runs when a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 4. Room Management: Client joins a specific room channel
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket
  ): void {
    client.join(roomId);
    client.emit('joinedRoom', `You successfully joined room: ${roomId}`);

    // Notify other users in that specific room
    client.to(roomId).emit('userJoined', `User ${client.id} entered the room`);
  }

  // 5. Targeted Messaging: Send message only to a specific room
  @SubscribeMessage('sendMessageToRoom')
  handleMessageToRoom(
    @MessageBody() payload: { roomId: string; message: string },
    @ConnectedSocket() client: Socket
  ): void {
    // Broadcasts to everyone in the room EXCEPT the sender
    client.to(payload.roomId).emit('newMessage', {
      senderId: client.id,
      message: payload.message,
    });
  }

  sendGlobalNotification(message: string) {
    this.server.emit('globalAlert', { message });
  }
}
