import { Windows } from '@/constants/windows.type';
import { Gtk } from 'astal/gtk3';
import PopupWindow from '../PopupWindow';
import SystemButtonsWidget from './SystemButtonsWidget';
import SystemSlidersWidget from './SystemSlidersWidget';
import SystemStatusWidget from './SystemStatusWidget';

function ControlCenterContent() {
  return (
    <box
      className="control-center"
      widthRequest={344} // 8 * 43
      heightRequest={1}
      spacing={8}
      vertical
    >
      <SystemStatusWidget />
      <SystemSlidersWidget />
      <SystemButtonsWidget />
    </box>
  );
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
  return (
    <PopupWindow
      monitor={0}
      name={Windows.CONTROL_CENTER}
      layout="top-right"
      child={<ControlCenterContent />}
      transition={Gtk.RevealerTransitionType.SLIDE_DOWN}
    />
  );
}
