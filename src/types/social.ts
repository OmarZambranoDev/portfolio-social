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

export interface Follow {
  followerId: string;
  followingId: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon: React.ReactNode;
  _type: 'like' | 'comment' | 'follow';
  _fromUserId: string;
  _postId?: string;
}
