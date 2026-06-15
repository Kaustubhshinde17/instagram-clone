# Database Schema Design - Instagram NextGen Clone (2026 Version)

To handle billions of records and maintain sub-second retrieval times, the database layer combines relational integrity (PostgreSQL) with key-value memory mapping (Redis) and schema-less document storage (MongoDB for rich media metadata).

---

## 1. PostgreSQL Relational Model

PostgreSQL stores transactional records: Users, Follows, Posts, Comments, Likes, Messages, and Calls.

```sql
-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    profile_pic_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    account_type VARCHAR(20) DEFAULT 'PERSONAL', -- PERSONAL, CREATOR, BUSINESS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Follows Table (Self-referential Many-to-Many)
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

-- Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    caption TEXT,
    location VARCHAR(150),
    media_urls TEXT[] NOT NULL, -- Supporting carousels
    post_type VARCHAR(10) DEFAULT 'POST', -- POST, REEL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Nested replies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Post Likes Table
CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

-- Stories Table (24-hour expiration handled by views & cron jobs)
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    music_meta JSONB,
    sticker_meta JSONB, -- Mentions, Polls, Questions
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notes Table (60-char status updates expiring in 24 hours)
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL, -- One note per user
    content VARCHAR(60) NOT NULL,
    music_meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);
```

---

## 2. Key Database Indices for Read Performance

```sql
-- Follow query optimization
CREATE INDEX idx_follows_following ON follows(following_id);

-- Post Feed chronological retrieval
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Real-time comment fetching per post
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at ASC);

-- Dynamic Story filtering (Non-expired stories)
CREATE INDEX idx_stories_user_expiry ON stories(user_id, expires_at) WHERE expires_at > CURRENT_TIMESTAMP;
```

---

## 3. MongoDB Media Metadata Schema (Optional metadata extensions)

For rich creator assets, YOLOv8 detections, and EXIF camera data:

```json
{
  "_id": "uuid_post_id",
  "media_specs": {
    "dimensions": { "width": 1080, "height": 1350 },
    "codec": "h264",
    "bitrate": "4500kbps",
    "file_size_bytes": 10485760
  },
  "yolo_moderation_score": {
    "nsfw": 0.002,
    "hate_speech": 0.0,
    "violence": 0.01
  },
  "camera_exif": {
    "aperture": "f/1.8",
    "iso": 100,
    "shutter_speed": "1/250s",
    "device_make": "Apple",
    "device_model": "iPhone 17 Pro"
  }
}
```

---

## 4. Redis Cache Key-Value Mappings

1. **User Active Sessions**: `user:session:<user_id>` -> JSON string of device fingerprints, access tokens.
2. **Reels Personalized Feed**: `feed:reels:<user_id>` -> Sorted Set (`ZSET`) containing scored reel IDs.
3. **Typing Indicators**: `chat:typing:<room_id>:<user_id>` -> Boolean (Expires in 3 seconds).
