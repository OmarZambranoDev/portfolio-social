export interface User {
  id: string;
  name: string;
  bio: string;
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  likes: string[];
  comments: Comment[];
}

export interface Friendship {
  userId: string;
  friendId: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon: React.ReactNode;
  // App-specific metadata (not passed to UI library)
  _type: 'like' | 'comment' | 'friend_request';
  _fromUserId: string;
  _postId?: string;
}
