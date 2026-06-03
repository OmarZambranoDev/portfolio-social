import { useSocialStore } from '../../store/socialStore';
import { ChevronLeft, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MobileNotificationsViewProps {
  onBack: () => void;
}

export function MobileNotificationsView({ onBack }: MobileNotificationsViewProps) {
  const notifications = useSocialStore((s) => s.notifications);
  const markAllNotificationsRead = useSocialStore((s) => s.markAllNotificationsRead);
  const removeNotification = useSocialStore((s) => s.removeNotification);
  const handleNotificationClick = useSocialStore((s) => s.handleNotificationClick);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-earth-rose" fill="currentColor" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-earth-sage" />;
      default:
        return null;
    }
  };

  const handleClick = (notification: (typeof notifications)[number]) => {
    handleNotificationClick({ id: notification.id });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-earth-stone/30">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-earth-moss hover:text-earth-forest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-lg font-bold text-earth-forest">Notifications</h2>
        <button
          onClick={markAllNotificationsRead}
          className="text-sm text-primary hover:text-primary-hover"
        >
          Mark all read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-earth-moss text-center py-12">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleClick(notification)}
              className={`w-full flex items-start gap-3 p-4 border-b border-earth-stone/20 hover:bg-muted/10 transition-colors text-left ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {notification.icon || getIcon(notification._type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-earth-forest">{notification.message}</p>
                <p className="text-xs text-earth-moss mt-0.5">
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="text-earth-moss hover:text-earth-forest flex-shrink-0"
              >
                ✕
              </button>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
