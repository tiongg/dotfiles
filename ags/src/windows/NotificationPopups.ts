import Notification from '@/components/notifications/Notification';
import { Windows } from '@/constants/windows.type';
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';
import { type Notification as NotificationType } from 'types/service/notifications';

const notifications = await Service.import('notifications');

// Dismiss all notifs when control center opens
App.connect('window-toggled', (_app, windowName: string, visible: boolean) => {
  if (windowName !== Windows.CONTROL_CENTER || !visible) {
    return;
  }

  for (const notification of notifications.notifications) {
    notification.dismiss();
  }
});

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
  const notifs = notifications.popups
    .filter((notif) => notif.id !== undefined)
    .map((notif) => ({
      id: notif.id,
      widget: Animated(notif),
    }));

  const remove = (_: unknown, id?: number) => {
    if (id === undefined) return;
    const widgetInfo = notifs.find((notif) => notif.id === id);
    // Closed or dismissed already
    if (!widgetInfo) return;
    const { widget } = widgetInfo;

    widget.reveal_child = false;
    Utils.timeout(10, () => {
      widget.destroy();
      notifs.splice(notifs.indexOf(widgetInfo), 1);
    });
  };

  const list = Widget.Box({
    vertical: true,
    vexpand: true,
    widthRequest: 300,
    className: 'notifications-list',
    spacing: 8,
    valign: Align.CENTER,
    vpack: 'start',
    children: notifs.map(({ widget }) => widget),
  });

  return list
    .hook(notifications, remove, 'closed')
    .hook(notifications, remove, 'dismissed')
    .hook(
      notifications,
      (_, id) => {
        // Hide popups when control center is showing
        if (App.getWindow(Windows.CONTROL_CENTER)?.visible) {
          return;
        }
        if (id === undefined) return;
        const notif = notifications.getPopup(id);
        if (!notif) return;
        const newNotif = Animated(notif);
        notifs.unshift({
          id: notif.id,
          widget: newNotif,
        });
        if (notifs.length > 3) {
          const { id } = notifs.pop()!;
          remove(null, id);
        }
        list.children = notifs.map(({ widget }) => widget);
      },
      'notified'
    );
}

/**
 * Window for notification popups.
 */
export default function NotificationPopups() {
  return Widget.Window({
    name: Windows.NOTIFICATIONS_POPUP,
    anchor: ['top', 'right'],
    vexpand: true,
    vexpandSet: true,
    layer: 'top',
    exclusivity: 'exclusive',
    child: NotificationsList(),
  });
}
