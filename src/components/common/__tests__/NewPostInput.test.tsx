import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewPostInput } from '../NewPostInput';
import { useSocialStore } from '../../../store/socialStore';

describe('NewPostInput', () => {
  beforeEach(() => {
    useSocialStore.setState({
      users: {
        'current-user': {
          id: 'current-user',
          name: 'You',
          bio: 'Test bio',
          avatar: 'https://picsum.photos/seed/currentuser/200',
        },
      },
      posts: [],
      follows: [],
      notifications: [],
    });
  });

  it('should render textarea and post button', () => {
    render(<NewPostInput />);
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('should disable post button when empty', () => {
    render(<NewPostInput />);
    expect(screen.getByText('Post')).toBeDisabled();
  });

  it('should enable post button when text entered', () => {
    render(<NewPostInput />);
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: 'Hello world' },
    });
    expect(screen.getByText('Post')).not.toBeDisabled();
  });

  it('should create post when clicking Post', () => {
    render(<NewPostInput />);
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    fireEvent.click(screen.getByText('Post'));

    const posts = useSocialStore.getState().posts;
    expect(posts.length).toBe(1);
    expect(posts[0].content).toBe('Hello world');
  });

  it('should clear textarea after posting', () => {
    render(<NewPostInput />);
    const textarea = screen.getByPlaceholderText("What's on your mind?") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    fireEvent.click(screen.getByText('Post'));

    expect(textarea.value).toBe('');
  });

  it('should show character count', () => {
    render(<NewPostInput />);
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: 'Hello' },
    });
    expect(screen.getByText('5 characters')).toBeInTheDocument();
  });
});
