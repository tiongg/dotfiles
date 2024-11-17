import PopupWindow from '@/components/PopupWindow';
import SystemButtonsWidget from '@/components/control-center/SystemButtonsWidget';
import SystemSlidersWidget from '@/components/control-center/SystemSlidersWidget';
import SystemStatusWidget from '@/components/control-center/SystemStatusWidget';
import { Windows } from '@/constants/windows.type';

function ControlCenterContent() {
  return Widget.Box({
    className: 'control-center',
    widthRequest: 344, // 8 * 43
    heightRequest: 1,
    spacing: 8,
    vertical: true,
    children: [
      SystemStatusWidget(),
      SystemSlidersWidget(),
      SystemButtonsWidget(),
    ],
  });
}

/**
 * ControlCenter to manage system settings
 *
 * Contains:
 * - Buttons for Power, Lock & Sleep
 * - Sliders for Volume & Brightness
 * - Toggles for Mute (Mic), Do Not Disturb
 * - Menus for Network, Bluetooth
 */
export default function ControlCenter() {
  return PopupWindow({
    monitor: 0,
    name: Windows.CONTROL_CENTER,
    exclusivity: 'exclusive',
    layout: 'top-right',
    child: ControlCenterContent(),
    transition: 'crossfade',
  });
}
