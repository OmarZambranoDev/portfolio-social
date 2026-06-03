import { useEffect } from 'react';
import { useSocialStore } from '../store/socialStore';

export function useSimulationTimers() {
  const generateRandomPost = useSocialStore((s) => s.generateRandomPost);
  const generateRandomComment = useSocialStore((s) => s.generateRandomComment);
  const generateRandomLike = useSocialStore((s) => s.generateRandomLike);
  const generateRandomFollow = useSocialStore((s) => s.generateRandomFollow);

  // New posts every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => generateRandomPost(), 15000);
    return () => clearInterval(interval);
  }, [generateRandomPost]);

  // Random comments every 15-25 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      // const delay = 15000 + Math.random() * 10000;
      const delay = 1000;
      timeout = setTimeout(() => {
        generateRandomComment();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomComment]);

  // Random likes every 20-35 seconds
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

  // Random follows every 45-75 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      // const delay = 45000 + Math.random() * 30000;
      const delay = 1000;
      timeout = setTimeout(() => {
        generateRandomFollow();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
  }, [generateRandomFollow]);
}
