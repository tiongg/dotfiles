import iconPath from '@/utils/icon-path';
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';
import { type Notification as NotificationType } from 'types/service/notifications';
import IconButton from '../IconButton';
import Notification from './Notification';

const notifications = await Service.import('notifications');
const notifs = notifications.bind('notifications');

const hasNoNotifs = notifs.as((notifList) => notifList.length === 0);
const hasNotifs = notifs.as((notifList) => notifList.length > 0);

function Animated(notif: NotificationType) {
  return Widget.Revealer({
    transitionDuration: 200,
    transition: 'crossfade',
    child: Notification(notif),
    setup: (self) =>
      Utils.timeout(200, () => {
        if (!self.is_destroyed) self.reveal_child = true;
      }),
  });
}

function NotificationsHeader() {
  return Widget.Box({
    className: 'notifications-header',
    vertical: false,
    homogeneous: true,
    hexpand: hasNotifs,
    visible: hasNotifs,
    children: [
      Widget.Label({
        label: 'Notifications',
        halign: Align.START,
      }),
      IconButton({
        halign: Align.END,
        onClicked: () => notifications.clear(),
        icon: 'cross-filled',
      }),
    ],
  });
}

/**
 * Empty state for notifications
 */
function EmptyNotificationsList() {
  return Widget.Box({
    className: 'empty-notifications',
    vertical: true,
    hexpand: true,
    vexpand: hasNoNotifs,
    valign: Align.CENTER,
    visible: hasNoNotifs,
    spacing: 8,
    children: [
      Widget.Icon({
        icon: iconPath('tick-filled'),
      }),
      Widget.Label('All caught up!'),
    ],
  });
}

/**
 * List of all notifications
 */
function NotificationsList() {
  const notifMap = new Map<number, ReturnType<typeof Animated>>();

  const remove = (_: unknown, id?: number) => {
    if (id === undefined) return;
    const notif = notifMap.get(id);
    if (!notif) {
      console.warn('[Notifications]: Notification not found', id);
      return;
    }
    notif.reveal_child = false;
    Utils.timeout(0, () => {
      notif.destroy();
      notifMap.delete(id);
    });
  };

  const list = Widget.Box({
    vertical: true,
    vexpand: hasNotifs,
    className: 'notifications-list',
    visible: hasNotifs,
    spacing: 8,
    children: notifications.notifications.map((notif) => {
      notifMap.set(notif.id, Animated(notif));
      return notifMap.get(notif.id)!;
    }),
  });

  return list.hook(notifications, remove, 'closed').hook(
    notifications,
    (_, id) => {
      if (id === undefined) return;
      if (notifMap.has(id)) remove(null, id);
      const notif = notifications.getNotification(id);
      if (!notif) return;
      const newNotif = Animated(notif);
      notifMap.set(id, newNotif);
      list.children = [newNotif, ...list.children];
    },
    'notified'
  );
}

/**
 * List of all notifications.
 *
 * Includes a header, a list of notifications and an empty state.
 */
export default function NotificationList() {
  const NotificationListOrEmpty = Widget.Box({
    children: [NotificationsList(), EmptyNotificationsList()],
  });

  return Widget.Box({
    vertical: true,
    vexpand: true,
    className: 'notifications-list',
    spacing: 8,
    children: [
      NotificationsHeader(),
      Widget.Scrollable({
        vexpand: true,
        hscroll: 'never',
        vscroll: 'external',
        overlayScrolling: true,
        child: NotificationListOrEmpty,
      }),
    ],
  });
}
