import { Avatar, Button, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { UserPlus, UserX } from 'lucide-react';
import type { User } from '../../types/social';

interface UserCardProps {
  user: User;
  isFollowing: boolean;
  mutualFollowCount?: number;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onClick: (userId: string) => void;
  showFollowButton?: boolean;
  clickable?: boolean;
}

export function UserCard({
  user,
  isFollowing,
  mutualFollowCount,
  onFollow,
  onUnfollow,
  onClick,
  showFollowButton = true,
  clickable = true,
}: UserCardProps) {
  return (
    <Card
      variant="outline"
      clickable={clickable}
      onClick={() => onClick(user.id)}
      className="border-earth-stone/70"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={user.avatar} alt={user.name} size="md" className="flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-earth-forest text-sm">{user.name}</p>
              <p className="text-xs text-earth-moss mt-0.5 line-clamp-1">{user.bio}</p>
              {mutualFollowCount !== undefined && mutualFollowCount > 0 && (
                <p className="text-xs text-earth-sage mt-0.5">
                  {mutualFollowCount} mutual follow
                  {mutualFollowCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {showFollowButton && (
            <div onClick={(e) => e.stopPropagation()}>
              {isFollowing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUnfollow(user.id)}
                  className={`flex items-center gap-1 border-earth-stone/40 flex-shrink-0 ml-3 ${
                    clickable
                      ? 'text-earth-moss hover:text-red-600 hover:border-red-300'
                      : 'text-earth-moss'
                  }`}
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span className="text-xs">Unfollow</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onFollow(user.id)}
                  className="flex items-center gap-1 flex-shrink-0 ml-3"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="text-xs">Follow</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
