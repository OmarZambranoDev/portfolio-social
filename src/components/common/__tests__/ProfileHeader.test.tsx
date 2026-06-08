import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileHeader } from '../ProfileHeader';
import type { User } from '../../../types/social';

const mockUser: User = {
  id: 'user-1',
  name: 'Alex Chen',
  bio: 'Full-stack developer',
  avatar: 'https://picsum.photos/seed/alexchen/200',
};

describe('ProfileHeader', () => {
  const defaultProps = {
    user: mockUser,
    isCurrentUser: false,
    isFollowing: false,
    onFollow: vi.fn(),
    onUnfollow: vi.fn(),
    onUpdateBio: vi.fn(),
  };

  it('should render user name', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('Alex Chen')).toBeInTheDocument();
  });

  it('should render user bio', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('Full-stack developer')).toBeInTheDocument();
  });

  it('should show Follow button for other users', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('should show Unfollow when following', () => {
    render(<ProfileHeader {...defaultProps} isFollowing={true} />);
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
  });

  it('should show Edit Bio for current user', () => {
    render(<ProfileHeader {...defaultProps} isCurrentUser={true} />);
    expect(screen.getByText('Edit Bio')).toBeInTheDocument();
  });

  it('should enter edit mode when Edit Bio clicked', () => {
    render(<ProfileHeader {...defaultProps} isCurrentUser={true} />);
    fireEvent.click(screen.getByText('Edit Bio'));
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onUpdateBio when saving', () => {
    render(<ProfileHeader {...defaultProps} isCurrentUser={true} />);
    fireEvent.click(screen.getByText('Edit Bio'));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New bio' } });
    fireEvent.click(screen.getByText('Save'));

    expect(defaultProps.onUpdateBio).toHaveBeenCalledWith('New bio');
  });

  it('should cancel editing without saving', () => {
    render(<ProfileHeader {...defaultProps} isCurrentUser={true} />);
    fireEvent.click(screen.getByText('Edit Bio'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Edit Bio')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('should show links for current user', () => {
    render(<ProfileHeader {...defaultProps} isCurrentUser={true} />);
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should not show links for other users', () => {
    render(<ProfileHeader {...defaultProps} isCurrentUser={false} />);
    expect(screen.queryByText('Links')).not.toBeInTheDocument();
  });

  it('should call onFollow when Follow clicked', () => {
    render(<ProfileHeader {...defaultProps} />);
    fireEvent.click(screen.getByText('Follow'));
    expect(defaultProps.onFollow).toHaveBeenCalled();
  });

  it('should call onUnfollow when Unfollow clicked', () => {
    render(<ProfileHeader {...defaultProps} isFollowing={true} />);
    fireEvent.click(screen.getByText('Unfollow'));
    expect(defaultProps.onUnfollow).toHaveBeenCalled();
  });
});
