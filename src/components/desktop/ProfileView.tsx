import { useSocialStore } from '../../store/socialStore';
import { usePostCard } from '../../hooks/usePostCard';
import { ProfileHeader } from '../common/ProfileHeader';
import { MutualFollowsList } from '../common/MutualFollowsList';
import { PostCard } from '../common/PostCard';
import { NewPostInput } from '../common/NewPostInput';
import { ChevronLeft } from 'lucide-react';

interface ProfileViewProps {
  userId: string;
  showBack?: boolean;
}

export function ProfileView({ userId, showBack = false }: ProfileViewProps) {
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const allPosts = useSocialStore((s) => s.posts);
  const follows = useSocialStore((s) => s.follows);
  const getUserById = useSocialStore((s) => s.getUserById);
  const getMutualFollows = useSocialStore((s) => s.getMutualFollows);
  const followUser = useSocialStore((s) => s.followUser);
  const unfollowUser = useSocialStore((s) => s.unfollowUser);
  const updateBio = useSocialStore((s) => s.updateBio);
  const viewProfile = useSocialStore((s) => s.viewProfile);

  const user = getUserById(userId);
  if (!user) return null;

  const isCurrentUser = userId === currentUserId;

  // Reactive subscription — re-renders when follows change
  const isFollowing = follows.some(
    (f) => f.followerId === currentUserId && f.followingId === userId
  );

  const mutualFollows = getMutualFollows(userId);
  const userPosts = allPosts.filter((p) => p.userId === userId);

  return (
    <div className="flex-1 flex flex-col">
      {showBack && (
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => viewProfile(null)}
            className="flex items-center gap-1 text-sm text-earth-moss hover:text-earth-forest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <ProfileHeader
          user={user}
          isCurrentUser={isCurrentUser}
          isFollowing={isFollowing}
          onFollow={() => followUser(userId)}
          onUnfollow={() => unfollowUser(userId)}
          onUpdateBio={updateBio}
        />

        {!isCurrentUser && (
          <MutualFollowsList mutualFollows={mutualFollows} onUserClick={viewProfile} />
        )}

        {isCurrentUser && <NewPostInput />}

        {userPosts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-earth-forest px-1">Posts</h3>
            {userPosts.map((post) => (
              <ProfilePostItem key={post.id} post={post} />
            ))}
          </div>
        )}

        {userPosts.length === 0 && (
          <p className="text-sm text-earth-moss text-center py-8">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

function ProfilePostItem({
  post,
}: {
  post: ReturnType<typeof useSocialStore.getState>['posts'][number];
}) {
  const viewProfile = useSocialStore((s) => s.viewProfile);
  const { author, currentUser, commenters, hasLiked, handleLike, handleAddComment } =
    usePostCard(post);

  if (!author) return null;

  return (
    <PostCard
      post={post}
      author={author}
      currentUser={currentUser}
      commenters={commenters}
      hasLiked={hasLiked}
      onLike={handleLike}
      onAddComment={handleAddComment}
      onAuthorClick={viewProfile}
    />
  );
}
