import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocialStore } from '../../store/socialStore';
import { usePostCard } from '../../hooks/usePostCard';
import { PostCard } from '../common/PostCard';
import { NewPostInput } from '../common/NewPostInput';
import type { Post } from '../../types/social';

const POSTS_PER_PAGE = 10;

interface FeedViewProps {
  scrollState?: {
    top: number;
    listener: (() => void) | null;
    scrollContainerRef: HTMLDivElement | null;
  };
}

export function FeedView({ scrollState }: FeedViewProps) {
  const allPosts = useSocialStore((s) => s.posts);
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const follows = useSocialStore((s) => s.follows);
  const scrollTargetPostId = useSocialStore((s) => s.scrollTargetPostId);
  const clearScrollTarget = useSocialStore((s) => s.clearScrollTarget);
  const viewProfile = useSocialStore((s) => s.viewProfile);

  // Compute followed user IDs (reactive)
  const followingIds = new Set(
    follows.filter((f) => f.followerId === currentUserId).map((f) => f.followingId)
  );

  // Filter all posts to only show followed users + own posts
  const relevantPosts = allPosts.filter(
    (p) => p.userId === currentUserId || followingIds.has(p.userId)
  );

  const visiblePostsRef = useRef<Post[]>([]);
  const pendingRef = useRef<Post[]>([]);
  const displayedCountRef = useRef(POSTS_PER_PAGE);
  const initializedRef = useRef(false);
  const prevRelevantPostsLength = useRef(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [, setRenderTick] = useState(0);
  const rerender = () => setRenderTick((t) => t + 1);

  const [newPostsCount, setNewPostsCount] = useState(0);

  useEffect(() => {
    if (scrollState && scrollContainerRef.current) {
      scrollState.scrollContainerRef = scrollContainerRef.current;
    }
  }, [scrollState]);

  // Initialize ONCE
  if (!initializedRef.current && relevantPosts.length > 0) {
    visiblePostsRef.current = relevantPosts.slice(0, POSTS_PER_PAGE);
    prevRelevantPostsLength.current = relevantPosts.length;
    initializedRef.current = true;
  }

  // Sync visible posts with store when comments/likes change
  useEffect(() => {
    if (!initializedRef.current) return;

    const updatedPosts = visiblePostsRef.current.map((vp) => {
      const storePost = allPosts.find((ap) => ap.id === vp.id);
      return storePost || vp;
    });

    const hasChanges = updatedPosts.some(
      (p, i) =>
        p.likes.length !== visiblePostsRef.current[i].likes.length ||
        p.comments.length !== visiblePostsRef.current[i].comments.length
    );

    if (hasChanges) {
      visiblePostsRef.current = updatedPosts;
      rerender();
    }
  }, [allPosts]);

  // Watch for new posts
  useEffect(() => {
    if (!initializedRef.current) return;

    const diff = relevantPosts.length - prevRelevantPostsLength.current;
    if (diff <= 0) return;

    const visibleIds = new Set(visiblePostsRef.current.map((p) => p.id));
    const pendingIds = new Set(pendingRef.current.map((p) => p.id));
    const newPosts = relevantPosts
      .slice(0, diff)
      .filter((p) => !visibleIds.has(p.id) && !pendingIds.has(p.id));

    if (newPosts.length === 0) {
      prevRelevantPostsLength.current = relevantPosts.length;
      return;
    }

    const ownPosts = newPosts.filter((p) => p.userId === currentUserId);
    const otherPosts = newPosts.filter((p) => p.userId !== currentUserId);

    if (ownPosts.length > 0) {
      visiblePostsRef.current = [...ownPosts, ...visiblePostsRef.current];
    }

    if (otherPosts.length > 0) {
      pendingRef.current = [...otherPosts, ...pendingRef.current];
      setNewPostsCount(pendingRef.current.length);
    }

    prevRelevantPostsLength.current = relevantPosts.length;
    rerender();
  }, [relevantPosts.length, relevantPosts, currentUserId]);

  // Infinite scroll
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCountRef.current < relevantPosts.length) {
          const nextCount = displayedCountRef.current + POSTS_PER_PAGE;
          visiblePostsRef.current = relevantPosts.slice(0, nextCount);
          displayedCountRef.current = nextCount;
          rerender();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [relevantPosts]);

  // Scroll to target post
  useEffect(() => {
    if (!scrollTargetPostId) return;

    const postIndex = allPosts.findIndex((p) => p.id === scrollTargetPostId);
    if (postIndex >= 0) {
      if (postIndex >= displayedCountRef.current) {
        const nextCount = postIndex + 1;
        visiblePostsRef.current = allPosts.slice(0, nextCount);
        displayedCountRef.current = nextCount;
        pendingRef.current = [];
        setNewPostsCount(0);
        rerender();
      }
      setTimeout(() => {
        const el = document.getElementById(`post-${scrollTargetPostId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
    clearScrollTarget();
  }, [scrollTargetPostId, allPosts, clearScrollTarget]);

  const handleShowNewPosts = useCallback(() => {
    visiblePostsRef.current = [...pendingRef.current, ...visiblePostsRef.current];
    pendingRef.current = [];
    setNewPostsCount(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    rerender();
  }, []);

  const visiblePosts = visiblePostsRef.current;
  const hasMorePosts = displayedCountRef.current < relevantPosts.length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div ref={scrollContainerRef} data-feed-scroll className="flex-1 px-4 py-4 space-y-4">
        {newPostsCount > 0 && (
          <button
            onClick={handleShowNewPosts}
            className="sticky top-0 z-10 w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-md"
          >
            {newPostsCount} new post{newPostsCount !== 1 ? 's' : ''} — tap to see
          </button>
        )}

        <NewPostInput />

        {visiblePosts.map((post) => (
          <FeedPostItem key={post.id} post={post} onAuthorClick={(userId) => viewProfile(userId)} />
        ))}

        <div ref={loaderRef} className="flex items-center justify-center py-6">
          {hasMorePosts ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-earth-moss">Loading more posts...</span>
            </div>
          ) : visiblePosts.length > 0 ? (
            <span className="text-sm text-earth-moss">You're all caught up!</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FeedPostItem({
  post,
  onAuthorClick,
}: {
  post: Post;
  onAuthorClick: (userId: string) => void;
}) {
  const { author, currentUser, commenters, hasLiked, handleLike, handleAddComment } =
    usePostCard(post);

  if (!author) return null;

  return (
    <div id={`post-${post.id}`}>
      <PostCard
        post={post}
        author={author}
        currentUser={currentUser}
        commenters={commenters}
        hasLiked={hasLiked}
        onLike={handleLike}
        onAddComment={handleAddComment}
        onAuthorClick={onAuthorClick}
      />
    </div>
  );
}
