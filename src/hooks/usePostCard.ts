import { useSocialStore } from '../store/socialStore';
import type { Post, User } from '../types/social';

interface PostCardData {
  author: User | undefined;
  currentUser: User;
  commenters: Record<string, User | undefined>;
  hasLiked: boolean;
  handleLike: () => void;
  handleAddComment: (content: string) => void;
}

export function usePostCard(post: Post): PostCardData {
  const author = useSocialStore((s) => s.getUserById(post.userId));
  const currentUser = useSocialStore((s) => s.getCurrentUser());
  const hasLiked = useSocialStore((s) => s.hasLiked(post.id));
  const toggleLike = useSocialStore((s) => s.toggleLike);
  const addComment = useSocialStore((s) => s.addComment);
  const getUserById = useSocialStore((s) => s.getUserById);

  const commenters: Record<string, User | undefined> = {};
  post.comments.forEach((c) => {
    if (!commenters[c.userId]) {
      commenters[c.userId] = getUserById(c.userId);
    }
  });

  return {
    author,
    currentUser,
    commenters,
    hasLiked,
    handleLike: () => toggleLike(post.id),
    handleAddComment: (content: string) => addComment(post.id, content),
  };
}
