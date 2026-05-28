import { useEffect } from 'react';
import { ToastProvider } from '@OmarZambranoDev/portfolio-ui';
import { useSocialStore } from './store/socialStore';
import { Header } from './components/Header';

// We'll build the actual views next — for now, keep the static mock content
// but add the Header and simulation timers

export default function App() {
  const generateRandomPost = useSocialStore((s) => s.generateRandomPost);
  const generateRandomComment = useSocialStore((s) => s.generateRandomComment);
  const generateRandomLike = useSocialStore((s) => s.generateRandomLike);
  const generateRandomFriendAdd = useSocialStore((s) => s.generateRandomFriendAdd);

  // Simulation: new posts every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomPost();
    }, 10000);
    return () => clearInterval(interval);
  }, [generateRandomPost]);

  // Simulation: random comments every 15-25 seconds
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 10000;
      return setTimeout(() => {
        generateRandomComment();
        scheduleNext();
      }, delay);
    };
    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomComment]);

  // Simulation: random likes every 20-35 seconds
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 15000;
      return setTimeout(() => {
        generateRandomLike();
        scheduleNext();
      }, delay);
    };
    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomLike]);

  // Simulation: random friend adds every 45-75 seconds
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 45000 + Math.random() * 30000;
      return setTimeout(() => {
        generateRandomFriendAdd();
        scheduleNext();
      }, delay);
    };
    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomFriendAdd]);

  return (
    <ToastProvider>
      <div className="h-full bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20">
        <div className="max-w-[680px] mx-auto h-full flex flex-col">
          <Header />

          {/* Rest of the app — we'll replace this with real views next */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-earth-moss">
              Store and simulation timers are running. Building views next.
            </p>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
