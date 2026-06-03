import { useSocialStore } from '../../store/socialStore';
import { UserCard } from '../common/UserCard';
import { EmptyState } from '@OmarZambranoDev/portfolio-ui';
import { Users } from 'lucide-react';

interface MobileFollowingViewProps {
  onUserClick: (userId: string) => void;
}

export function MobileFollowingView({ onUserClick }: MobileFollowingViewProps) {
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const follows = useSocialStore((s) => s.follows);
  const users = useSocialStore((s) => s.users);
  const unfollowUser = useSocialStore((s) => s.unfollowUser);
  const followUser = useSocialStore((s) => s.followUser);

  const followingIds = follows
    .filter((f) => f.followerId === currentUserId)
    .map((f) => f.followingId);

  const following = followingIds.map((id) => users[id]).filter(Boolean);

  if (following.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          title="Not following anyone"
          description="When you follow people, they'll appear here."
          icon={Users}
          size="md"
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-2">
      {following.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isFollowing={true}
          onFollow={followUser}
          onUnfollow={unfollowUser}
          onClick={onUserClick}
          clickable={false}
        />
      ))}
    </div>
  );
}
