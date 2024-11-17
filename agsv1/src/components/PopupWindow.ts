import type Gtk from 'gi://Gtk?version=3.0';
import { type EventBoxProps } from 'types/widgets/eventbox';
import { type RevealerProps } from 'types/widgets/revealer';
import { type WindowProps } from 'types/widgets/window';

type Transition = RevealerProps['transition'];
type Child = WindowProps['child'];

type PopupWindowProps = Omit<WindowProps, 'name'> & {
  name: string;
  layout?: keyof ReturnType<typeof Layout>;
  transition?: Transition;
  /**
   * Determines if the popup window should
   * be stretched to the full size of the window
   */
  fullsize?: boolean;
};

export const Padding = (
  name: string,
  { css = '', hexpand = true, vexpand = true }: EventBoxProps = {}
) =>
  Widget.EventBox({
    hexpand,
    vexpand,
    can_focus: false,
    child: Widget.Box({ css }),
    setup: (w) => w.on('button-press-event', () => App.toggleWindow(name)),
  });

const PopupRevealer = (
  name: string,
  child: Child,
  transition: Transition = 'slide_down'
) =>
  Widget.Box(
    {},
    Widget.Revealer({
      transition,
      child: Widget.Box({
        class_name: 'window-content',
        child,
      }),
      transitionDuration: 200,
      setup: (self) =>
        self.hook(App, (_, wname, visible) => {
          if (wname === name) self.reveal_child = visible;
        }),
    })
  );

// Note to self: FS Padding added to nested paddings
// MIGHT BE WRONG!!
const Layout = (
  name: string,
  child: Child,
  fullsize: boolean,
  transition?: Transition
) => {
  // Fullsize aware padding
  // Padding is only applied when the window is not fullsize
  const FSPadding = (name: string) =>
    Padding(name, { hexpand: !fullsize, vexpand: !fullsize });

  return {
    center: () =>
      Widget.CenterBox(
        {},
        Padding(name),
        Widget.CenterBox(
          { vertical: true },
          FSPadding(name),
          PopupRevealer(name, child, transition),
          FSPadding(name)
        ),
        Padding(name)
      ),
    top: () =>
      Widget.CenterBox(
        {},
        Padding(name),
        Widget.Box(
          { vertical: true },
          PopupRevealer(name, child, transition),
          FSPadding(name)
        ),
        Padding(name)
      ),
    'top-right': () =>
      Widget.Box(
        {},
        Padding(name),
        Widget.Box(
          {
            hexpand: false,
            vertical: true,
          },
          PopupRevealer(name, child, transition),
          FSPadding(name)
        )
      ),
    'top-center': () =>
      Widget.Box(
        {},
        Padding(name),
        Widget.Box(
          {
            hexpand: false,
            vertical: true,
          },
          PopupRevealer(name, child, transition),
          FSPadding(name)
        ),
        Padding(name)
      ),
    'top-left': () =>
      Widget.Box(
        {},
        Widget.Box(
          {
            hexpand: false,
            vertical: true,
          },
          PopupRevealer(name, child, transition),
          FSPadding(name)
        ),
        Padding(name)
      ),
    'bottom-left': () =>
      Widget.Box(
        {},
        Widget.Box(
          {
            hexpand: false,
            vertical: true,
          },
          FSPadding(name),
          PopupRevealer(name, child, transition)
        ),
        Padding(name)
      ),
    'bottom-center': () =>
      Widget.Box(
        {},
        Padding(name),
        Widget.Box(
          {
            hexpand: false,
            vertical: true,
          },
          FSPadding(name),
          PopupRevealer(name, child, transition)
        ),
        Padding(name)
      ),
    'bottom-right': () =>
      Widget.Box(
        {},
        Padding(name),
        Widget.Box(
          {
            hexpand: false,
            vertical: true,
          },
          FSPadding(name),
          PopupRevealer(name, child, transition)
        )
      ),
  };
};

export default ({
  name,
  child,
  layout = 'center',
  transition,
  exclusivity = 'ignore',
  fullsize = false,
  ...props
}: PopupWindowProps) =>
  Widget.Window<Gtk.Widget>({
    name,
    class_names: [name, 'popup-window'],
    setup: (w) => w.keybind('Escape', () => App.closeWindow(name)),
    visible: false,
    keymode: 'on-demand',
    exclusivity,
    layer: 'top',
    anchor: ['top', 'bottom', 'right', 'left'],
    child: Layout(name, child, fullsize, transition)[layout](),
    ...props,
  });
