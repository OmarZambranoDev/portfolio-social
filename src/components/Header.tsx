import { NotificationCenter } from '@OmarZambranoDev/portfolio-ui';
import { useSocialStore } from '../store/socialStore';

export function Header() {
  const uiNotifications = useSocialStore((state) => state.getUINotifications());
  const handleNotificationClick = useSocialStore((state) => state.handleNotificationClick);
  const markAllNotificationsRead = useSocialStore((state) => state.markAllNotificationsRead);
  const removeNotification = useSocialStore((state) => state.removeNotification);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-earth-stone/30">
      <h1 className="text-xl font-bold text-earth-forest">Social</h1>
      <NotificationCenter
        notifications={uiNotifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={markAllNotificationsRead}
        onRemove={removeNotification}
        dotColor="bg-earth-burnt"
      />
    </div>
  );
}
