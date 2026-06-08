import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileView } from '../ProfileView';
import { useSocialStore } from '../../../store/socialStore';

vi.mock('../../common/ProfileHeader', () => ({
  ProfileHeader: ({
    user,
    isCurrentUser,
    isFollowing,
    onFollow,
    onUnfollow,
  }: {
    user: { id: string; name: string };
    isCurrentUser: boolean;
    isFollowing: boolean;
    onFollow: () => void;
    onUnfollow: () => void;
    onUpdateBio: (bio: string) => void;
  }) => (
    <div data-testid="profile-header">
      <span>{user.name}</span>
      {isCurrentUser && <span>Edit Bio</span>}
      {!isCurrentUser &&
        (isFollowing ? (
          <button onClick={onUnfollow}>Unfollow</button>
        ) : (
          <button onClick={onFollow}>Follow</button>
        ))}
    </div>
  ),
}));

vi.mock('../../common/MutualFollowsList', () => ({
  MutualFollowsList: ({ mutualFollows }: { mutualFollows: Array<{ id: string }> }) => (
    <div data-testid="mutual-follows">Mutual: {mutualFollows.length}</div>
  ),
}));

vi.mock('../../common/PostCard', () => ({
  PostCard: ({ post }: { post: { id: string; content: string } }) => (
    <div data-testid={`post-${post.id}`}>{post.content}</div>
  ),
}));

vi.mock('../../common/NewPostInput', () => ({
  NewPostInput: () => <div data-testid="new-post-input">New Post</div>,
}));

describe('ProfileView', () => {
  beforeEach(() => {
    useSocialStore.setState({
      users: {
        'current-user': {
          id: 'current-user',
          name: 'You',
          bio: 'Test bio',
          avatar: '',
        },
        'user-1': {
          id: 'user-1',
          name: 'Alex Chen',
          bio: 'Dev',
          avatar: '',
        },
      },
      posts: [
        {
          id: 'post-1',
          userId: 'user-1',
          content: 'Post from Alex',
          timestamp: Date.now(),
          likes: [],
          comments: [],
        },
      ],
      follows: [],
      notifications: [],
    });
  });

  it('should render own profile with edit bio', () => {
    render(<ProfileView userId="current-user" />);
    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    expect(screen.getByText('Edit Bio')).toBeInTheDocument();
    expect(screen.getByTestId('new-post-input')).toBeInTheDocument();
  });

  it('should render other user profile with follow button', () => {
    render(<ProfileView userId="user-1" />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('should show back button when showBack is true', () => {
    render(<ProfileView userId="user-1" showBack />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should render user posts', () => {
    render(<ProfileView userId="user-1" />);
    expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
  });

  it('should show mutual follows for other users', () => {
    useSocialStore.setState({
      follows: [
        { followerId: 'current-user', followingId: 'user-1' },
        { followerId: 'user-1', followingId: 'current-user' },
      ],
    });
    render(<ProfileView userId="user-1" />);
    expect(screen.getByTestId('mutual-follows')).toBeInTheDocument();
  });

  it('should follow user when Follow clicked', () => {
    render(<ProfileView userId="user-1" />);
    fireEvent.click(screen.getByText('Follow'));
    expect(useSocialStore.getState().isFollowing('user-1')).toBe(true);
  });

  it('should unfollow user when Unfollow clicked', () => {
    useSocialStore.setState({
      follows: [{ followerId: 'current-user', followingId: 'user-1' }],
    });
    render(<ProfileView userId="user-1" />);
    fireEvent.click(screen.getByText('Unfollow'));
    expect(useSocialStore.getState().isFollowing('user-1')).toBe(false);
  });
});
