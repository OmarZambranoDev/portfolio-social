import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileProfileView } from '../MobileProfileView';
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
    clickable?: boolean;
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

describe('MobileProfileView', () => {
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
    render(<MobileProfileView userId="current-user" />);
    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    expect(screen.getByText('Edit Bio')).toBeInTheDocument();
    expect(screen.getByTestId('new-post-input')).toBeInTheDocument();
  });

  it('should render other user profile with follow button', () => {
    render(<MobileProfileView userId="user-1" />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('should show back button when onBack is provided', () => {
    const onBack = vi.fn();
    render(<MobileProfileView userId="user-1" onBack={onBack} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should call onBack when back clicked', () => {
    const onBack = vi.fn();
    render(<MobileProfileView userId="user-1" onBack={onBack} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('should render user posts', () => {
    render(<MobileProfileView userId="user-1" />);
    expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
  });
});
