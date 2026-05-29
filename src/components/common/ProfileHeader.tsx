import { useState } from 'react';
import { Avatar, Button, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { UserPlus, UserX, Edit3, Check, X } from 'lucide-react';
import type { User } from '../../types/social';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  isFriend: boolean;
  onAddFriend: () => void;
  onRemoveFriend: () => void;
  onUpdateBio: (bio: string) => void;
}

export function ProfileHeader({
  user,
  isCurrentUser,
  isFriend,
  onAddFriend,
  onRemoveFriend,
  onUpdateBio,
}: ProfileHeaderProps) {
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(user.bio);

  const handleSaveBio = () => {
    if (bioDraft.trim()) {
      onUpdateBio(bioDraft.trim());
    }
    setEditingBio(false);
  };

  const handleCancelBio = () => {
    setBioDraft(user.bio);
    setEditingBio(false);
  };

  return (
    <Card variant="outline" className="border-earth-stone/70">
      <CardContent className="p-6 text-center">
        <Avatar src={user.avatar} alt={user.name} size="xl" className="mx-auto" />

        <h2 className="text-xl font-bold text-earth-forest mt-3">{user.name}</h2>

        {editingBio ? (
          <div className="mt-3 max-w-md mx-auto">
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-earth-stone/40 p-3 text-sm text-earth-forest focus:outline-none focus:border-primary/50"
              autoFocus
            />
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveBio}
                disabled={!bioDraft.trim()}
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelBio}>
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 max-w-md mx-auto">
            <p className="text-sm text-earth-moss leading-relaxed">{user.bio}</p>
            {isCurrentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBioDraft(user.bio);
                  setEditingBio(true);
                }}
                className="mt-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Bio
              </Button>
            )}
          </div>
        )}

        {!isCurrentUser && !editingBio && (
          <div className="mt-4">
            {isFriend ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onRemoveFriend}
                className="border-earth-stone/40 text-earth-moss hover:text-red-600 hover:border-red-300"
              >
                <UserX className="w-3.5 h-3.5" />
                Remove Friend
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onAddFriend}>
                <UserPlus className="w-3.5 h-3.5" />
                Add Friend
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
