import { useEffect, useState, useCallback } from 'react';
import { ToastProvider, Tabs, TabsList, TabsTrigger } from '@OmarZambranoDev/portfolio-ui';
import { ChevronUp } from 'lucide-react';
import { useSocialStore } from './store/socialStore';
import { Header } from './components/common/Header';
import { FeedView } from './components/desktop/FeedView';
import { FollowingView } from './components/desktop/FollowingView';
import { ProfileView } from './components/desktop/ProfileView';
import { SearchView } from './components/desktop/SearchView';
import { PostDetailView } from './components/common/PostDetailView';

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

export default function App() {
  const activeTab = useSocialStore((s) => s.activeTab);
  const setActiveTab = useSocialStore((s) => s.setActiveTab);
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const viewedUserId = useSocialStore((s) => s.viewedUserId);
  const isSearching = useSocialStore((s) => s.isSearching);
  const focusedPostId = useSocialStore((s) => s.focusedPostId);
  const setSearching = useSocialStore((s) => s.setSearching);

  const generateRandomPost = useSocialStore((s) => s.generateRandomPost);
  const generateRandomComment = useSocialStore((s) => s.generateRandomComment);
  const generateRandomLike = useSocialStore((s) => s.generateRandomLike);
  const generateRandomFollow = useSocialStore((s) => s.generateRandomFollow);

  const showScrollTop = useFeedScrollState();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      feedScrollState.top = window.scrollY;
      feedScrollState.listener?.();
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // Simulation: new posts every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomPost();
    }, 10000);
    return () => clearInterval(interval);
  }, [generateRandomPost]);

  // Simulation: random comments every 15-25 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 10000;
      timeout = setTimeout(() => {
        generateRandomComment();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomComment]);

  // Simulation: random likes every 20-35 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 15000;
      timeout = setTimeout(() => {
        generateRandomLike();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomLike]);

  // Simulation: random follows every 45-75 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      const delay = 45000 + Math.random() * 30000;
      timeout = setTimeout(() => {
        generateRandomFollow();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomFollow]);

  const showOverlay =
    (viewedUserId !== null && viewedUserId !== currentUserId) ||
    isSearching ||
    focusedPostId !== null;

  const handleScrollToTop = useCallback(() => {
    let current = document.querySelector('[data-feed-scroll]')?.parentElement;
    while (current) {
      if (current.scrollHeight > current.clientHeight) {
        current.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      current = current.parentElement;
    }
  }, []);

  return (
    <ToastProvider>
      <div className="h-full bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
        <div className="max-w-[680px] mx-auto h-full flex flex-col">
          <div
            className={`sticky top-0 z-30 bg-earth-stone/20 backdrop-blur-md ${hasScrolled ? 'rounded-b-xl shadow-md' : ''}`}
          >
            <Header onSearchClick={() => setSearching(true)} />
          </div>

          {showOverlay ? (
            <>
              {focusedPostId !== null && <PostDetailView />}
              {viewedUserId !== null &&
                viewedUserId !== currentUserId &&
                focusedPostId === null && <ProfileView userId={viewedUserId} showBack />}
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
    </ToastProvider>
  );
}
