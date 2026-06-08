import { describe, it, expect, beforeEach } from 'vitest';
import { useSocialStore } from '../socialStore';

beforeEach(() => {
  useSocialStore.setState({
    users: {
      'current-user': {
        id: 'current-user',
        name: 'You',
        bio: 'Test bio',
        avatar: 'https://picsum.photos/seed/currentuser/200',
      },
      'user-1': {
        id: 'user-1',
        name: 'Alex Chen',
        bio: 'Full-stack developer',
        avatar: 'https://picsum.photos/seed/alexchen/200',
      },
      'user-2': {
        id: 'user-2',
        name: 'Sarah Johnson',
        bio: 'UX engineer',
        avatar: 'https://picsum.photos/seed/sarahjohnson/200',
      },
    },
    posts: [
      {
        id: 'test-post-1',
        userId: 'user-1',
        content: 'Test post from Alex',
        timestamp: Date.now() - 3600000,
        likes: [],
        comments: [],
      },
      {
        id: 'test-post-2',
        userId: 'current-user',
        content: 'Test post from You',
        timestamp: Date.now() - 7200000,
        likes: ['user-1'],
        comments: [
          {
            id: 'test-comment-1',
            userId: 'user-2',
            content: 'Nice post!',
            timestamp: Date.now() - 1800000,
          },
        ],
      },
    ],
    follows: [],
    notifications: [],
    activeTab: 'feed',
    viewedUserId: null,
    isSearching: false,
    searchQuery: '',
    searchResults: [],
    focusedPostId: null,
  });
});

describe('Social Store', () => {
  describe('Post Actions', () => {
    it('should create a new post', () => {
      const initialPostCount = useSocialStore.getState().posts.length;

      useSocialStore.getState().createPost('My new post');

      const updatedStore = useSocialStore.getState();
      expect(updatedStore.posts.length).toBe(initialPostCount + 1);
      expect(updatedStore.posts[0].content).toBe('My new post');
      expect(updatedStore.posts[0].userId).toBe('current-user');
    });

    it('should create a post with specified user', () => {
      useSocialStore.getState().createPost('Post from Alex', 'user-1');

      const updatedStore = useSocialStore.getState();
      expect(updatedStore.posts[0].userId).toBe('user-1');
      expect(updatedStore.posts[0].content).toBe('Post from Alex');
    });

    it('should toggle like on a post', () => {
      const postId = 'test-post-1';

      useSocialStore.getState().toggleLike(postId);
      let post = useSocialStore.getState().posts.find((p) => p.id === postId);
      expect(post?.likes).toContain('current-user');

      useSocialStore.getState().toggleLike(postId);
      post = useSocialStore.getState().posts.find((p) => p.id === postId);
      expect(post?.likes).not.toContain('current-user');
    });

    it('should toggle like with specified user', () => {
      const postId = 'test-post-1';

      useSocialStore.getState().toggleLike(postId, 'user-2');

      const post = useSocialStore.getState().posts.find((p) => p.id === postId);
      expect(post?.likes).toContain('user-2');
    });

    it('should add a comment to a post', () => {
      const postId = 'test-post-1';

      useSocialStore.getState().addComment(postId, 'Great post!');

      const post = useSocialStore.getState().posts.find((p) => p.id === postId);
      expect(post?.comments.length).toBe(1);
      expect(post?.comments[0].content).toBe('Great post!');
      expect(post?.comments[0].userId).toBe('current-user');
    });

    it('should add a comment with specified user', () => {
      const postId = 'test-post-1';

      useSocialStore.getState().addComment(postId, 'Comment from Sarah', 'user-2');

      const post = useSocialStore.getState().posts.find((p) => p.id === postId);
      expect(post?.comments[0].userId).toBe('user-2');
    });
  });

  describe('Follow Actions', () => {
    it('should follow a user', () => {
      useSocialStore.getState().followUser('user-1');

      const follows = useSocialStore.getState().follows;
      expect(follows).toContainEqual({
        followerId: 'current-user',
        followingId: 'user-1',
      });
    });

    it('should not follow if already following', () => {
      useSocialStore.getState().followUser('user-1');
      const followCount = useSocialStore.getState().follows.length;

      useSocialStore.getState().followUser('user-1');

      expect(useSocialStore.getState().follows.length).toBe(followCount);
    });

    it('should unfollow a user', () => {
      useSocialStore.getState().followUser('user-1');
      expect(useSocialStore.getState().isFollowing('user-1')).toBe(true);

      useSocialStore.getState().unfollowUser('user-1');
      expect(useSocialStore.getState().isFollowing('user-1')).toBe(false);
    });

    it('should check if following a user', () => {
      expect(useSocialStore.getState().isFollowing('user-1')).toBe(false);

      useSocialStore.getState().followUser('user-1');
      expect(useSocialStore.getState().isFollowing('user-1')).toBe(true);
    });
  });

  describe('Computed Getters', () => {
    it('should get current user', () => {
      const currentUser = useSocialStore.getState().getCurrentUser();
      expect(currentUser.id).toBe('current-user');
      expect(currentUser.name).toBe('You');
    });

    it('should get user by id', () => {
      const user = useSocialStore.getState().getUserById('user-1');
      expect(user?.name).toBe('Alex Chen');
    });

    it('should get following for user', () => {
      useSocialStore.getState().followUser('user-1');
      useSocialStore.getState().followUser('user-2');

      const following = useSocialStore.getState().getFollowingForUser('current-user');
      expect(following.length).toBe(2);
      expect(following.map((f) => f.id)).toContain('user-1');
      expect(following.map((f) => f.id)).toContain('user-2');
    });

    it('should get followers for user', () => {
      useSocialStore.getState().followUser('user-1');

      useSocialStore.setState((s) => ({
        follows: [...s.follows, { followerId: 'user-2', followingId: 'user-1' }],
      }));

      const followers = useSocialStore.getState().getFollowersForUser('user-1');
      expect(followers.some((f) => f.id === 'current-user')).toBe(true);
      expect(followers.some((f) => f.id === 'user-2')).toBe(true);
    });

    it('should get mutual follows (people I follow who also follow the target)', () => {
      useSocialStore.setState({
        follows: [
          { followerId: 'current-user', followingId: 'user-2' },
          { followerId: 'user-2', followingId: 'user-1' },
        ],
      });

      const mutual = useSocialStore.getState().getMutualFollows('user-1');
      expect(mutual.length).toBe(1);
      expect(mutual[0].id).toBe('user-2');
    });

    it('should get mutual follow count', () => {
      useSocialStore.setState({
        follows: [
          { followerId: 'current-user', followingId: 'user-2' },
          { followerId: 'user-2', followingId: 'user-1' },
        ],
      });

      expect(useSocialStore.getState().getMutualFollowCount('user-1')).toBe(1);
    });

    it('should get posts for user', () => {
      const posts = useSocialStore.getState().getPostsForUser('user-1');
      expect(posts.length).toBe(1);
      expect(posts[0].content).toBe('Test post from Alex');
    });

    it('should check if user has liked a post', () => {
      expect(useSocialStore.getState().hasLiked('test-post-1')).toBe(false);
      expect(useSocialStore.getState().hasLiked('test-post-2')).toBe(false);
    });

    it('should get unread notification count', () => {
      useSocialStore.setState({
        notifications: [
          {
            id: 'notif-1',
            message: 'Test notification',
            timestamp: Date.now(),
            read: false,
            icon: null,
            _type: 'like' as const,
            _fromUserId: 'user-1',
          },
          {
            id: 'notif-2',
            message: 'Read notification',
            timestamp: Date.now(),
            read: true,
            icon: null,
            _type: 'follow' as const,
            _fromUserId: 'user-2',
          },
        ],
      });

      expect(useSocialStore.getState().unreadCount()).toBe(1);
    });
  });

  describe('Search', () => {
    it('should search users by name', () => {
      useSocialStore.getState().setSearchQuery('Alex');

      const results = useSocialStore.getState().searchResults;
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Alex Chen');
    });

    it('should not include current user in search results', () => {
      useSocialStore.getState().setSearchQuery('You');

      expect(useSocialStore.getState().searchResults.length).toBe(0);
    });

    it('should sort results alphabetically', () => {
      useSocialStore.setState((s) => ({
        users: {
          ...s.users,
          'user-3': {
            id: 'user-3',
            name: 'Aaron Smith',
            bio: 'Dev',
            avatar: '',
          },
        },
      }));

      useSocialStore.getState().setSearchQuery('a');

      const results = useSocialStore.getState().searchResults;
      expect(results[0].name).toBe('Aaron Smith');
      expect(results[1].name).toBe('Alex Chen');
    });

    it('should clear search results on empty query', () => {
      useSocialStore.getState().setSearchQuery('Alex');
      useSocialStore.getState().setSearchQuery('');

      expect(useSocialStore.getState().searchResults.length).toBe(0);
    });
  });

  describe('Notifications', () => {
    it('should generate a notification', () => {
      useSocialStore.getState().generateNotification('like', 'user-1', 'test-post-2');

      const notifications = useSocialStore.getState().notifications;
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toContain('Alex Chen liked your post');
    });

    it('should not generate notification for own actions', () => {
      useSocialStore.getState().generateNotification('like', 'current-user', 'test-post-1');

      expect(useSocialStore.getState().notifications.length).toBe(0);
    });

    it('should mark notification as read', () => {
      useSocialStore.getState().generateNotification('like', 'user-1', 'test-post-2');
      const notifId = useSocialStore.getState().notifications[0].id;

      useSocialStore.getState().markNotificationRead(notifId);

      expect(useSocialStore.getState().notifications[0].read).toBe(true);
    });

    it('should mark all notifications as read', () => {
      useSocialStore.getState().generateNotification('like', 'user-1', 'test-post-2');
      useSocialStore.getState().generateNotification('comment', 'user-2', 'test-post-2');

      useSocialStore.getState().markAllNotificationsRead();

      expect(useSocialStore.getState().notifications.every((n) => n.read)).toBe(true);
    });

    it('should remove a notification', () => {
      useSocialStore.getState().generateNotification('like', 'user-1', 'test-post-2');
      const notifId = useSocialStore.getState().notifications[0].id;

      useSocialStore.getState().removeNotification(notifId);

      expect(useSocialStore.getState().notifications.length).toBe(0);
    });
  });

  describe('Profile', () => {
    it('should update bio', () => {
      useSocialStore.getState().updateBio('Updated bio text');

      expect(useSocialStore.getState().users['current-user'].bio).toBe('Updated bio text');
    });
  });

  describe('Navigation', () => {
    it('should set active tab', () => {
      useSocialStore.getState().setActiveTab('following');
      expect(useSocialStore.getState().activeTab).toBe('following');
    });

    it('should view profile', () => {
      useSocialStore.getState().viewProfile('user-1');
      expect(useSocialStore.getState().viewedUserId).toBe('user-1');
    });

    it('should clear viewed user', () => {
      useSocialStore.getState().viewProfile('user-1');
      useSocialStore.getState().viewProfile(null);
      expect(useSocialStore.getState().viewedUserId).toBeNull();
    });

    it('should toggle search', () => {
      useSocialStore.getState().setSearching(true);
      expect(useSocialStore.getState().isSearching).toBe(true);
    });
  });
});
