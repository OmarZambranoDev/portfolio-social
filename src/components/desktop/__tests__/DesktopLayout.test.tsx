import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DesktopLayout } from '../DesktopLayout';
import { useSocialStore } from '../../../store/socialStore';

vi.mock('@OmarZambranoDev/portfolio-ui', async () => {
  const actual = await vi.importActual<typeof import('@OmarZambranoDev/portfolio-ui')>(
    '@OmarZambranoDev/portfolio-ui'
  );

  interface TabsProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
  }

  interface TriggerProps {
    value: string;
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
  }

  return {
    ...actual,
    Tabs: ({ onValueChange, children }: TabsProps) => (
      <div data-testid="tabs">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onValueChange } as Partial<TabsProps>);
          }
          return child;
        })}
      </div>
    ),
    TabsList: ({
      children,
      onValueChange,
    }: {
      children: React.ReactNode;
      onValueChange?: (value: string) => void;
    }) => (
      <div>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onValueChange } as Partial<TriggerProps>);
          }
          return child;
        })}
      </div>
    ),
    TabsTrigger: ({ value: tabValue, children, onValueChange }: TriggerProps) => (
      <button onClick={() => onValueChange?.(tabValue)}>{children}</button>
    ),
    TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

vi.mock('../../common/Header', () => ({
  Header: ({ onSearchClick }: { onSearchClick: () => void }) => (
    <div data-testid="header">
      <button onClick={onSearchClick}>Search</button>
    </div>
  ),
}));

vi.mock('../FeedView', () => ({
  FeedView: ({ onAuthorClick }: { onAuthorClick: (id: string) => void }) => (
    <div data-testid="feed-view">
      <button onClick={() => onAuthorClick('current-user')}>You Author</button>
      <button onClick={() => onAuthorClick('user-1')}>Other Author</button>
    </div>
  ),
}));

vi.mock('../FollowingView', () => ({
  FollowingView: () => <div data-testid="following-view">Following</div>,
}));

vi.mock('../ProfileView', () => ({
  ProfileView: ({ userId, showBack }: { userId: string; showBack?: boolean }) => (
    <div data-testid="profile-view">
      Profile: {userId}
      {showBack && <button>Back</button>}
    </div>
  ),
}));

vi.mock('../SearchView', () => ({
  SearchView: () => <div data-testid="search-view">Search</div>,
}));

vi.mock('../../common/PostDetailView', () => ({
  PostDetailView: () => <div data-testid="post-detail-view">Post Detail</div>,
}));

describe('DesktopLayout', () => {
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

  it('should render feed tab by default', () => {
    render(<DesktopLayout />);
    expect(screen.getByTestId('feed-view')).toBeInTheDocument();
  });

  it('should switch to following tab', () => {
    render(<DesktopLayout />);
    fireEvent.click(screen.getByText('Following'));
    expect(screen.getByTestId('following-view')).toBeInTheDocument();
  });

  it('should switch to profile tab', () => {
    render(<DesktopLayout />);
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByTestId('profile-view')).toBeInTheDocument();
  });

  it('should open search when search clicked', () => {
    render(<DesktopLayout />);
    fireEvent.click(screen.getByText('Search'));
    expect(screen.getByTestId('search-view')).toBeInTheDocument();
  });

  it('should navigate to profile tab when You author clicked', () => {
    render(<DesktopLayout />);
    fireEvent.click(screen.getByText('You Author'));
    expect(screen.getByTestId('profile-view')).toBeInTheDocument();
  });

  it('should open profile overlay for other authors', () => {
    render(<DesktopLayout />);
    fireEvent.click(screen.getByText('Other Author'));
    expect(screen.getByTestId('profile-view')).toBeInTheDocument();
  });

  it('should show post detail when focusedPostId is set', () => {
    useSocialStore.setState({ focusedPostId: 'post-1' });
    render(<DesktopLayout />);
    expect(screen.getByTestId('post-detail-view')).toBeInTheDocument();
  });
});
