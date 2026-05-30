import { useState } from 'react';
import { Avatar, Button, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import type { User } from '../../types/social';

interface MutualFollowsListProps {
  mutualFollows: User[];
  onUserClick: (userId: string) => void;
}

export function MutualFollowsList({ mutualFollows, onUserClick }: MutualFollowsListProps) {
  const [expanded, setExpanded] = useState(false);

  if (mutualFollows.length === 0) return null;

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
              {mutualFollows.length} mutual follow{mutualFollows.length !== 1 ? 's' : ''}
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
            {mutualFollows.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                onClick={() => onUserClick(user.id)}
                className="w-full flex items-center gap-2 p-1 border-transparent justify-start"
              >
                <Avatar src={user.avatar} alt={user.name} size="sm" className="flex-shrink-0" />
                <span className="text-sm text-earth-forest">{user.name}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
