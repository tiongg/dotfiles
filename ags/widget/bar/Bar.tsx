import { Windows } from '@/constants/windows.type';
import { App, Astal, Gdk, Gtk } from 'astal/gtk3';
import BatteryDisplay from './BatteryDisplay';
import NetworkDisplay from './NetworkDisplay';
import SmallClock from './SmallClock';
import VolumeDisplay from './VolumeDisplay';
import Workspaces from './Workspaces';

const layout = {
  left: [SmallClock],
  center: [Workspaces],
  right: [NetworkDisplay, VolumeDisplay, BatteryDisplay],
};

function LeftIsland() {
  return (
    <box className="island left" hexpand={true} halign={Gtk.Align.START}>
      {layout.left.map(widget => widget())}
    </box>
  );
}

function RightIsland() {
  return (
    <box halign={Gtk.Align.END} hexpand={true}>
      <eventbox onClick={() => App.toggle_window(Windows.CONTROL_CENTER)}>
        <box className="island right" spacing={12}>
          {layout.right.map(widget => widget())}
        </box>
      </eventbox>
    </box>
  );
}

function CenterIsland() {
  return (
    <box className="island center">{layout.center.map(widget => widget())}</box>
  );
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      className="bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
    >
      <centerbox
        className="bar-content"
        startWidget={<LeftIsland />}
        centerWidget={<CenterIsland />}
        endWidget={<RightIsland />}
      />
    </window>
  );
}
