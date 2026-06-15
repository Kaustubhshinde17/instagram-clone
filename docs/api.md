# API Documentation & GraphQL Schema - Instagram NextGen Clone (2026 Version)

The system leverages a hybrid approach: **REST APIs** for media uploads and authentication, **GraphQL** for client queries and feeds, and **Socket.io** for real-time signaling, messaging, and presence indicators.

---

## 1. REST Endpoints (Authentication & Media Management)

### Authentication
- `POST /auth/register`: Create user profile.
- `POST /auth/login`: Issue JWT token pair.
- `POST /auth/oauth/google`: Google OAuth verification.

### Media CDN Uploads
- `POST /media/upload/presign`: Request CloudFront/S3 signed upload URL.
  - **Body**: `{ "filename": "reel.mp4", "contentType": "video/mp4" }`
  - **Response**: `{ "uploadUrl": "https://s3.aws.com/...", "mediaUrl": "https://cdn.clone.com/..." }`

---

## 2. GraphQL Schema Spec

### Type Definitions
```graphql
type User {
  id: ID!
  username: String!
  fullName: String
  profilePicUrl: String
  isVerified: Boolean!
  accountType: String!
  followersCount: Int!
  followingCount: Int!
}

type Post {
  id: ID!
  caption: String
  location: String
  mediaUrls: [String!]!
  postType: String!
  author: User!
  likesCount: Int!
  commentsCount: Int!
  isLikedByMe: Boolean!
  createdAt: String!
}

type Query {
  getHomeFeed(cursor: String, limit: Int): [Post!]!
  getUserProfile(username: String!): User!
  searchContent(query: String!): [Post!]!
}

type Mutation {
  createPost(caption: String!, mediaUrls: [String!]!, postType: String!): Post!
  toggleLikePost(postId: ID!): Boolean!
  addComment(postId: ID!, content: String!): Boolean!
}
```

---

## 3. Real-Time Socket.io Events

Socket connection endpoint: `wss://api.instagramclone.com/realtime`

### Client-to-Server Events
- `join_room`: `{ "roomId": "chat_room_uuid" }`
- `send_message`: `{ "roomId": "chat_room_uuid", "text": "Hello", "type": "TEXT" }`
- `typing`: `{ "roomId": "chat_room_uuid", "isTyping": true }`
- `call_user`: `{ "targetUserId": "uuid", "offer": RTCSessionDescriptionInit }`
- `answer_call`: `{ "targetUserId": "uuid", "answer": RTCSessionDescriptionInit }`
- `ice_candidate`: `{ "targetUserId": "uuid", "candidate": RTCIceCandidate }`

### Server-to-Client Events
- `new_message`: `{ "id": "msg_uuid", "senderId": "uuid", "text": "Hello", "createdAt": "2026-06-15..." }`
- `user_typing`: `{ "roomId": "chat_room_uuid", "userId": "uuid", "isTyping": true }`
- `incoming_call`: `{ "callerId": "uuid", "offer": RTCSessionDescriptionInit }`
- `call_answered`: `{ "answer": RTCSessionDescriptionInit }`
- `new_ice_candidate`: `{ "candidate": RTCIceCandidate }`
- `notification`: `{ "id": "notif_uuid", "title": "John liked your photo", "type": "LIKE", "link": "/p/..." }`
