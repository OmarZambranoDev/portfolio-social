import { useState } from 'react';
import { Avatar, Button, Card, CardContent } from '@OmarZambranoDev/portfolio-ui';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Post, User } from '../../types/social';

interface PostCardProps {
  post: Post;
  author: User | undefined;
  currentUser: User;
  commenters: Record<string, User | undefined>;
  hasLiked: boolean;
  onLike: () => void;
  onAddComment: (content: string) => void;
  onAuthorClick?: (userId: string) => void;
  showCommentsAlways?: boolean;
}

export function PostCard({
  post,
  author,
  currentUser,
  commenters,
  hasLiked,
  onLike,
  onAddComment,
  onAuthorClick,
  showCommentsAlways = false,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(showCommentsAlways);
  const [commentText, setCommentText] = useState('');

  if (!author) return null;

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
      setShowComments(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const effectiveShowComments = showCommentsAlways || showComments;

  return (
    <Card variant="outline" className="border-earth-stone/70">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar
            src={author.avatar}
            alt={author.name}
            size="md"
            className="cursor-pointer flex-shrink-0"
            onClick={() => onAuthorClick?.(author.id)}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAuthorClick?.(author.id)}
                className="font-semibold text-earth-forest text-sm hover:underline text-left"
                aria-label={`View ${author.name}'s profile`}
              >
                {author.name}
              </button>
              <span className="text-xs text-earth-moss flex-shrink-0">
                {formatDistanceToNow(post.timestamp, { addSuffix: true })}
              </span>
            </div>

            {post.content.includes('<a href=') ? (
              <p
                className="text-sm text-earth-forest mt-1 leading-relaxed whitespace-pre-wrap [&_a]:text-earth-sand"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-sm text-earth-forest mt-1 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onLike}
                className={`flex items-center gap-1 border-transparent focus:outline-none focus-visible:ring-0 btn-like ${
                  hasLiked ? 'text-earth-rose' : 'text-earth-moss'
                }`}
              >
                <Heart className="w-4 h-4" fill={hasLiked ? 'currentColor' : 'none'} />
                <span className="text-xs">{post.likes.length}</span>
              </Button>

              {!showCommentsAlways && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                  className={`flex items-center gap-1 border-transparent focus:outline-none focus-visible:ring-0 ${
                    showComments ? 'text-primary' : 'text-earth-moss hover:text-primary'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments.length}</span>
                  {post.comments.length > 0 &&
                    (showComments ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    ))}
                </Button>
              )}

              {showCommentsAlways && (
                <div className="flex items-center gap-1 text-xs text-earth-moss">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments.length}</span>
                </div>
              )}
            </div>

            {effectiveShowComments && (
              <div className="mt-3 pt-3 border-t border-earth-stone/20 space-y-3">
                {post.comments.length === 0 ? (
                  <p className="text-xs text-earth-moss">No comments yet.</p>
                ) : (
                  post.comments.map((comment) => {
                    const commenter = commenters[comment.userId];
                    if (!commenter) return null;

                    return (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar
                          src={commenter.avatar}
                          alt={commenter.name}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-earth-forest">
                            {commenter.name}
                          </span>
                          <span className="text-xs text-earth-moss ml-2">
                            {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                          </span>
                          <p className="text-sm text-earth-forest mt-0.5">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}

                <div className="flex gap-2">
                  <Avatar
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    size="sm"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a comment..."
                      className="flex-1 text-sm rounded-lg border border-earth-stone/40 px-3 py-1.5 text-earth-forest placeholder:text-earth-moss/60 focus:outline-none focus:border-primary/50"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
