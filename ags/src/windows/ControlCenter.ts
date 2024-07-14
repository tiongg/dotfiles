import PopupWindow from '@/components/PopupWindow';
import SystemStatusWidget from '@/components/control-center/SystemStatusWidget';
import { Windows } from '@/constants/windows.type';

function ControlCenterContent() {
  return Widget.Box({
    className: 'control-center',
    widthRequest: 340,
    heightRequest: 1,
    spacing: 8,
    children: [SystemStatusWidget()],
  });
}

/**
 * ControlCenter to manage system settings
 *
 * Contains:
 * - Sliders for Volume & Brightness
 * - Buttons for Power, Lock & Sleep
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
