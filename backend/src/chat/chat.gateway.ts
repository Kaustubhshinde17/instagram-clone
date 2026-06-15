import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private activeUsers = new Map<string, string>(); // Maps userId -> socketId

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, socket.id);
      this.logger.log(`User connected: ${userId} (Socket: ${socket.id})`);
    }
  }

  handleDisconnect(socket: Socket) {
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === socket.id) {
        this.activeUsers.delete(userId);
        this.logger.log(`User disconnected: ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() socket: Socket) {
    socket.join(data.roomId);
    this.logger.log(`Socket ${socket.id} joined room ${data.roomId}`);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    @MessageBody() data: { roomId: string; senderId: string; text: string },
    @ConnectedSocket() socket: Socket
  ) {
    this.logger.log(`Message in ${data.roomId} from ${data.senderId}: ${data.text}`);
    
    // Broadcast back to the room channel
    this.server.to(data.roomId).emit('new_message', {
      id: Math.random().toString(36).substr(2, 9),
      senderId: data.senderId,
      text: data.text,
      createdAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { roomId: string; userId: string; isTyping: boolean }
  ) {
    this.server.to(data.roomId).emit('user_typing', data);
  }

  // --- WebRTC Signaling Channels ---

  @SubscribeMessage('call_user')
  handleCallUser(
    @MessageBody() data: { targetUserId: string; callerId: string; offer: any }
  ) {
    const targetSocketId = this.activeUsers.get(data.targetUserId);
    if (targetSocketId) {
      this.logger.log(`Routing RTC Offer from ${data.callerId} to ${data.targetUserId}`);
      this.server.to(targetSocketId).emit('incoming_call', {
        callerId: data.callerId,
        offer: data.offer,
      });
    }
  }

  @SubscribeMessage('answer_call')
  handleAnswerCall(
    @MessageBody() data: { targetUserId: string; answer: any }
  ) {
    const targetSocketId = this.activeUsers.get(data.targetUserId);
    if (targetSocketId) {
      this.logger.log(`Routing RTC Answer to user ${data.targetUserId}`);
      this.server.to(targetSocketId).emit('call_answered', {
        answer: data.answer,
      });
    }
  }

  @SubscribeMessage('ice_candidate')
  handleIceCandidate(
    @MessageBody() data: { targetUserId: string; candidate: any }
  ) {
    const targetSocketId = this.activeUsers.get(data.targetUserId);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('new_ice_candidate', {
        candidate: data.candidate,
      });
    }
  }
}
