# System Architecture - Instagram NextGen Clone (2026 Version)

This document details the high-level system architecture, microservice boundaries, data flow routes, and technical designs for the Instagram NextGen Clone.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    Client[Next.js 15 Client / App] -->|HTTPS REST/GraphQL| API_GW[NestJS API Gateway]
    Client -->|WebSockets WSS| Realtime_GW[Socket.io Realtime Gateway]
    Client -->|WebRTC Media| TURN[STUN/TURN Signaling]
    
    API_GW -->|GraphQL Resolvers| Core_Svc[Core NestJS Services]
    API_GW -->|Search Queries| ES[ElasticSearch Cluster]
    
    Realtime_GW -->|PubSub Sync| Redis_Cache[(Redis Cluster)]
    Realtime_GW -->|VoIP Signaling| TURN
    
    Core_Svc -->|Read/Write ORM| DB_Primary[(PostgreSQL Primary)]
    Core_Svc -->|Read Replica| DB_Replica[(PostgreSQL Replica)]
    Core_Svc -->|Upload Media| S3[AWS S3 Bucket] -->|Distribution| CF[CloudFront CDN]
    Core_Svc -->|Produce Events| Kafka[Kafka Event Stream]
    
    Kafka -->|Consume Events| AI_Svc[AI Recommendation Engine]
    Kafka -->|Queue Processing| BullMQ[BullMQ Scheduler]
    Kafka -->|Push Trigger| Notif_Svc[Push Notification Service]
    
    BullMQ -->|Bg Workers| Core_Svc
    AI_Svc -->|Cache User Embeddings| Redis_Cache
    Notif_Svc -->|Delivery| APNS_FCM[APNs / Firebase Cloud Messaging]
```

---

## 2. Microservice Boundaries

The system is split into specialized sub-modules to achieve target scalability of **100M+ Monthly Active Users** and **10M+ Concurrent Users**:

1. **Authentication Service**: Handled via JWT, OAuth2, Passkeys, and multi-device session mapping on Redis.
2. **Feed & Post Service**: Uses read-replica database pools to serve post requests in under 1s.
3. **Reels Engine**: Personalized scroll feed powered by collaborative filtering scores loaded into Redis.
4. **Chat & WebRTC Signaling Service**: State synchronization using Socket.io and Redis adapters, carrying WebRTC audio/video connections over TURN nodes.
5. **AI Moderation & Recommendation**: Asynchronous pipelines evaluating posts for NSFW metrics (using YOLOv8 models) and generating embeddings for similarity feeds.
6. **Notification Engine**: High-throughput Kafka pipeline broadcasting likes, comments, and live-streams within 50ms.

---

## 3. Real-Time Message Flow (1-to-1 DMs)

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Alice (Client A)
    participant SGW as Socket.io Gateway
    participant Redis as Redis Pub/Sub
    participant Kafka as Kafka Brokers
    actor Bob as Bob (Client B)
    
    Alice->>SGW: Send Message (Socket.emit)
    SGW->>Redis: Publish (channel: BobID)
    SGW->>Kafka: Publish Event "msg.created"
    Redis-->>SGW: Deliver to active connection for Bob
    SGW->>Bob: Emit Message (Socket.on)
    Bob->>SGW: Send Delivery Receipt
    SGW->>Alice: Emit Receipt Status
```

---

## 4. Key Performance Strategies

- **Video Preloading**: Reels vertical navigation fetches a sliding window of metadata (current + next 3 reels) to maintain <200ms start-up.
- **Edge Cache Optimization**: S3 images/videos are transformed by CloudFront media processors dynamically based on viewport.
- **Connection Multiplexing**: Redis Adapter keeps Socket.io active connections distributed across multiple Node.js scaling groups.
