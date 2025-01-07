import { clock } from '@/constants/variables';
import { bind, Variable } from 'astal';
import Notifd from 'gi://AstalNotifd';
import Gtk from 'gi://Gtk?version=3.0';

type NotificationType = Notifd.Notification;

type NotificationHeaderProps = {
  notification: NotificationType;
  isHovered: Variable<boolean>;
};

type NotificationBoxProps = {
  notification: NotificationType;
  isHovered: Variable<boolean>;
};

export type NotificationAsProp = {
  notification: NotificationType;
};

function NotificationIcon({ notification }: NotificationAsProp) {
  const image = notification.image;

  if (image) {
    return (
      <box
        // vpack="start"
        hexpand={false}
        className="notification-img"
        valign={Gtk.Align.FILL}
        css={`
          background-image: url('${image}');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        `}
      />
    );
  }

  return (
    <box
      // vpack="start"
      hexpand={false}
      className="notification-icon"
      valign={Gtk.Align.FILL}
    >
      <icon icon={notification.get_app_icon()} />
    </box>
  );
}

function NotificationHeader({
  notification,
  isHovered,
}: NotificationHeaderProps) {
  const { summary } = notification;

  // Shows time, or close button if hovered
  const label = Variable.derive([isHovered, clock], (hovered, _now) =>
    hovered ? 'Close' : 'Now'
  );

  const Title = () => (
    <label
      className="notification-title"
      label={summary.trim()}
      maxWidthChars={24}
      xalign={0}
      halign={Gtk.Align.START}
      useMarkup
      truncate
    />
  );

  const TimeOrClose = () => (
    <button
      className={bind(isHovered).as(
        isHovered =>
          `notification-time ${isHovered ? 'close-mode' : 'time-mode'}`
      )}
      onClicked={() => notification.dismiss()}
      label={bind(label)}
      halign={Gtk.Align.END}
      hexpand
    />
  );

  return (
    <box className="notification-header" spacing={8}>
      <Title />
      <TimeOrClose />
    </box>
  );
}

function NotificationBody({ notification }: NotificationAsProp) {
  return (
    <label
      className="notification-body"
      label={notification.body}
      maxWidthChars={24}
      xalign={0}
      lines={2}
      truncate
      wrap
      singleLineMode
      useMarkup
    />
  );
}

function NotificationBox({ isHovered, notification }: NotificationBoxProps) {
  return (
    <box className="notification" spacing={8}>
      <NotificationIcon notification={notification} />
      <box className="notification-content" vertical>
        <NotificationHeader notification={notification} isHovered={isHovered} />
        <NotificationBody notification={notification} />
      </box>
    </box>
  );
}

/**
 * Single notification
 */
export default function NotificationWidget({
  notification,
}: NotificationAsProp) {
  const isHovered = Variable(false);

  return (
    <eventbox
      onHover={() => isHovered.set(true)}
      onHoverLost={() => isHovered.set(false)}
    >
      <NotificationBox notification={notification} isHovered={isHovered} />
    </eventbox>
  );
}
