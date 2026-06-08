import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileFollowingView } from '../MobileFollowingView';
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

describe('MobileFollowingView', () => {
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
    const onUserClick = vi.fn();
    render(<MobileFollowingView onUserClick={onUserClick} />);
    expect(screen.getByTestId('user-card-user-1')).toBeInTheDocument();
    expect(screen.getByTestId('user-card-user-2')).toBeInTheDocument();
  });

  it('should show empty state when not following anyone', () => {
    useSocialStore.setState({ follows: [] });
    render(<MobileFollowingView onUserClick={vi.fn()} />);
    expect(screen.getByText('Not following anyone')).toBeInTheDocument();
  });

  it('should call onUserClick when View clicked', () => {
    const onUserClick = vi.fn();
    render(<MobileFollowingView onUserClick={onUserClick} />);
    fireEvent.click(screen.getAllByText('View')[0]);
    expect(onUserClick).toHaveBeenCalledWith('user-1');
  });
});
