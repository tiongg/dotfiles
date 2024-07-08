import dayjs from 'dayjs';
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';
import { type Notification as NotificationType } from 'types/service/notifications';
import { type Variable as VariableType } from 'types/variable';
import IconButton from '../IconButton';

function NotificationIcon({ app_entry, app_icon, image }: NotificationType) {
  app_entry ??= '';

  if (image) {
    return Widget.Box({
      vpack: 'start',
      hexpand: false,
      className: 'notification-img',
      valign: Align.FILL,
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
    valign: Align.FILL,
    child: Widget.Icon({
      icon,
    }),
  });
}

function NotificationHeader(
  { summary, time: timeRaw }: NotificationType,
  isHoveredVar: VariableType<boolean>
) {
  const time = Variable('', {
    poll: [1000, () => dayjs(timeRaw * 1000).fromNow()],
  });
  const isHovered = isHoveredVar.bind();
  const isNotHovered = isHoveredVar.bind().as((isHovered) => !isHovered);

  const Title = Widget.Label({
    className: 'notification-title',
    label: summary.trim(),
    maxWidthChars: 24,
    xalign: 0,
    truncate: 'end',
    useMarkup: true,
    halign: Align.START,
  });
  const Time = Widget.Label({
    className: 'notification-time',
    label: time.bind(),
    hexpand: isNotHovered,
    visible: isNotHovered,
    halign: Align.END,
  });
  const Dismiss = IconButton({
    icon: 'cross',
    hexpand: isHovered,
    visible: isHovered,
    halign: Align.END,
  });

  return Widget.Box({
    className: 'notification-header',
    homogeneous: true,
    children: [Title, Time, Dismiss],
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
    onHover: (self, hovered) => {
      isHovered.setValue(true);
    },
    onHoverLost: (self) => {
      isHovered.setValue(false);
    },
  });
}
