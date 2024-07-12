import SmallClock from '@/components/bar/SmallClock';
import Workspaces from '@/components/bar/Workspaces';
import Gtk from 'gi://Gtk?version=3.0';

const layout = {
  left: [SmallClock()],
  center: [Workspaces()],
  // brightness, wifi, volume, battery, power
  right: [Widget.Label('right')],
};

function BarContent() {
  return Widget.CenterBox({
    className: 'bar-content',
    startWidget: Widget.Box({
      className: 'island left',
      hexpand: true,
      halign: Gtk.Align.START,
      children: layout.left,
    }),
    centerWidget: Widget.Box({
      className: 'island center',
      hpack: 'center',
      children: layout.center,
    }),
    endWidget: Widget.Box({
      className: 'island right',
      hexpand: true,
      halign: Gtk.Align.END,
      children: layout.right,
    }),
  });
}

/**
 * Bar
 */
export default function Bar() {
  return Widget.Window({
    className: 'bar',
    name: 'bar',
    child: BarContent(),
    exclusivity: 'exclusive',
    anchor: ['right', 'top', 'left'],
  });
}
