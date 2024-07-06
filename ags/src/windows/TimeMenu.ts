import Calandar from 'src/components/Calandar';
import PopupWindow from 'src/components/PopupWindow';

/**
 * Popup window with Calandar
 */
export default function TimeMenu() {
  return PopupWindow({
    name: 'time-menu',
    exclusivity: 'exclusive',
    layout: 'top-left',
    child: Widget.Box({
      className: 'time-menu',
      children: [Calandar()],
    }),
  });
}
