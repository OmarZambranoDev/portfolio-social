import { Avatar, Button, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { UserX } from 'lucide-react';
import type { User } from '../../types/social';

interface FollowingCardProps {
  user: User;
  onUnfollow: (userId: string) => void;
  onProfileClick: (userId: string) => void;
}

export function FollowingCard({ user, onUnfollow, onProfileClick }: FollowingCardProps) {
  return (
    <Card variant="outline" className="border-earth-stone/70">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="md"
              className="cursor-pointer flex-shrink-0"
              onClick={() => onProfileClick(user.id)}
            />
            <div className="min-w-0">
              <button
                onClick={() => onProfileClick(user.id)}
                className="font-semibold text-earth-forest text-sm hover:underline text-left"
              >
                {user.name}
              </button>
              <p className="text-xs text-earth-moss mt-0.5 line-clamp-1">{user.bio}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUnfollow(user.id)}
            className="flex items-center gap-1 border-earth-stone/40 text-earth-moss hover:text-red-600 hover:border-red-300 flex-shrink-0 ml-3"
          >
            <UserX className="w-3.5 h-3.5" />
            <span className="text-xs">Unfollow</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
