import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../UserCard';
import type { User } from '../../../types/social';

const mockUser: User = {
  id: 'user-1',
  name: 'Alex Chen',
  bio: 'Full-stack developer',
  avatar: 'https://picsum.photos/seed/alexchen/200',
};

describe('UserCard', () => {
  const defaultProps = {
    user: mockUser,
    isFollowing: false,
    onFollow: vi.fn(),
    onUnfollow: vi.fn(),
    onClick: vi.fn(),
  };

  it('should render user name', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('Alex Chen')).toBeInTheDocument();
  });

  it('should render user bio', () => {
    render(<UserCard {...defaultProps} />);
    expect(screen.getByText('Full-stack developer')).toBeInTheDocument();
  });

  it('should show Follow button when not following', () => {
    render(<UserCard {...defaultProps} isFollowing={false} />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('should show Unfollow button when following', () => {
    render(<UserCard {...defaultProps} isFollowing={true} />);
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
  });

  it('should call onFollow when Follow clicked', () => {
    render(<UserCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Follow'));
    expect(defaultProps.onFollow).toHaveBeenCalledWith('user-1');
  });

  it('should call onUnfollow when Unfollow clicked', () => {
    render(<UserCard {...defaultProps} isFollowing={true} />);
    fireEvent.click(screen.getByText('Unfollow'));
    expect(defaultProps.onUnfollow).toHaveBeenCalledWith('user-1');
  });

  it('should call onClick when card clicked', () => {
    render(<UserCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Alex Chen'));
    expect(defaultProps.onClick).toHaveBeenCalledWith('user-1');
  });

  it('should show mutual follow count', () => {
    render(<UserCard {...defaultProps} mutualFollowCount={3} />);
    expect(screen.getByText('3 mutual follows')).toBeInTheDocument();
  });

  it('should hide follow button when showFollowButton is false', () => {
    render(<UserCard {...defaultProps} showFollowButton={false} />);
    expect(screen.queryByText('Follow')).not.toBeInTheDocument();
  });

  it('should not have cursor-pointer when clickable is false', () => {
    const { container } = render(<UserCard {...defaultProps} clickable={false} />);
    const clickableDiv = container.querySelector('.cursor-pointer');
    expect(clickableDiv).toBeNull();
  });

  it('should have cursor-pointer when clickable is true', () => {
    const { container } = render(<UserCard {...defaultProps} clickable={true} />);
    const clickableDiv = container.querySelector('.cursor-pointer');
    expect(clickableDiv).not.toBeNull();
  });
});
