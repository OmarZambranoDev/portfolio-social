import { useState } from 'react';
import { Avatar, Button, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import type { User } from '../../types/social';

interface MutualFriendsListProps {
  mutualFriends: User[];
  onFriendClick: (userId: string) => void;
}

export function MutualFriendsList({ mutualFriends, onFriendClick }: MutualFriendsListProps) {
  const [expanded, setExpanded] = useState(false);

  if (mutualFriends.length === 0) return null;

  return (
    <Card variant="outline" className="border-earth-stone/70">
      <CardContent className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between border-transparent"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-earth-sage" />
            <span className="text-sm font-semibold text-earth-forest">
              {mutualFriends.length} mutual friend{mutualFriends.length !== 1 ? 's' : ''}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-earth-moss" />
          ) : (
            <ChevronDown className="w-4 h-4 text-earth-moss" />
          )}
        </Button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-earth-stone/20 space-y-2">
            {mutualFriends.map((friend) => (
              <Button
                key={friend.id}
                variant="outline"
                size="sm"
                onClick={() => onFriendClick(friend.id)}
                className="w-full flex items-center gap-2 p-1 border-transparent justify-start"
              >
                <Avatar src={friend.avatar} alt={friend.name} size="sm" className="flex-shrink-0" />
                <span className="text-sm text-earth-forest">{friend.name}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
