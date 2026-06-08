import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchView } from '../SearchView';
import { useSocialStore } from '../../../store/socialStore';

vi.mock('../../common/UserCard', () => ({
  UserCard: ({
    user,
    onClick,
  }: {
    user: { id: string; name: string };
    onClick: (userId: string) => void;
  }) => (
    <div data-testid={`user-card-${user.id}`}>
      <button onClick={() => onClick(user.id)}>{user.name}</button>
    </div>
  ),
}));

vi.mock('@OmarZambranoDev/portfolio-ui', async () => {
  const actual = await vi.importActual<typeof import('@OmarZambranoDev/portfolio-ui')>(
    '@OmarZambranoDev/portfolio-ui'
  );
  return {
    ...actual,
    SearchBar: ({
      value,
      onChange,
      placeholder,
    }: {
      value: string;
      onChange: (value: string) => void;
      placeholder: string;
    }) => (
      <input
        data-testid="search-bar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ),
  };
});

describe('SearchView', () => {
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
      posts: [],
      follows: [],
      notifications: [],
      isSearching: true,
      searchQuery: '',
      searchResults: [],
    });
  });

  it('should render search bar', () => {
    render(<SearchView />);
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('should show search prompt when query is empty', () => {
    render(<SearchView />);
    expect(screen.getByText('Search for users by name.')).toBeInTheDocument();
  });

  it('should show search results', () => {
    useSocialStore.setState({
      searchQuery: 'Alex',
      searchResults: [
        {
          id: 'user-1',
          name: 'Alex Chen',
          bio: 'Dev',
          avatar: '',
        },
      ],
    });
    render(<SearchView />);
    expect(screen.getByTestId('user-card-user-1')).toBeInTheDocument();
  });

  it('should show no results message', () => {
    useSocialStore.setState({
      searchQuery: 'xyz',
      searchResults: [],
    });
    render(<SearchView />);
    expect(screen.getByText('No users found for "xyz".')).toBeInTheDocument();
  });

  it('should call setSearching false on back', () => {
    render(<SearchView />);
    fireEvent.click(screen.getByText('Back'));
    expect(useSocialStore.getState().isSearching).toBe(false);
  });

  it('should navigate to profile when user clicked', () => {
    useSocialStore.setState({
      searchQuery: 'Alex',
      searchResults: [
        {
          id: 'user-1',
          name: 'Alex Chen',
          bio: 'Dev',
          avatar: '',
        },
      ],
    });
    render(<SearchView />);
    fireEvent.click(screen.getByText('Alex Chen'));
    expect(useSocialStore.getState().viewedUserId).toBe('user-1');
  });
});
