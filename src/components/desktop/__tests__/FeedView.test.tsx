import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeedView } from '../FeedView';
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

vi.mock('../../common/PostCard', () => ({
  PostCard: ({
    onLike,
    onAddComment,
    onAuthorClick,
    post,
    author,
  }: {
    onLike: () => void;
    onAddComment: (content: string) => void;
    onAuthorClick: (userId: string) => void;
    post: { id: string; content: string };
    author: { id: string } | undefined;
  }) => (
    <div data-testid={`post-${post.id}`}>
      <span>{post.content}</span>
      <button onClick={onLike}>Like</button>
      <button onClick={() => onAddComment('Test comment')}>Comment</button>
      <button onClick={() => onAuthorClick(author?.id ?? '')}>Author</button>
    </div>
  ),
}));

vi.mock('../../common/NewPostInput', () => ({
  NewPostInput: () => <div data-testid="new-post-input">New Post</div>,
}));

describe('FeedView', () => {
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
    const onAuthorClick = vi.fn();
    render(<FeedView onAuthorClick={onAuthorClick} />);
    expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
    expect(screen.getByTestId('post-post-2')).toBeInTheDocument();
  });

  it('should render new post input', () => {
    render(<FeedView onAuthorClick={vi.fn()} />);
    expect(screen.getByTestId('new-post-input')).toBeInTheDocument();
  });

  it('should call onAuthorClick when author clicked', () => {
    const onAuthorClick = vi.fn();
    render(<FeedView onAuthorClick={onAuthorClick} />);
    fireEvent.click(screen.getAllByText('Author')[0]);
    expect(onAuthorClick).toHaveBeenCalled();
  });

  it('should filter posts to only show followed users', () => {
    useSocialStore.setState({
      follows: [],
    });

    const onAuthorClick = vi.fn();
    render(<FeedView onAuthorClick={onAuthorClick} />);

    expect(screen.getByTestId('post-post-2')).toBeInTheDocument();
    expect(screen.queryByTestId('post-post-1')).not.toBeInTheDocument();
  });
});
