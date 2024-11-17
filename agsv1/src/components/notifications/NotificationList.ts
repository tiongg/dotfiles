import Gtk from 'gi://Gtk?version=3.0';
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
        halign: Gtk.Align.START,
      }),
      IconButton({
        halign: Gtk.Align.END,
        onClicked: () => notifications.clear(),
        icon: 'cross-filled-symbolic',
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
    valign: Gtk.Align.CENTER,
    visible: hasNoNotifs,
    spacing: 8,
    children: [
      Widget.Icon({
        icon: 'tick-filled-symbolic',
      }),
      Widget.Label('All caught up!'),
    ],
  });
}

/**
 * List of all notifications. No empty state
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
    className: 'notifications-list',
    vertical: true,
    vexpand: hasNotifs,
    visible: hasNotifs,
    spacing: 8,
    children: notifications.notifications
      .sort((a, b) => (a.time < b.time ? 1 : -1))
      .map((notif) => {
        const newNotif = Animated(notif);
        if (notifMap.has(notif.id)) remove(null, notif.id);
        notifMap.set(notif.id, newNotif);
        return newNotif;
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
    className: 'notifications-list',
    vertical: true,
    vexpand: true,
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
