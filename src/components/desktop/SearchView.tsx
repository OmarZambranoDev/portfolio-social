import { useSocialStore } from '../../store/socialStore';
import { Avatar, SearchBar } from '@OmarZambranoDev/portfolio-ui';
import { ChevronLeft } from 'lucide-react';

export function SearchView() {
  const searchQuery = useSocialStore((s) => s.searchQuery);
  const searchResults = useSocialStore((s) => s.searchResults);
  const setSearchQuery = useSocialStore((s) => s.setSearchQuery);
  const getMutualFriendCount = useSocialStore((s) => s.getMutualFriendCount);
  const viewProfile = useSocialStore((s) => s.viewProfile);

  const handleBack = () => {
    setSearchQuery('');
    viewProfile(null);
  };

  const handleUserClick = (userId: string) => {
    viewProfile(userId);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Back + Search Bar */}
      <div className="px-4 pt-4 pb-2 space-y-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-earth-moss hover:text-earth-forest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users..."
          variant="filled"
          size="md"
          debounceMs={300}
        />
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {searchQuery.trim() === '' ? (
          <p className="text-sm text-earth-moss text-center py-8">Search for users by name.</p>
        ) : searchResults.length === 0 ? (
          <p className="text-sm text-earth-moss text-center py-8">
            No users found for &quot;{searchQuery}&quot;.
          </p>
        ) : (
          <div className="space-y-1">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/10 text-left transition-colors"
              >
                <Avatar src={user.avatar} alt={user.name} size="md" className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-earth-forest">{user.name}</p>
                  <p className="text-xs text-earth-moss line-clamp-1">{user.bio}</p>
                  <p className="text-xs text-earth-sage mt-0.5">
                    {getMutualFriendCount(user.id)} mutual friend
                    {getMutualFriendCount(user.id) !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
