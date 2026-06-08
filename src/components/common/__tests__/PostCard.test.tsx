import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from '../PostCard';
import type { Post, User } from '../../../types/social';

const mockPost: Post = {
  id: 'post-1',
  userId: 'user-1',
  content: 'Test post content',
  timestamp: new Date('2024-01-01T12:00:00').getTime(),
  likes: ['user-2', 'user-3'],
  comments: [
    {
      id: 'comment-1',
      userId: 'user-2',
      content: 'Great post!',
      timestamp: new Date('2024-01-01T13:00:00').getTime(),
    },
  ],
};

const mockAuthor: User = {
  id: 'user-1',
  name: 'Alex Chen',
  bio: 'Full-stack developer',
  avatar: 'https://picsum.photos/seed/alexchen/200',
};

const mockCurrentUser: User = {
  id: 'current-user',
  name: 'You',
  bio: 'Test bio',
  avatar: 'https://picsum.photos/seed/currentuser/200',
};

const mockCommenters: Record<string, User> = {
  'user-2': {
    id: 'user-2',
    name: 'Sarah Johnson',
    bio: 'UX engineer',
    avatar: 'https://picsum.photos/seed/sarahjohnson/200',
  },
};

describe('PostCard', () => {
  const defaultProps = {
    post: mockPost,
    author: mockAuthor,
    currentUser: mockCurrentUser,
    commenters: mockCommenters,
    hasLiked: false,
    onLike: vi.fn(),
    onAddComment: vi.fn(),
    onAuthorClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render post content', () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText('Test post content')).toBeInTheDocument();
  });

  it('should render author name', () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText('Alex Chen')).toBeInTheDocument();
  });

  it('should render like count', () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render comment count', () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should call onLike when like button clicked', () => {
    render(<PostCard {...defaultProps} />);
    const likeButton = screen.getByText('2').closest('button');
    fireEvent.click(likeButton!);
    expect(defaultProps.onLike).toHaveBeenCalled();
  });

  it('should show filled heart when liked', () => {
    render(<PostCard {...defaultProps} hasLiked={true} />);
    const likeButton = screen.getByText('2').closest('button');
    expect(likeButton).toHaveClass('text-earth-rose');
  });

  it('should show unfilled heart when not liked', () => {
    render(<PostCard {...defaultProps} hasLiked={false} />);
    const likeButton = screen.getByText('2').closest('button');
    expect(likeButton).toHaveClass('text-earth-moss');
  });

  it('should expand comments when clicked', () => {
    render(<PostCard {...defaultProps} />);
    const commentButton = screen.getByText('1').closest('button');
    fireEvent.click(commentButton!);
    expect(screen.getByText('Great post!')).toBeInTheDocument();
  });

  it('should call onAuthorClick when author name clicked', () => {
    render(<PostCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Alex Chen'));
    expect(defaultProps.onAuthorClick).toHaveBeenCalledWith('user-1');
  });

  it('should call onAddComment when posting a comment', () => {
    render(<PostCard {...defaultProps} />);
    // Expand comments first
    const commentButton = screen.getByText('1').closest('button');
    fireEvent.click(commentButton!);

    const input = screen.getByPlaceholderText('Write a comment...');
    fireEvent.change(input, { target: { value: 'New comment' } });

    const postButton = screen.getByText('Post');
    fireEvent.click(postButton);

    expect(defaultProps.onAddComment).toHaveBeenCalledWith('New comment');
  });

  it('should show comments always when showCommentsAlways is true', () => {
    render(<PostCard {...defaultProps} showCommentsAlways />);
    expect(screen.getByText('Great post!')).toBeInTheDocument();
  });

  it('should render HTML links in content', () => {
    const postWithLinks = {
      ...mockPost,
      content: 'Check <a href="https://example.com" class="text-earth-sand">this</a> out',
    };
    render(<PostCard {...defaultProps} post={postWithLinks} />);
    const link = screen.getByText('this');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should return null when author is undefined', () => {
    const { container } = render(<PostCard {...defaultProps} author={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
