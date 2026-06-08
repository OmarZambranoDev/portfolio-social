import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileFeedView } from '../MobileFeedView';
import { useSocialStore } from '../../../store/socialStore';

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

  // @ts-expect-error - mock scrollTo for jsdom
  Element.prototype.scrollTo = vi.fn();
});

vi.mock('../../common/PostCard', () => ({
  PostCard: ({
    post,
    onAuthorClick,
    author,
  }: {
    post: { id: string; content: string };
    onAuthorClick: (userId: string) => void;
    author: { id: string } | undefined;
  }) => (
    <div data-testid={`post-${post.id}`}>
      <span>{post.content}</span>
      <button onClick={() => onAuthorClick(author?.id ?? '')}>Author</button>
    </div>
  ),
}));

vi.mock('../../common/NewPostInput', () => ({
  NewPostInput: () => <div data-testid="new-post-input">New Post</div>,
}));

describe('MobileFeedView', () => {
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
          timestamp: Date.now() - 3600000,
          likes: [],
          comments: [],
        },
        {
          id: 'post-2',
          userId: 'current-user',
          content: 'Post from You',
          timestamp: Date.now() - 7200000,
          likes: ['user-1'],
          comments: [],
        },
      ],
      follows: [{ followerId: 'current-user', followingId: 'user-1' }],
      notifications: [],
    });
  });

  it('should render posts from followed users', () => {
    render(<MobileFeedView onUserClick={vi.fn()} />);
    expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
    expect(screen.getByTestId('post-post-2')).toBeInTheDocument();
  });

  it('should render new post input', () => {
    render(<MobileFeedView onUserClick={vi.fn()} />);
    expect(screen.getByTestId('new-post-input')).toBeInTheDocument();
  });

  it('should call onUserClick when author clicked', () => {
    const onUserClick = vi.fn();
    render(<MobileFeedView onUserClick={onUserClick} />);
    const authorButtons = screen.getAllByText('Author');
    fireEvent.click(authorButtons[0]);
    expect(onUserClick).toHaveBeenCalled();
  });
});
