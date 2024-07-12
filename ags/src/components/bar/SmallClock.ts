import { clock } from '@/constants/variables';
import { Windows } from '@/constants/windows.type';

/**
 * Displays the time
 */
export default function SmallClock() {
  // 12:00 PM | Fri, 12 July
  const format = '%I:%M %p | %a, %d %b';

  return Widget.EventBox({
    child: Widget.Label({
      className: 'small-clock',
      label: clock.bind().as((dt) => dt.format(format)!),
    }),
    onPrimaryClick: () => App.ToggleWindow(Windows.CALANDAR),
  });
}
