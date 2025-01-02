import { Windows } from '@/constants/windows.type';
import { Gtk } from 'astal/gtk3';
import PopupWindow from '../PopupWindow';
import Calandar from './Calandar';

export default function TimeMenu() {
  return (
    <PopupWindow
      monitor={0}
      name={Windows.CALANDAR}
      layout="top-left"
      transition={Gtk.RevealerTransitionType.SLIDE_DOWN}
    >
      <box className="time-menu">
        <Calandar cellSize={30} keepConsisent />
      </box>
    </PopupWindow>
  );
}
