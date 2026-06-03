import { ToastProvider } from '@OmarZambranoDev/portfolio-ui';
import { useIsMobile } from './hooks/useIsMobile';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { MobileLayout } from './components/mobile/MobileLayout';

export default function App() {
  const isMobile = useIsMobile();

  return (
    <ToastProvider>
      <div className="h-full">{isMobile ? <MobileLayout /> : <DesktopLayout />}</div>
    </ToastProvider>
  );
}
