import Gtk from 'gi://Gtk?version=3.0';

import BatteryDisplay from '@/components/bar/BatteryDisplay';
import NetworkDisplay from '@/components/bar/NetworkDisplay';
import SmallClock from '@/components/bar/SmallClock';
import VolumeDisplay from '@/components/bar/VolumeDisplay';
import Workspaces from '@/components/bar/Workspaces';
import { Windows } from '@/constants/windows.type';

const layout = {
  left: [SmallClock],
  center: [Workspaces],
  right: [NetworkDisplay, VolumeDisplay, BatteryDisplay],
};

function BarContent() {
  return Widget.CenterBox({
    className: 'bar-content',
    startWidget: Widget.Box({
      className: 'island left',
      hexpand: true,
      halign: Gtk.Align.START,
      children: layout.left.map((widget) => widget()),
    }).hook(
      App,
      (self, windowName, visible) => {
        if (windowName === Windows.CALANDAR) {
          self.toggleClassName('active', visible);
        }
      },
      'window-toggled'
    ),
    centerWidget: Widget.Box({
      className: 'island center',
      hpack: 'center',
      children: layout.center.map((widget) => widget()),
    }),
    endWidget: Widget.Box({
      halign: Gtk.Align.END,
      hexpand: true,
      child: Widget.EventBox({
        child: Widget.Box({
          className: 'island right',
          spacing: 12,
          children: layout.right.map((widget) => widget()),
        }),
        onPrimaryClick: () => {
          App.toggleWindow(Windows.CONTROL_CENTER);
        },
      }),
    }),
  });
}

/**
 * Bar
 */
export default function Bar(monitor: number) {
  return Widget.Window({
    monitor,
    className: 'bar',
    name: `bar-${monitor}`,
    exclusivity: 'exclusive',
    anchor: ['right', 'top', 'left'],
    child: BarContent(),
  });
}
