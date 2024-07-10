import Calandar from '@/components/Calandar';
import PopupWindow from '@/components/PopupWindow';
import { Windows } from '@/constants/windows.type';

/**
 * Popup window with Calandar
 */
export default function TimeMenu() {
  return PopupWindow({
    name: Windows.CALANDAR,
    exclusivity: 'exclusive',
    layout: 'top-left',
    child: Widget.Box({
      className: 'time-menu',
      children: [Calandar()],
    }),
  });
}
