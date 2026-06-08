import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FollowingView } from '../FollowingView';
import { useSocialStore } from '../../../store/socialStore';

vi.mock('../../common/UserCard', () => ({
  UserCard: ({
    user,
    onUnfollow,
    onClick,
  }: {
    user: { id: string; name: string };
    onUnfollow: (userId: string) => void;
    onClick: (userId: string) => void;
  }) => (
    <div data-testid={`user-card-${user.id}`}>
      <span>{user.name}</span>
      <button onClick={() => onUnfollow(user.id)}>Unfollow</button>
      <button onClick={() => onClick(user.id)}>View</button>
    </div>
  ),
}));

describe('FollowingView', () => {
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
        'user-2': {
          id: 'user-2',
          name: 'Sarah Johnson',
          bio: 'UX',
          avatar: '',
        },
      },
      follows: [
        { followerId: 'current-user', followingId: 'user-1' },
        { followerId: 'current-user', followingId: 'user-2' },
      ],
      posts: [],
      notifications: [],
    });
  });

  it('should render following users', () => {
    render(<FollowingView />);
    expect(screen.getByTestId('user-card-user-1')).toBeInTheDocument();
    expect(screen.getByTestId('user-card-user-2')).toBeInTheDocument();
  });

  it('should show empty state when not following anyone', () => {
    useSocialStore.setState({ follows: [] });
    render(<FollowingView />);
    expect(screen.getByText('Not following anyone')).toBeInTheDocument();
  });

  it('should call unfollow when Unfollow clicked', () => {
    render(<FollowingView />);
    const unfollowButtons = screen.getAllByText('Unfollow');
    fireEvent.click(unfollowButtons[0]);
    expect(useSocialStore.getState().isFollowing('user-1')).toBe(false);
  });

  it('should call onClick when View clicked', () => {
    render(<FollowingView />);
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    expect(useSocialStore.getState().viewedUserId).toBe('user-1');
  });
});
