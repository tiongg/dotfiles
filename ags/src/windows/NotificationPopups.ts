import Notification from '@/components/notifications/Notification';
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';
import { type Notification as NotificationType } from 'types/service/notifications';

const notifications = await Service.import('notifications');
const notifs = notifications.bind('notifications');

function Animated(notif: NotificationType) {
  return Widget.Revealer({
    transitionDuration: 200,
    transition: 'crossfade',
    child: Notification(notif),
    setup: (self) => {
      Utils.timeout(200, () => {
        if (!self.is_destroyed) self.reveal_child = true;
      });
    },
  });
}

/**
 * List of popup notifications.
 *
 * Slightly different from the control center version
 */
function NotificationsList() {
  const notifMap = new Map<number, ReturnType<typeof Animated>>();
  const remove = (_: unknown, id?: number) => {
    if (id === undefined) return;
    const notif = notifMap.get(id);
    // Closed or dismissed already
    if (!notif) return;
    notif.reveal_child = false;
    Utils.timeout(10, () => {
      notif.destroy();
      notifMap.delete(id);
    });
  };

  const list = Widget.Box({
    vertical: true,
    vexpand: true,
    widthRequest: 300,
    className: 'notifications-list',
    spacing: 8,
    valign: Align.START,
    children: notifications.popups.map((notif) => {
      notifMap.set(notif.id, Animated(notif));
      return notifMap.get(notif.id)!;
    }),
  });

  return list
    .hook(notifications, remove, 'closed')
    .hook(notifications, remove, 'dismissed')
    .hook(
      notifications,
      (_, id) => {
        if (id === undefined) return;
        if (notifMap.has(id)) remove(null, id);
        const notif = notifications.getPopup(id);
        if (!notif) return;
        const newNotif = Animated(notif);
        notifMap.set(id, newNotif);
        list.children = [newNotif, ...list.children].slice(0, 4);
      },
      'notified'
    );
}

/**
 * Window for notification popups.
 */
export default function NotificationPopups() {
  return Widget.Window({
    name: 'notification-popups',
    anchor: ['top', 'right'],
    vexpand: true,
    vexpandSet: true,
    layer: 'top',
    exclusivity: 'exclusive',
    child: NotificationsList(),
  });
}
