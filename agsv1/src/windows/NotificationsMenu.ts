import Calandar from '@/components/Calandar';
import PopupWindow from '@/components/PopupWindow';
import NotificationList from '@/components/notifications/NotificationList';
import { Windows } from '@/constants/windows.type';
import Gtk from 'gi://Gtk?version=3.0';

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
 * Actual content for the menu
 */
function NotificationsMenuContent() {
  return Widget.Box({
    className: 'notifications-menu',
    vertical: true,
    widthRequest: 280,
    spacing: 8,
    children: [NotificationsMenuCalandar(), NotificationList()],
  });
}

/**
 * Notifications control center
 */
export default function NotificationsMenu() {
  return PopupWindow({
    monitor: 0,
    name: Windows.NOTIFICATIONS_CENTER,
    exclusivity: 'exclusive',
    layout: 'top-right',
    transition: 'crossfade',
    fullsize: true,
    child: NotificationsMenuContent(),
  });
}
