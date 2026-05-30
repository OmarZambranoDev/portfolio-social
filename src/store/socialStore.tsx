import { create } from 'zustand';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { User, Post, Follow, Notification, Comment } from '../types/social';
import { generateAllData } from '../data/mockData';

interface SocialStore {
  // Data
  users: Record<string, User>;
  posts: Post[];
  follows: Follow[];
  currentUserId: string;

  // UI state
  activeTab: 'feed' | 'following' | 'profile';
  viewedUserId: string | null;
  isSearching: boolean;
  searchQuery: string;
  searchResults: User[];
  focusedPostId: string | null;

  // Notification state
  notifications: Notification[];

  // Computed
  getCurrentUser: () => User;
  getUserById: (id: string) => User | undefined;
  getFollowingForUser: (userId: string) => User[];
  getFollowersForUser: (userId: string) => User[];
  getMutualFollows: (userId: string) => User[];
  getMutualFollowCount: (userId: string) => number;
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

  // Follow actions
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;

  // Post detail
  clearFocusedPost: () => void;

  // Profile actions
  updateBio: (bio: string) => void;

  // Navigation
  setActiveTab: (tab: 'feed' | 'following' | 'profile') => void;
  viewProfile: (userId: string | null) => void;
  setSearching: (searching: boolean) => void;
  setSearchQuery: (query: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  generateNotification: (
    type: 'like' | 'comment' | 'follow',
    fromUserId: string,
    postId?: string
  ) => void;
  handleNotificationClick: (notification: { id: string }) => void;

  // Simulation actions
  generateRandomPost: () => void;
  generateRandomComment: () => void;
  generateRandomLike: () => void;
  generateRandomFollow: () => void;
}

const POSTS_PER_PAGE = 10;

const { users: initialUsers, follows: initialFollows, posts: initialPosts } = generateAllData();
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

let idCounter = 0;
function generateId(): string {
  return `${Date.now()}-${idCounter++}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  // Initial data
  users: usersRecord,
  posts: initialPosts,
  follows: initialFollows,
  currentUserId: 'current-user',

  // UI state
  activeTab: 'feed',
  viewedUserId: null,
  isSearching: false,
  searchQuery: '',
  searchResults: [],
  focusedPostId: null,

  // Notification state
  notifications: [],

  // ============ Computed ============

  getCurrentUser: () => {
    return get().users[get().currentUserId];
  },

  getUserById: (id: string) => {
    return get().users[id];
  },

  getFollowingForUser: (userId: string) => {
    const { follows, users } = get();
    const followingIds = follows.filter((f) => f.followerId === userId).map((f) => f.followingId);
    return followingIds.map((id) => users[id]).filter(Boolean);
  },

  getFollowersForUser: (userId: string) => {
    const { follows, users } = get();
    const followerIds = follows.filter((f) => f.followingId === userId).map((f) => f.followerId);
    return followerIds.map((id) => users[id]).filter(Boolean);
  },

  getMutualFollows: (userId: string) => {
    const { currentUserId } = get();
    if (userId === currentUserId) return [];
    const myFollowing = get().getFollowingForUser(currentUserId);
    const theirFollowers = get().getFollowersForUser(userId);
    const myFollowingIds = new Set(myFollowing.map((f) => f.id));
    return theirFollowers.filter((f) => myFollowingIds.has(f.id));
  },

  getMutualFollowCount: (userId: string) => {
    return get().getMutualFollows(userId).length;
  },

  getPostsForUser: (userId: string) => {
    return get().posts.filter((p) => p.userId === userId);
  },

  getFeedPosts: () => {
    const { posts } = get();
    return posts.slice(0, POSTS_PER_PAGE);
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

      // Only notify if someone else likes "You"'s post
      if (!hasLiked && post.userId !== likerId && post.userId === get().currentUserId) {
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

    const post = get().posts.find((p) => p.id === postId);
    // Only notify if someone else comments on "You"'s post
    if (post && post.userId !== commenterId && post.userId === get().currentUserId) {
      get().generateNotification('comment', commenterId, postId);
    }
  },

  // ============ Follow Actions ============

  followUser: (userId: string) => {
    const { currentUserId, follows } = get();

    const alreadyFollowing = follows.some(
      (f) => f.followerId === currentUserId && f.followingId === userId
    );
    if (alreadyFollowing) return;

    set((state) => ({
      follows: [...state.follows, { followerId: currentUserId, followingId: userId }],
    }));

    get().generateNotification('follow', currentUserId);
  },

  unfollowUser: (userId: string) => {
    const { currentUserId } = get();
    set((state) => ({
      follows: state.follows.filter(
        (f) => !(f.followerId === currentUserId && f.followingId === userId)
      ),
    }));
  },

  isFollowing: (userId: string) => {
    const { follows, currentUserId } = get();
    return follows.some((f) => f.followerId === currentUserId && f.followingId === userId);
  },

  // ============ Post Detail ============

  clearFocusedPost: () => {
    set({ focusedPostId: null });
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

  setActiveTab: (tab: 'feed' | 'following' | 'profile') => {
    if (tab === 'profile') {
      set({
        activeTab: 'profile',
        viewedUserId: 'current-user',
        isSearching: false,
        searchQuery: '',
        searchResults: [],
      });
    } else {
      set({
        activeTab: tab,
        viewedUserId: null,
        isSearching: false,
        searchQuery: '',
        searchResults: [],
      });
    }
  },

  viewProfile: (userId: string | null) => {
    set({ viewedUserId: userId });
  },

  setSearching: (searching: boolean) => {
    if (searching) {
      set({ isSearching: true, searchQuery: '' });
    } else {
      set({ isSearching: false, searchQuery: '', searchResults: [] });
    }
  },

  setSearchQuery: (query: string) => {
    const { users, currentUserId } = get();
    if (!query.trim()) {
      set({ searchQuery: '', searchResults: [] });
      return;
    }
    set({ searchQuery: query, isSearching: true });
    const results = Object.values(users).filter(
      (u) => u.id !== currentUserId && u.name.toLowerCase().includes(query.toLowerCase())
    );
    set({ searchResults: results });
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
    type: 'like' | 'comment' | 'follow',
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
      case 'follow':
        message = `${fromUser.name} followed you`;
        icon = <UserPlus className="w-4 h-4 text-earth-sage" />;
        break;
    }

    const notification: Notification = {
      id: `notif-${generateId()}`,
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
        set({ focusedPostId: fullNotification._postId });
      }
    }
    if (fullNotification._type === 'follow') {
      set({ focusedPostId: null });
      get().viewProfile(fullNotification._fromUserId);
    }
  },

  // ============ Simulation Actions ============

  generateRandomPost: () => {
    const { users, currentUserId } = get();
    const otherUsers = Object.values(users).filter((u) => u.id !== currentUserId);
    const author = otherUsers[Math.floor(Math.random() * otherUsers.length)];

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

    if (!post.likes.includes(liker.id)) {
      get().toggleLike(post.id, liker.id);
    }
  },

  generateRandomFollow: () => {
    const { users, currentUserId, follows } = get();
    const otherUsers = Object.values(users).filter((u) => u.id !== currentUserId);

    const nonFollowing = otherUsers.filter(
      (u) => !follows.some((f) => f.followerId === currentUserId && f.followingId === u.id)
    );

    if (nonFollowing.length > 0) {
      const newFollow = nonFollowing[Math.floor(Math.random() * nonFollowing.length)];
      set((state) => ({
        follows: [...state.follows, { followerId: newFollow.id, followingId: currentUserId }],
      }));
      get().generateNotification('follow', newFollow.id);
    }
  },
}));
