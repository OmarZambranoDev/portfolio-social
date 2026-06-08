import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileLayout } from '../MobileLayout';
import { useSocialStore } from '../../../store/socialStore';

// Mock IntersectionObserver
beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

// Mock scrollTo on DOM elements
beforeAll(() => {
  // @ts-expect-error - mock scrollTo for jsdom
  Element.prototype.scrollTo = vi.fn();
});

vi.mock('../MobileFeedView', () => ({
  MobileFeedView: ({ onUserClick }: { onUserClick: (userId: string) => void }) => (
    <div data-testid="mobile-feed-view">
      <button onClick={() => onUserClick('current-user')}>You Post</button>
      <button onClick={() => onUserClick('user-1')}>Other Post</button>
    </div>
  ),
}));

vi.mock('../MobileFollowingView', () => ({
  MobileFollowingView: ({ onUserClick }: { onUserClick: (userId: string) => void }) => (
    <div data-testid="mobile-following-view">
      <button onClick={() => onUserClick('user-1')}>User Card</button>
    </div>
  ),
}));

vi.mock('../MobileProfileView', () => ({
  MobileProfileView: ({ userId, onBack }: { userId: string; onBack?: () => void }) => (
    <div data-testid="mobile-profile-view">
      Profile: {userId}
      {onBack && <button onClick={onBack}>Back</button>}
    </div>
  ),
}));

vi.mock('../MobileSearchView', () => ({
  MobileSearchView: () => <div data-testid="mobile-search-view">Search</div>,
}));

vi.mock('../MobileNotificationsView', () => ({
  MobileNotificationsView: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="mobile-notifications-view">
      Notifications
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('../../common/PostDetailView', () => ({
  PostDetailView: ({ onBack }: { onBack?: () => void }) => (
    <div data-testid="mobile-post-detail-view">
      Post Detail
      {onBack && <button onClick={onBack}>Back</button>}
    </div>
  ),
}));

describe('MobileLayout', () => {
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
      notifications: [],
      activeTab: 'feed',
      viewedUserId: null,
      isSearching: false,
      searchQuery: '',
      searchResults: [],
      focusedPostId: null,
    });
  });

  it('should render feed view by default', () => {
    render(<MobileLayout />);
    expect(screen.getByTestId('mobile-feed-view')).toBeInTheDocument();
  });

  it('should render bottom nav with all buttons', () => {
    render(<MobileLayout />);
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should switch to following tab', () => {
    render(<MobileLayout />);
    fireEvent.click(screen.getByText('Following'));
    expect(screen.getByTestId('mobile-following-view')).toBeInTheDocument();
  });

  it('should switch to profile tab', () => {
    render(<MobileLayout />);
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByTestId('mobile-profile-view')).toBeInTheDocument();
  });

  it('should open search view', () => {
    render(<MobileLayout />);
    fireEvent.click(screen.getAllByText('Search')[0]); // The nav button
    expect(screen.getByTestId('mobile-search-view')).toBeInTheDocument();
  });

  it('should navigate to profile tab when You clicked', () => {
    render(<MobileLayout />);
    fireEvent.click(screen.getByText('You Post'));
    expect(screen.getByTestId('mobile-profile-view')).toBeInTheDocument();
  });

  it('should open profile overlay for other users', () => {
    render(<MobileLayout />);
    fireEvent.click(screen.getByText('Other Post'));
    expect(screen.getByTestId('mobile-profile-view')).toBeInTheDocument();
  });

  it('should open notifications view', () => {
    render(<MobileLayout />);
    const bellButton = screen.getByLabelText('Notifications');
    fireEvent.click(bellButton);
    expect(screen.getByTestId('mobile-notifications-view')).toBeInTheDocument();
  });

  it('should go back from notifications', () => {
    render(<MobileLayout />);
    fireEvent.click(screen.getByLabelText('Notifications'));
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByTestId('mobile-feed-view')).toBeInTheDocument();
  });
});
