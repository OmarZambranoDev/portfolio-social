import { create } from 'zustand';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { User, Post, Friendship, Notification, Comment } from '../types/social';
import { generateAllData } from '../data/mockData';

interface SocialStore {
  // Data
  users: Record<string, User>;
  posts: Post[];
  friendships: Friendship[];
  currentUserId: string;

  // UI state
  activeTab: 'feed' | 'friends';
  viewedUserId: string | null;
  searchQuery: string;
  searchResults: User[];
  isLoadingMore: boolean;
  hasMorePosts: boolean;
  displayedPostsCount: number;
  scrollTargetPostId: string | null;

  // Notification state
  notifications: Notification[];

  // Computed
  getCurrentUser: () => User;
  getUserById: (id: string) => User | undefined;
  getFriendsForUser: (userId: string) => User[];
  getMutualFriends: (userId: string) => User[];
  getMutualFriendCount: (userId: string) => number;
  getPostsForUser: (userId: string) => Post[];
  getFeedPosts: () => Post[];
  hasLiked: (postId: string) => boolean;
  unreadCount: () => number;
  getUINotifications: () => {
    id: string;
    message: string;
    timestamp: number;
    read: boolean;
    icon: React.ReactNode;
  }[];

  // Post actions
  createPost: (content: string, userId?: string) => void;
  toggleLike: (postId: string, userId?: string) => void;
  addComment: (postId: string, content: string, userId?: string) => void;

  // Friend actions
  addFriend: (userId: string) => void;
  removeFriend: (userId: string) => void;

  // Feed actions
  loadMorePosts: () => void;
  scrollToPost: (postId: string) => void;
  clearScrollTarget: () => void;

  // Profile actions
  updateBio: (bio: string) => void;

  // Navigation
  setActiveTab: (tab: 'feed' | 'friends') => void;
  viewProfile: (userId: string | null) => void;
  setSearchQuery: (query: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  generateNotification: (
    type: 'like' | 'comment' | 'friend_request',
    fromUserId: string,
    postId?: string
  ) => void;
  handleNotificationClick: (notification: { id: string }) => void;

  // Simulation actions
  generateRandomPost: () => void;
  generateRandomComment: () => void;
  generateRandomLike: () => void;
  generateRandomFriendAdd: () => void;
}

const POSTS_PER_PAGE = 10;

// Initialize data
const {
  users: initialUsers,
  friendships: initialFriendships,
  posts: initialPosts,
} = generateAllData();
const usersRecord: Record<string, User> = {};
initialUsers.forEach((u) => {
  usersRecord[u.id] = u;
});

const MOCK_CONTENT_SIM = [
  'Just deployed a new feature. The CI/CD pipeline is singing.',
  "Coffee number 3. Let's ship this thing.",
  'Reading about the new React 19 features. Concurrent rendering looks promising.',
  'Pair programmed with a junior dev today. Teaching is the best way to solidify knowledge.',
  "Fixed a bug that's been haunting me for weeks. The relief is real.",
  'Started using Playwright for e2e tests. So much better than Selenium.',
  'Micro-frontends are solving real problems for our team. Independent deployments are a game changer.',
  'Spent the afternoon optimizing bundle size. Tree shaking is your friend.',
  'Just discovered React Hook Form. Where has this been all my life?',
  'The future of the web is exciting. WASM, WebGPU, multi-threading in the browser.',
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  // Initial data
  users: usersRecord,
  posts: initialPosts,
  friendships: initialFriendships,
  currentUserId: 'current-user',

  // UI state
  activeTab: 'feed',
  viewedUserId: null,
  searchQuery: '',
  searchResults: [],
  isLoadingMore: false,
  hasMorePosts: initialPosts.length > POSTS_PER_PAGE,
  displayedPostsCount: POSTS_PER_PAGE,
  scrollTargetPostId: null,

  // Notification state
  notifications: [],

  // ============ Computed ============

  getCurrentUser: () => {
    return get().users[get().currentUserId];
  },

  getUserById: (id: string) => {
    return get().users[id];
  },

  getFriendsForUser: (userId: string) => {
    const { friendships, users } = get();
    const friendIds = friendships.filter((f) => f.userId === userId).map((f) => f.friendId);
    return friendIds.map((id) => users[id]).filter(Boolean);
  },

  getMutualFriends: (userId: string) => {
    const { currentUserId } = get();
    if (userId === currentUserId) return [];
    const myFriends = get().getFriendsForUser(currentUserId);
    const theirFriends = get().getFriendsForUser(userId);
    const myFriendIds = new Set(myFriends.map((f) => f.id));
    return theirFriends.filter((f) => myFriendIds.has(f.id));
  },

  getMutualFriendCount: (userId: string) => {
    return get().getMutualFriends(userId).length;
  },

  getPostsForUser: (userId: string) => {
    return get().posts.filter((p) => p.userId === userId);
  },

  getFeedPosts: () => {
    const { posts, displayedPostsCount } = get();
    return posts.slice(0, displayedPostsCount);
  },

  hasLiked: (postId: string) => {
    const { posts, currentUserId } = get();
    const post = posts.find((p) => p.id === postId);
    return post ? post.likes.includes(currentUserId) : false;
  },

  unreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },

  getUINotifications: () => {
    return get().notifications.map((n) => ({
      id: n.id,
      message: n.message,
      timestamp: n.timestamp,
      read: n.read,
      icon: n.icon,
    }));
  },

  // ============ Post Actions ============

  createPost: (content: string, userId?: string) => {
    const authorId = userId || get().currentUserId;
    const newPost: Post = {
      id: generateId(),
      userId: authorId,
      content,
      timestamp: Date.now(),
      likes: [],
      comments: [],
    };
    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
  },

  toggleLike: (postId: string, userId?: string) => {
    const likerId = userId || get().currentUserId;
    set((state) => {
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return state;

      const hasLiked = post.likes.includes(likerId);

      // Generate notification if someone else likes the post
      if (!hasLiked && post.userId !== likerId) {
        get().generateNotification('like', likerId, postId);
      }

      return {
        posts: state.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes: hasLiked ? p.likes.filter((id) => id !== likerId) : [...p.likes, likerId],
              }
            : p
        ),
      };
    });
  },

  addComment: (postId: string, content: string, userId?: string) => {
    const commenterId = userId || get().currentUserId;
    const newComment: Comment = {
      id: generateId(),
      userId: commenterId,
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }),
    }));

    // Notify post owner if someone else comments
    const post = get().posts.find((p) => p.id === postId);
    if (post && post.userId !== commenterId) {
      get().generateNotification('comment', commenterId, postId);
    }
  },

  // ============ Friend Actions ============

  addFriend: (userId: string) => {
    const { currentUserId, friendships } = get();

    // Check if already friends
    const alreadyFriends = friendships.some(
      (f) => f.userId === currentUserId && f.friendId === userId
    );
    if (alreadyFriends) return;

    set((state) => ({
      friendships: [
        ...state.friendships,
        { userId: currentUserId, friendId: userId },
        { userId, friendId: currentUserId },
      ],
    }));

    // Notify the person being added
    get().generateNotification('friend_request', currentUserId);
  },

  removeFriend: (userId: string) => {
    const { currentUserId } = get();
    set((state) => ({
      friendships: state.friendships.filter(
        (f) =>
          !(f.userId === currentUserId && f.friendId === userId) &&
          !(f.userId === userId && f.friendId === currentUserId)
      ),
    }));
  },

  // ============ Feed Actions ============

  loadMorePosts: () => {
    const { posts, displayedPostsCount } = get();
    const newCount = Math.min(displayedPostsCount + POSTS_PER_PAGE, posts.length);
    set({
      isLoadingMore: false,
      displayedPostsCount: newCount,
      hasMorePosts: newCount < posts.length,
    });
  },

  scrollToPost: (postId: string) => {
    set({ scrollTargetPostId: postId });
  },

  clearScrollTarget: () => {
    set({ scrollTargetPostId: null });
  },

  // ============ Profile Actions ============

  updateBio: (bio: string) => {
    const { currentUserId } = get();
    set((state) => ({
      users: {
        ...state.users,
        [currentUserId]: { ...state.users[currentUserId], bio },
      },
    }));
  },

  // ============ Navigation ============

  setActiveTab: (tab: 'feed' | 'friends') => {
    set({ activeTab: tab, viewedUserId: null, searchQuery: '', searchResults: [] });
  },

  viewProfile: (userId: string | null) => {
    set({ viewedUserId: userId });
  },

  setSearchQuery: (query: string) => {
    const { users, currentUserId } = get();
    if (!query.trim()) {
      set({ searchQuery: '', searchResults: [] });
      return;
    }
    const results = Object.values(users).filter(
      (u) => u.id !== currentUserId && u.name.toLowerCase().includes(query.toLowerCase())
    );
    set({ searchQuery: query, searchResults: results });
  },

  // ============ Notification Actions ============

  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  generateNotification: (
    type: 'like' | 'comment' | 'friend_request',
    fromUserId: string,
    postId?: string
  ) => {
    const fromUser = get().users[fromUserId];
    if (!fromUser || fromUserId === get().currentUserId) return;

    let message = '';
    let icon: React.ReactNode = null;

    switch (type) {
      case 'like':
        message = `${fromUser.name} liked your post`;
        icon = <Heart className="w-4 h-4 text-earth-rose" fill="currentColor" />;
        break;
      case 'comment':
        message = `${fromUser.name} commented on your post`;
        icon = <MessageCircle className="w-4 h-4 text-primary" />;
        break;
      case 'friend_request':
        message = `${fromUser.name} added you as a friend`;
        icon = <UserPlus className="w-4 h-4 text-earth-sage" />;
        break;
    }

    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      message,
      timestamp: Date.now(),
      read: false,
      icon,
      _type: type,
      _fromUserId: fromUserId,
      _postId: postId,
    };

    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },

  handleNotificationClick: (notification: { id: string }) => {
    const fullNotification = get().notifications.find((n) => n.id === notification.id);
    if (!fullNotification) return;

    get().markNotificationRead(fullNotification.id);

    if (fullNotification._type === 'like' || fullNotification._type === 'comment') {
      if (fullNotification._postId) {
        get().setActiveTab('feed');
        get().scrollToPost(fullNotification._postId);
      }
    }
    if (fullNotification._type === 'friend_request') {
      get().viewProfile(fullNotification._fromUserId);
    }
  },

  // ============ Simulation Actions ============

  generateRandomPost: () => {
    const { users, currentUserId } = get();
    const allUsers = Object.values(users);
    // Bias toward other users (80%), sometimes "You" (20%)
    const author =
      Math.random() < 0.2
        ? users[currentUserId]
        : allUsers.filter((u) => u.id !== currentUserId)[
            Math.floor(Math.random() * (allUsers.length - 1))
          ];

    const content = MOCK_CONTENT_SIM[Math.floor(Math.random() * MOCK_CONTENT_SIM.length)];

    get().createPost(content, author.id);
  },

  generateRandomComment: () => {
    const { posts, users, currentUserId } = get();
    if (posts.length === 0) return;

    const post = posts[Math.floor(Math.random() * posts.length)];
    const otherUsers = Object.values(users).filter((u) => u.id !== currentUserId);
    const commenter = otherUsers[Math.floor(Math.random() * otherUsers.length)];

    const commentContents = [
      'Great point! Totally agree.',
      'This is so relatable 😂',
      'Thanks for sharing this!',
      "I've been thinking the same thing lately.",
      "Couldn't agree more!",
      'Interesting perspective!',
      'Love this! Keep it up 🚀',
      'This made my day.',
      'Well said!',
      'Adding this to my reading list.',
    ];

    const content = commentContents[Math.floor(Math.random() * commentContents.length)];
    get().addComment(post.id, content, commenter.id);
  },

  generateRandomLike: () => {
    const { posts, users, currentUserId } = get();
    if (posts.length === 0) return;

    const post = posts[Math.floor(Math.random() * posts.length)];
    const otherUsers = Object.values(users).filter((u) => u.id !== currentUserId);
    const liker = otherUsers[Math.floor(Math.random() * otherUsers.length)];

    // Only like if not already liked
    if (!post.likes.includes(liker.id)) {
      get().toggleLike(post.id, liker.id);
    }
  },

  generateRandomFriendAdd: () => {
    const { users, currentUserId, friendships } = get();
    const otherUsers = Object.values(users).filter((u) => u.id !== currentUserId);

    // Pick a random user who isn't already a friend
    const nonFriends = otherUsers.filter(
      (u) => !friendships.some((f) => f.userId === currentUserId && f.friendId === u.id)
    );

    if (nonFriends.length > 0) {
      const newFriend = nonFriends[Math.floor(Math.random() * nonFriends.length)];
      // Simulate them adding "You"
      set((state) => ({
        friendships: [
          ...state.friendships,
          { userId: currentUserId, friendId: newFriend.id },
          { userId: newFriend.id, friendId: currentUserId },
        ],
      }));
      get().generateNotification('friend_request', newFriend.id);
    }
  },
}));
