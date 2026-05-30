import { useSocialStore } from '../../store/socialStore';
import { SearchBar } from '@OmarZambranoDev/portfolio-ui';
import { ChevronLeft } from 'lucide-react';
import { UserCard } from '../common/UserCard';

export function SearchView() {
  const searchQuery = useSocialStore((s) => s.searchQuery);
  const searchResults = useSocialStore((s) => s.searchResults);
  const follows = useSocialStore((s) => s.follows);
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const setSearchQuery = useSocialStore((s) => s.setSearchQuery);
  const setSearching = useSocialStore((s) => s.setSearching);
  const getMutualFollowCount = useSocialStore((s) => s.getMutualFollowCount);
  const followUser = useSocialStore((s) => s.followUser);
  const unfollowUser = useSocialStore((s) => s.unfollowUser);
  const viewProfile = useSocialStore((s) => s.viewProfile);

  const handleBack = () => {
    setSearching(false);
  };

  const isFollowing = (userId: string) => {
    return follows.some((f) => f.followerId === currentUserId && f.followingId === userId);
  };

  const handleUserClick = (userId: string) => {
    setSearching(false);
    viewProfile(userId);
  };

  return (
    <div className="flex-1 flex flex-col">
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
              <UserCard
                key={user.id}
                user={user}
                isFollowing={isFollowing(user.id)}
                mutualFollowCount={getMutualFollowCount(user.id)}
                onFollow={followUser}
                onUnfollow={unfollowUser}
                onClick={handleUserClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
