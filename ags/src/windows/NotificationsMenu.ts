import Calandar from '@/components/Calandar';
import PopupWindow from '@/components/PopupWindow';
import NotificationList from '@/components/notifications/NotificationList';
import { Windows } from '@/constants/windows.type';
import Gtk from 'gi://Gtk?version=3.0';

const notifications = await Service.import('notifications');

/**
 * Calandar in notification menu
 */
function NotificationsMenuCalandar() {
  return Widget.Box({
    halign: Gtk.Align.CENTER,
    children: [
      Calandar({
        cellSize: 36,
      }),
    ],
  });
}

/**
 * Controls for notification menu
 *
 * Do not distrub, etc
 */
function NotificationsMenuControls() {
  return Widget.Box({
    className: 'notifications-menu-controls',
    vertical: true,
    children: [DoNotDisturb()],
  });
}

/**
 * Do not disturb button
 */
function DoNotDisturb() {
  return Widget.Box({
    className: 'do-not-disturb',
    hexpand: true,
    homogeneous: true,
    children: [
      Widget.Label({
        label: 'Do not disturb',
        halign: Gtk.Align.START,
      }),
      Widget.Switch({
        halign: Gtk.Align.END,
        active: notifications.bind('dnd'),
        onActivate: ({ active }) => {
          notifications.dnd = active;
        },
      }),
    ],
  });
}

/**
 * Actual content for the menu
 */
function NotificationsMenuContent() {
  return Widget.Box({
    className: 'notifications-menu',
    vertical: true,
    widthRequest: 280,
    spacing: 8,
    children: [
      NotificationsMenuCalandar(),
      NotificationsMenuControls(),
      NotificationList(),
    ],
  });
}

/**
 * Notifications control center
 */
export default function NotificationsMenu() {
  return PopupWindow({
    name: Windows.CONTROL_CENTER,
    exclusivity: 'exclusive',
    layout: 'top-right',
    transition: 'crossfade',
    fullsize: true,
    child: NotificationsMenuContent(),
  });
}
