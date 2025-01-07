import { Windows } from '@/constants/windows.type';
import { bind, timeout, Variable } from 'astal';
import { App, Astal, Gtk } from 'astal/gtk3';
import { Stack } from 'astal/gtk3/widget';
import Notifd from 'gi://AstalNotifd';
import NotificationWidget, { NotificationAsProp } from './Notification';

const notifd = Notifd.get_default();

// Dismiss all notifs when control center opens
App.connect('window-toggled', (_, window) => {
  if (window.name !== Windows.CONTROL_CENTER) return;
  if (App.get_window(Windows.CONTROL_CENTER)!.visible) return;

  for (const notification of notifd.get_notifications()) {
    notification.dismiss();
  }
});

function AnimatedNotification({ notification }: NotificationAsProp) {
  // Using a stack because for some reason, the revealer doesn't work
  // for Left Right animations
  return (
    <stack
      transitionDuration={200}
      transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
      visibleChildName="notif"
    >
      <box name="hider" />
      <box name="notif">
        <NotificationWidget notification={notification} />
      </box>
    </stack>
  );
}

function PopupNotificationsList() {
  // Internally handle notifications list
  // Allows us to control add/remove animations
  const notifications = Variable(
    [] as { notification: Notifd.Notification; widget: Gtk.Widget }[]
  );

  const removeNotificationPopup = (notificationId: number) => {
    const notificationInfo = notifications
      .get()
      .find(({ notification }) => notification.id === notificationId);

    if (!notificationInfo) return;

    (notificationInfo.widget as Stack).visibleChildName = 'hider';

    // Remove after animation is done
    // We have to call widget.destroy(), else it complains
    timeout(200, () => {
      notificationInfo.widget.destroy();
      notifications.set(
        notifications
          .get()
          .filter(({ notification }) => notification.id !== notificationId)
      );
    });
  };

  notifd.connect('notified', (_src, notificationId) => {
    const notification = notifd.get_notification(notificationId);
    if (!notification) return;
    if (notifd.dontDisturb) return;

    const widget = <AnimatedNotification notification={notification} />;
    notifications.set([...notifications.get(), { notification, widget }]);
    // Remove after 2 seconds
    // Cannot call dismiss, since we only want to remove the popup
    setTimeout(() => {
      removeNotificationPopup(notificationId);
    }, 2000);
  });

  notifd.connect('resolved', (_src, notificationId, _reason) => {
    removeNotificationPopup(notificationId);
  });

  return (
    <box vertical spacing={8} widthRequest={300}>
      {bind(notifications).as(notifications =>
        notifications.map(({ widget }) => widget)
      )}
    </box>
  );
}

/**
 * Window for displaying popup notifications
 */
export default function NotificationPopups() {
  const isShowing = Variable(false);

  return (
    <window
      application={App}
      monitor={0}
      name={Windows.NOTIFICATIONS_POPUP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      vexpand
      vexpandSet
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
    >
      <PopupNotificationsList />
      {/* <box vertical spacing={8} widthRequest={300}>
        <button
          onClicked={() => isShowing.set(!isShowing.get())}
          label="Toggle"
        />
        <stack
          transitionDuration={200}
          transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
          visibleChildName={bind(isShowing).as(isShowing =>
            isShowing ? 'a' : 'b'
          )}
        >
          <label name="a" label="Hello" css="background: red" />
          <box name="b" />
        </stack>
      </box> */}
    </window>
  );
}
