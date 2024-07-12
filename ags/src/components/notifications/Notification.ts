import { clock } from '@/constants/variables';
import cn from '@/utils/cn';
import dayjs from 'dayjs';
import Gtk from 'gi://Gtk?version=3.0';
import { type Notification as NotificationType } from 'types/service/notifications';
import { type Variable as VariableType } from 'types/variable';

function NotificationIcon({ app_entry, app_icon, image }: NotificationType) {
  app_entry ??= '';

  if (image) {
    return Widget.Box({
      vpack: 'start',
      hexpand: false,
      className: 'notification-img',
      valign: Gtk.Align.FILL,
      css: `
        background-image: url("${image}");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      `,
    });
  }

  let icon = 'info-filled';
  if (Utils.lookUpIcon(app_icon)) icon = app_icon;

  if (Utils.lookUpIcon(app_entry)) icon = app_entry;

  return Widget.Box({
    vpack: 'start',
    hexpand: false,
    className: 'notification-icon',
    valign: Gtk.Align.FILL,
    child: Widget.Icon({
      icon,
    }),
  });
}

function NotificationHeader(
  { summary, time: timeRaw, close }: NotificationType,
  isHovered: VariableType<boolean>
) {
  // Shows time, or close button if hovered
  const label = Utils.derive([isHovered, clock], (hovered, _now) =>
    hovered ? 'Close' : dayjs(timeRaw * 1000).fromNow()
  );

  const Title = Widget.Label({
    className: 'notification-title',
    label: summary.trim(),
    maxWidthChars: 24,
    xalign: 0,
    truncate: 'end',
    useMarkup: true,
    halign: Gtk.Align.START,
  });
  const TimeOrClose = Widget.Button({
    className: isHovered
      .bind()
      .as((isHovered) =>
        cn('notification-time', `${isHovered ? 'close-mode' : 'time-mode'}`)
      ),
    onClicked: () => {
      close();
    },
    label: label.bind(),
    halign: Gtk.Align.END,
    hexpand: true,
  });

  return Widget.Box({
    className: 'notification-header',
    homogeneous: true,
    children: [Title, TimeOrClose],
  });
}

function NotificationBody(notif: NotificationType) {
  return Widget.Label({
    className: 'notification-body',
    label: notif.body,
    maxWidthChars: 24,
    xalign: 0,
    truncate: 'end',
    wrap: true,
    lines: 2,
    singleLineMode: true,
    useMarkup: true,
  });
}

function NotificationBox(
  notif: NotificationType,
  isHovered: VariableType<boolean>
) {
  return Widget.Box({
    className: 'notification',
    spacing: 4,
    children: [
      NotificationIcon(notif),
      Widget.Box({
        className: 'notification-content',
        vertical: true,
        spacing: 2,
        children: [
          NotificationHeader(notif, isHovered),
          NotificationBody(notif),
        ],
      }),
    ],
  });
}

/**
 * Single notification
 */
export default function Notification(notif: NotificationType) {
  const isHovered = Variable(false);

  return Widget.EventBox({
    child: NotificationBox(notif, isHovered),
    onHover: () => {
      isHovered.setValue(true);
    },
    onHoverLost: () => {
      isHovered.setValue(false);
    },
  });
}
