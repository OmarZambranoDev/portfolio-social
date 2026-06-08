import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNotificationsView } from '../MobileNotificationsView';
import { useSocialStore } from '../../../store/socialStore';

describe('MobileNotificationsView', () => {
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
      posts: [],
      follows: [],
      notifications: [
        {
          id: 'notif-1',
          message: 'Alex Chen liked your post',
          timestamp: Date.now() - 3600000,
          read: false,
          icon: null,
          _type: 'like' as const,
          _fromUserId: 'user-1',
          _postId: 'post-1',
        },
        {
          id: 'notif-2',
          message: 'Sarah Johnson followed you',
          timestamp: Date.now() - 7200000,
          read: true,
          icon: null,
          _type: 'follow' as const,
          _fromUserId: 'user-2',
        },
      ],
    });
  });

  it('should render notifications', () => {
    const onBack = vi.fn();
    render(<MobileNotificationsView onBack={onBack} />);
    expect(screen.getByText('Alex Chen liked your post')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson followed you')).toBeInTheDocument();
  });

  it('should show empty state when no notifications', () => {
    useSocialStore.setState({ notifications: [] });
    const onBack = vi.fn();
    render(<MobileNotificationsView onBack={onBack} />);
    expect(screen.getByText('No notifications yet.')).toBeInTheDocument();
  });

  it('should call onBack when back clicked', () => {
    const onBack = vi.fn();
    render(<MobileNotificationsView onBack={onBack} />);
    fireEvent.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('should call handleNotificationClick when notification clicked', () => {
    const onBack = vi.fn();
    render(<MobileNotificationsView onBack={onBack} />);
    fireEvent.click(screen.getByText('Alex Chen liked your post'));

    const state = useSocialStore.getState();
    expect(state.focusedPostId).toBe('post-1');
    expect(state.notifications[0].read).toBe(true);
  });

  it('should mark all as read', () => {
    const onBack = vi.fn();
    render(<MobileNotificationsView onBack={onBack} />);
    fireEvent.click(screen.getByText('Mark all read'));

    const state = useSocialStore.getState();
    expect(state.notifications.every((n) => n.read)).toBe(true);
  });
});
