import { useEffect, useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@OmarZambranoDev/portfolio-ui';
import { ChevronUp } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { useSimulationTimers } from '../../hooks/useSimulationTimers';
import { Header } from '../common/Header';
import { FeedView } from './FeedView';
import { FollowingView } from './FollowingView';
import { ProfileView } from './ProfileView';
import { SearchView } from './SearchView';
import { PostDetailView } from '../common/PostDetailView';

const feedScrollState = {
  top: 0,
  listener: null as (() => void) | null,
  scrollContainerRef: null as HTMLDivElement | null,
};

function useFeedScrollState() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    feedScrollState.listener = () => {
      setShowScrollTop(feedScrollState.top > 500);
    };
    return () => {
      feedScrollState.listener = null;
    };
  }, []);

  return showScrollTop;
}

export function DesktopLayout() {
  const activeTab = useSocialStore((s) => s.activeTab);
  const setActiveTab = useSocialStore((s) => s.setActiveTab);
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const viewedUserId = useSocialStore((s) => s.viewedUserId);
  const isSearching = useSocialStore((s) => s.isSearching);
  const focusedPostId = useSocialStore((s) => s.focusedPostId);
  const setSearching = useSocialStore((s) => s.setSearching);

  const showScrollTop = useFeedScrollState();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  useSimulationTimers();

  useEffect(() => {
    if (!scrollContainer) return;

    feedScrollState.scrollContainerRef = scrollContainer;

    const handleScroll = () => {
      feedScrollState.top = scrollContainer.scrollTop;
      feedScrollState.listener?.();
      setHasScrolled(scrollContainer.scrollTop > 0);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  const showOverlay =
    (viewedUserId !== null && viewedUserId !== currentUserId) ||
    isSearching ||
    focusedPostId !== null;

  const handleScrollToTop = useCallback(() => {
    feedScrollState.scrollContainerRef?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={setScrollContainer}
      className="h-full overflow-y-auto bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20"
    >
      <div className="max-w-[680px] mx-auto min-h-full flex flex-col">
        <div
          className={`sticky top-0 z-30 bg-earth-stone/20 backdrop-blur-md ${hasScrolled ? 'rounded-b-xl shadow-md' : ''}`}
        >
          <Header onSearchClick={() => setSearching(true)} />
        </div>

        {showOverlay ? (
          <>
            {focusedPostId !== null && <PostDetailView />}
            {viewedUserId !== null && viewedUserId !== currentUserId && focusedPostId === null && (
              <ProfileView userId={viewedUserId} showBack />
            )}
            {isSearching && focusedPostId === null && <SearchView />}
          </>
        ) : (
          <>
            <div className="px-4 pt-4 pb-2 border-b border-earth-stone/30 bg-earth-stone/20 backdrop-blur-md rounded-b-xl">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'feed' | 'following' | 'profile')}
              >
                <TabsList variant="underline">
                  <TabsTrigger variant="underline" value="feed">
                    Feed
                  </TabsTrigger>
                  <TabsTrigger variant="underline" value="profile">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger variant="underline" value="following">
                    Following
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {activeTab === 'feed' && <FeedView scrollState={feedScrollState} />}
            {activeTab === 'following' && <FollowingView />}
            {activeTab === 'profile' && <ProfileView userId={currentUserId} />}
          </>
        )}
      </div>

      {showScrollTop && activeTab === 'feed' && !showOverlay && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-hover transition-all"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
