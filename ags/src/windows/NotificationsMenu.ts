import Calandar from '@/components/Calandar';
import PopupWindow from '@/components/PopupWindow';
import NotificationList from '@/components/notifications/NotificationList';
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';

/**
 * Calandar in notification menu
 */
function NotificationsMenuCalandar() {
  return Widget.Box({
    halign: Align.CENTER,
    children: [Calandar(36)],
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
    hexpand: true,
    homogeneous: true,
    children: [
      Widget.Label({
        label: 'Do not disturb',
        halign: Align.START,
      }),
      Widget.Switch({
        halign: Align.END,
        active: false,
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
    name: 'notifications-menu',
    exclusivity: 'exclusive',
    layout: 'top-right',
    transition: 'crossfade',
    fullsize: true,
    child: NotificationsMenuContent(),
  });
}
