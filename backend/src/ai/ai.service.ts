import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  /**
   * Evaluates post/reel content safety against computer-vision models.
   * Mock YOLOv8/OpenAI filters.
   */
  async moderateContent(imageUrl: string): Promise<{ isSafe: boolean; categories: Record<string, number> }> {
    this.logger.log(`Performing AI Moderation check for: ${imageUrl}`);
    
    // Simulate model inference delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Mock safety thresholds
    const isSafe = !imageUrl.includes('nsfw') && !imageUrl.includes('violence');
    return {
      isSafe,
      categories: {
        nsfw: imageUrl.includes('nsfw') ? 0.95 : 0.01,
        violence: imageUrl.includes('violence') ? 0.88 : 0.02,
        spam: 0.05,
      },
    };
  }

  /**
   * Implements the Reels Ranking Algorithm specified in algorithms.md:
   * Score = w1*LikeProb + w2*CommentProb + w3*ShareProb + w4*WatchRatio - w5*Recency
   */
  scoreReel(weights: {
    likeProb: number;
    commentProb: number;
    shareProb: number;
    watchTimeRatio: number;
    hoursSinceCreated: number;
  }): number {
    const w1 = 0.25; // Like weight
    const w2 = 0.20; // Comment weight
    const w3 = 0.15; // Share weight
    const w4 = 0.30; // Watch ratio weight (heaviest weighting factor)
    const w5 = 0.10; // Recency penalty weight

    const recencyPenalty = w5 * Math.log(Math.max(1, weights.hoursSinceCreated));
    const score =
      w1 * weights.likeProb +
      w2 * weights.commentProb +
      w3 * weights.shareProb +
      w4 * Math.min(3.0, weights.watchTimeRatio) -
      recencyPenalty;

    return parseFloat(score.toFixed(4));
  }

  /**
   * Auto-generates captions and hashtags for professional/creator tools
   */
  async generateCaptionPrompt(topic: string): Promise<{ caption: string; hashtags: string[] }> {
    this.logger.log(`Generating AI content idea for topic: ${topic}`);
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      caption: `Unlocking the future of ${topic}! Reimagined, redesigned, and rebuilt. 🚀✨`,
      hashtags: ['nextgen', topic.toLowerCase().replace(/\s+/g, ''), '2026', 'creators'],
    };
  }
}
