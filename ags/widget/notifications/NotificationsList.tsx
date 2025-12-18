import IconButton from '@/components/IconButton';
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import Notifd from 'gi://AstalNotifd';
import NotificationWidget from './Notification';

const notifd = Notifd.get_default();

/**
 * Header with a title and a clear all button
 */
function NotificationsHeader() {
  return (
    <box className="notifications-header" hexpand={false}>
      <label label="Notifications" halign={Gtk.Align.START} />
      <IconButton
        hexpand
        icon="cross-filled-symbolic"
        halign={Gtk.Align.END}
        onClicked={() => {
          // Dismiss all notifications
          for (const notification of notifd.get_notifications()) {
            notification.dismiss();
          }
        }}
      />
    </box>
  );
}

/**
 * List of unresolved notifications
 */
function Notifications() {
  // Manually track notifications
  // to allow us to call destroy() on them
  const notifs = Variable(
    Object.fromEntries(
      notifd
        .get_notifications()
        .map(n => [n.id, <NotificationWidget notification={n} />])
    )
  );

  notifd.connect('notified', (_, notificationId) => {
    const notification = notifd.get_notification(notificationId);
    if (!notification) return;
    notifs.set({
      ...notifs.get(),
      [notification.id]: <NotificationWidget notification={notification} />,
    });
  });

  notifd.connect('resolved', (_, notificationId) => {
    const notifications = notifs.get();
    if (!notifications[notificationId]) return;

    // We have to call widget.destroy(), else it complains
    notifications[notificationId].destroy();
    delete notifications[notificationId];
    notifs.set(notifications);
  });

  return (
    <scrollable
      vexpand
      hscroll={Gtk.PolicyType.NEVER}
      vscroll={Gtk.PolicyType.EXTERNAL}
      overlayScrolling
    >
      <box vertical vexpand hexpand={false} spacing={8}>
        {bind(notifs).as(notifications =>
          Object.values(notifications).map(notification => notification)
        )}
      </box>
    </scrollable>
  );
}

/**
 * Empty state for notifications
 */
function EmptyNotificationsList() {
  return (
    <box
      className="empty-notifications"
      vertical
      vexpand
      spacing={8}
      valign={Gtk.Align.CENTER}
    >
      <icon icon="tick-filled-symbolic" vexpand css="font-size: 90px" />
      <label label="All caught up!" />
    </box>
  );
}

/**
 * List of notifications for Notification Center
 *
 * Includes a header, a list of notifications and an empty state.
 */
export default function NotificationList() {
  return (
    <box className="notifications-list" vertical vexpand spacing={8}>
      {bind(notifd, 'notifications').as(notifs => {
        if (notifs.length <= 0) {
          return <EmptyNotificationsList />;
        }
        return (
          <box vertical vexpand>
            <NotificationsHeader />
            <Notifications />
          </box>
        );
      })}
    </box>
  );
}
