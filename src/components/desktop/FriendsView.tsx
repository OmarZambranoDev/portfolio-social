import { useSocialStore } from '../../store/socialStore';
import { FriendCard } from '../common/FriendCard';
import { EmptyState } from '@OmarZambranoDev/portfolio-ui';
import { Users } from 'lucide-react';

export function FriendsView() {
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const getFriendsForUser = useSocialStore((s) => s.getFriendsForUser);
  const getMutualFriendCount = useSocialStore((s) => s.getMutualFriendCount);
  const removeFriend = useSocialStore((s) => s.removeFriend);
  const viewProfile = useSocialStore((s) => s.viewProfile);

  const friends = getFriendsForUser(currentUserId);

  const handleRemove = (userId: string) => {
    removeFriend(userId);
  };

  const handleProfileClick = (userId: string) => {
    viewProfile(userId);
  };

  if (friends.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          title="No friends yet"
          description="When you add friends, they'll appear here."
          icon={Users}
          size="md"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          mutualCount={getMutualFriendCount(friend.id)}
          onRemove={handleRemove}
          onProfileClick={handleProfileClick}
        />
      ))}
    </div>
  );
}
