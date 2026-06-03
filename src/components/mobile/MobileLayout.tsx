import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@OmarZambranoDev/portfolio-ui';
import { Home, Search, User, Users, Bell, ChevronUp } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import { useSimulationTimers } from '../../hooks/useSimulationTimers';
import { MobileFeedView } from './MobileFeedView';
import { MobileFollowingView } from './MobileFollowingView';
import { MobileProfileView } from './MobileProfileView';
import { MobileSearchView } from './MobileSearchView';
import { MobileNotificationsView } from './MobileNotificationsView';
import { PostDetailView } from '../common/PostDetailView';

type MobileTab = 'feed' | 'profile' | 'following';
type MobileView = 'tabs' | 'search' | 'post-detail' | 'user-profile' | 'notifications';

const HOST_URL = import.meta.env.VITE_HOST_URL || 'http://localhost:3000';

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<MobileTab>('feed');
  const [view, setView] = useState<MobileView>('tabs');

  const navigationStack = useRef<Array<{ view: MobileView; tab: MobileTab }>>([]);

  const mainRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const focusedPostId = useSocialStore((s) => s.focusedPostId);
  const clearFocusedPost = useSocialStore((s) => s.clearFocusedPost);
  const viewedUserId = useSocialStore((s) => s.viewedUserId);
  const currentUserId = useSocialStore((s) => s.currentUserId);
  const isSearching = useSocialStore((s) => s.isSearching);
  const setSearching = useSocialStore((s) => s.setSearching);
  const viewProfile = useSocialStore((s) => s.viewProfile);
  const unreadCount = useSocialStore((s) => s.unreadCount());

  const [showScrollTop, setShowScrollTop] = useState(false);

  useSimulationTimers();

  const showOverlay = view !== 'tabs';

  const pushView = useCallback(
    (newView: MobileView) => {
      navigationStack.current.push({ view, tab: activeTab });
      setView(newView);
    },
    [activeTab, view]
  );

  const popView = useCallback(() => {
    const previous = navigationStack.current.pop();
    if (previous) {
      setView(previous.view);
      setActiveTab(previous.tab);
    } else {
      setView('tabs');
    }
    viewProfile(null);
    clearFocusedPost();
  }, [viewProfile, clearFocusedPost]);

  useEffect(() => {
    const container = showOverlay ? overlayRef.current : mainRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 500);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [view, activeTab, showOverlay]);

  useEffect(() => {
    if (showOverlay) {
      overlayRef.current?.scrollTo(0, 0);
    } else {
      mainRef.current?.scrollTo(0, 0);
    }
  }, [view, activeTab, showOverlay]);

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
    setView('tabs');
    setSearching(false);
    viewProfile(null);
    clearFocusedPost();
    navigationStack.current = [];
  };

  const handleSearchClick = () => {
    pushView('search');
    setSearching(true);
  };

  const handleNotificationsClick = () => {
    if (view === 'notifications') return;

    while (navigationStack.current.length > 0) {
      const top = navigationStack.current[navigationStack.current.length - 1];
      if (top.view === 'notifications') {
        popView();
        return;
      }
      navigationStack.current.pop();
    }

    pushView('notifications');
  };

  const handleHomeClick = () => {
    window.location.href = HOST_URL;
  };

  const handleUserClick = (userId: string) => {
    if (userId === currentUserId) {
      setActiveTab('profile');
      setView('tabs');
      setSearching(false);
      viewProfile(null);
      navigationStack.current = [];
    } else {
      pushView('user-profile');
      viewProfile(userId);
    }
  };

  useEffect(() => {
    if (focusedPostId && view !== 'post-detail') {
      pushView('post-detail');
    }
  }, [focusedPostId, view, pushView]);

  useEffect(() => {
    if (viewedUserId && viewedUserId !== currentUserId && view !== 'user-profile') {
      pushView('user-profile');
    }
  }, [viewedUserId, currentUserId, view, pushView]);

  const handleScrollToTop = () => {
    const container = showOverlay ? overlayRef.current : mainRef.current;
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
      <div className="flex items-center justify-between px-4 py-3 bg-earth-stone/20 backdrop-blur-md border-b border-earth-stone/30">
        <h1 className="text-lg font-bold text-earth-forest">Social</h1>
        <button
          onClick={handleNotificationsClick}
          className="relative p-2 rounded-lg text-earth-moss hover:bg-muted/10"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-earth-burnt rounded-full" />
          )}
        </button>
      </div>

      {showOverlay ? (
        <div ref={overlayRef} className="flex-1 overflow-y-auto">
          {view === 'search' && isSearching && <MobileSearchView />}
          {view === 'post-detail' && focusedPostId && <PostDetailView onBack={popView} />}
          {view === 'user-profile' && viewedUserId && (
            <MobileProfileView userId={viewedUserId} onBack={popView} />
          )}
          {view === 'notifications' && <MobileNotificationsView onBack={popView} />}
        </div>
      ) : (
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {activeTab === 'feed' && <MobileFeedView onUserClick={handleUserClick} />}
          {activeTab === 'following' && <MobileFollowingView onUserClick={handleUserClick} />}
          {activeTab === 'profile' && <MobileProfileView userId={currentUserId} />}
        </main>
      )}

      <nav className="flex items-center justify-around py-2 px-4 bg-white border-t border-earth-stone/30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTabChange('feed')}
          className={`flex-col gap-0.5 px-3 py-1 border-transparent ${
            activeTab === 'feed' && view === 'tabs' ? 'text-primary' : 'text-earth-moss'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Feed</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSearchClick}
          className={`flex-col gap-0.5 px-3 py-1 border-transparent ${
            view === 'search' ? 'text-primary' : 'text-earth-moss'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs">Search</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTabChange('profile')}
          className={`flex-col gap-0.5 px-3 py-1 border-transparent ${
            activeTab === 'profile' && view === 'tabs' ? 'text-primary' : 'text-earth-moss'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTabChange('following')}
          className={`flex-col gap-0.5 px-3 py-1 border-transparent ${
            activeTab === 'following' && view === 'tabs' ? 'text-primary' : 'text-earth-moss'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs">Following</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleHomeClick}
          className="flex-col gap-0.5 px-3 py-1 border-transparent text-earth-moss"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Button>
      </nav>

      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-20 right-4 z-50 w-10 h-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
