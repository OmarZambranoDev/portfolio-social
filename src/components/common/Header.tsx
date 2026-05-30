import { NotificationCenter } from '@OmarZambranoDev/portfolio-ui';
import { Search } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';

interface HeaderProps {
  onSearchClick: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
  const uiNotifications = useSocialStore((state) => state.getUINotifications());
  const handleNotificationClick = useSocialStore((state) => state.handleNotificationClick);
  const markAllNotificationsRead = useSocialStore((state) => state.markAllNotificationsRead);
  const removeNotification = useSocialStore((state) => state.removeNotification);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-earth-stone/30">
      <h1 className="text-xl font-bold text-earth-forest">Social</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchClick}
          className="p-2 rounded-lg text-earth-moss hover:bg-muted/10"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        <NotificationCenter
          notifications={uiNotifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllRead={markAllNotificationsRead}
          onRemove={removeNotification}
          dotColor="bg-earth-burnt"
        />
      </div>
    </div>
  );
}
