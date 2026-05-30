import { useSocialStore } from '../../store/socialStore';
import { usePostCard } from '../../hooks/usePostCard';
import { PostCard } from './PostCard';
import { ChevronLeft } from 'lucide-react';

export function PostDetailView() {
  const focusedPostId = useSocialStore((s) => s.focusedPostId);
  const clearFocusedPost = useSocialStore((s) => s.clearFocusedPost);
  const allPosts = useSocialStore((s) => s.posts);
  const viewProfile = useSocialStore((s) => s.viewProfile);

  if (!focusedPostId) return null;

  const post = allPosts.find((p) => p.id === focusedPostId);
  if (!post) return null;

  const PostContent = () => {
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
        showCommentsAlways
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={clearFocusedPost}
          className="flex items-center gap-1 text-sm text-earth-moss hover:text-earth-forest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <PostContent />
      </div>
    </div>
  );
}
