import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { AiService } from './ai/ai.service';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [AiService, ChatGateway],
})
export class AppModule {}
