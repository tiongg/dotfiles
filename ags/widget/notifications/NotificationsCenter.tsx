import { Windows } from '@/constants/windows.type';
import { Astal } from 'astal/gtk3';
import Gtk from 'gi://Gtk?version=3.0';
import PopupWindow from '../PopupWindow';
import Calandar from '../time-menu/Calandar';
import NotificationList from './NotificationsList';

/**
 * Calandar in notification menu
 */
function NotificationsMenuCalandar() {
  return (
    <box halign={Gtk.Align.CENTER}>
      <Calandar cellSize={36} />
    </box>
  );
}

/**
 * Actual content for the menu
 */
function NotificationsMenuContent() {
  return (
    <box className="notifications-menu" widthRequest={280} vertical spacing={8}>
      <NotificationsMenuCalandar />
      <NotificationList />
    </box>
  );
}

/**
 * Notifications control center
 */
export default function NotificationsCenter() {
  return (
    <PopupWindow
      monitor={0}
      name={Windows.NOTIFICATIONS_CENTER}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layout="top-right"
      transition={Gtk.RevealerTransitionType.CROSSFADE}
      fullsize
    >
      <NotificationsMenuContent />
    </PopupWindow>
  );
}
