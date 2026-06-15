import { Controller, Get, Query, Post, Body, Inject } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly aiService: AiService) {}

  @Get('feed')
  getFeed(@Query('userId') userId: string) {
    // Return sample feeds demonstrating both posts & suggested reels with AI evaluation scores
    const samplePosts = [
      {
        id: 'p1',
        caption: 'Building the Instagram Clone of 2026! #nextgen #coding',
        mediaUrls: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'],
        postType: 'POST',
        author: {
          username: 'tech_creator',
          fullName: 'NextGen Engineer',
          profilePicUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          isVerified: true,
        },
        likesCount: 1420,
        commentsCount: 89,
        isLikedByMe: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'p2',
        caption: 'Neon vibes in the cyber city. 🌌🕶️ #tokyo #cyberpunk',
        mediaUrls: [
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
        ],
        postType: 'POST',
        author: {
          username: 'cyber_voyage',
          fullName: 'Neon Explorer',
          profilePicUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          isVerified: false,
        },
        likesCount: 840,
        commentsCount: 31,
        isLikedByMe: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    return {
      status: 'success',
      userId,
      data: samplePosts,
    };
  }

  @Get('reels')
  getReels(@Query('userId') userId: string) {
    // Sample reels sorted by our AiService reels rating logic
    const baseReels = [
      {
        id: 'r1',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-cyberpunk-setting-42289-large.mp4',
        caption: 'Synthesized waves and future visual beats! ⚡🔊',
        author: {
          username: 'cyber_tunes',
          fullName: 'Vibe Synth',
          profilePicUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
          isVerified: true,
        },
        metrics: { likeProb: 0.9, commentProb: 0.7, shareProb: 0.6, watchTimeRatio: 2.1, hoursSinceCreated: 4 },
      },
      {
        id: 'r2',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-beautiful-waterfall-in-a-forest-42416-large.mp4',
        caption: 'Escape to nature. 🌲🏞️ #nature #reels',
        author: {
          username: 'earth_wanderer',
          fullName: 'Nature Visuals',
          profilePicUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          isVerified: false,
        },
        metrics: { likeProb: 0.5, commentProb: 0.3, shareProb: 0.2, watchTimeRatio: 0.8, hoursSinceCreated: 24 },
      },
    ];

    // Compute scores using AI model
    const scored = baseReels.map((reel) => {
      const aiScore = this.aiService.scoreReel(reel.metrics);
      return {
        ...reel,
        aiRecommendationScore: aiScore,
      };
    });

    // Sort descending by calculated score
    scored.sort((a, b) => b.aiRecommendationScore - a.aiRecommendationScore);

    return {
      status: 'success',
      userId,
      data: scored,
    };
  }

  @Post('ai/creative')
  async createIdea(@Body() data: { topic: string }) {
    return this.aiService.generateCaptionPrompt(data.topic);
  }
}
