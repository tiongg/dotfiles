import { ESCAPE_KEY } from '@/constants/variables';
import { App, Astal, Gtk } from 'astal/gtk3';
import type {
  EventBoxProps,
  RevealerProps,
  WindowProps,
} from 'astal/gtk3/widget';

type Transition = RevealerProps['transitionType'];
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

type PaddingProps = {
  name: string;
  css?: string;
  hexpand?: boolean;
  vexpand?: boolean;
} & EventBoxProps;

type PopupRevealerProps = {
  name: string;
  child: Child;
  transition?: Transition;
};

export function Padding({
  name,
  css = '',
  hexpand = true,
  vexpand = true,
}: PaddingProps) {
  return (
    <eventbox
      hexpand={hexpand}
      vexpand={vexpand}
      can_focus={false}
      onButtonPressEvent={() => App.toggle_window(name)}
    >
      <box css={css} />
    </eventbox>
  );
}

function PopupRevealer({
  name,
  child,
  transition = Gtk.RevealerTransitionType.CROSSFADE,
}: PopupRevealerProps) {
  return (
    <revealer
      transitionType={transition}
      transitionDuration={200}
      setup={self => {
        App.connect('window-toggled', (_, window) => {
          if (window.name === name) {
            self.revealChild = window.visible;
          }
        });
      }}
    >
      <box className="window-content">{child}</box>
    </revealer>
  );
}

// Note to self: FS Padding added to nested paddings
// MIGHT BE WRONG!!
// Everything here is probably wrong, use with care
const Layout = (
  name: string,
  child: Child,
  fullsize: boolean,
  transition?: Transition
) => {
  // Fullsize aware padding
  // Padding is only applied when the window is not fullsize
  const FSPadding = ({ name }: { name: string }) => (
    <Padding name={name} hexpand={!fullsize} vexpand={!fullsize} />
  );

  return {
    'center': () => (
      <centerbox>
        <Padding name={name} />
        <centerbox vertical>
          <FSPadding name={name} />
          <PopupRevealer name={name} child={child} transition={transition} />
          <FSPadding name={name} />
        </centerbox>
        <Padding name={name} />
      </centerbox>
    ),
    'top': () => (
      <centerbox>
        <Padding name={name} />
        <box vertical>
          <PopupRevealer name={name} child={child} transition={transition} />
          <FSPadding name={name} />
        </box>
        <Padding name={name} />
      </centerbox>
    ),
    'top-right': () => (
      <box>
        <Padding name={name} />
        <box vertical>
          <PopupRevealer name={name} child={child} transition={transition} />
          <Padding name={name} hexpand={false} />
        </box>
      </box>
    ),
    'top-center': () => (
      <box>
        <Padding name={name} />
        <box vertical>
          <PopupRevealer name={name} child={child} transition={transition} />
          <FSPadding name={name} />
        </box>
        <Padding name={name} />
      </box>
    ),
    'top-left': () => (
      <box>
        <box vertical>
          <PopupRevealer name={name} child={child} transition={transition} />
          <FSPadding name={name} />
        </box>
        <Padding name={name} />
      </box>
    ),
    'bottom-left': () => (
      <box>
        <box vertical>
          <FSPadding name={name} />
          <PopupRevealer name={name} child={child} transition={transition} />
        </box>
        <Padding name={name} />
      </box>
    ),
    'bottom-center': () => (
      <box>
        <Padding name={name} />
        <box vertical>
          <FSPadding name={name} />
          <PopupRevealer name={name} child={child} transition={transition} />
          <FSPadding name={name} />
        </box>
        <Padding name={name} />
      </box>
    ),
    'bottom-right': () => (
      <box>
        <Padding name={name} />
        <box vertical>
          <FSPadding name={name} />
          <PopupRevealer name={name} child={child} transition={transition} />
        </box>
      </box>
    ),
  };
};

export default function PopupWindow({
  name,
  child,
  layout = 'center',
  transition,
  exclusivity = Astal.Exclusivity.EXCLUSIVE,
  fullsize = false,
  ...props
}: PopupWindowProps) {
  return (
    <window
      application={App}
      name={name}
      className={`${name} popup-window`}
      onKeyPressEvent={(_, event) => {
        const [_keyEvent, keyCode] = event.get_keycode();
        if (keyCode === ESCAPE_KEY) App.toggle_window(name);
      }}
      visible={false}
      keymode={Astal.Keymode.EXCLUSIVE}
      exclusivity={exclusivity}
      layer={Astal.Layer.TOP}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM
      }
      child={Layout(name, child, fullsize, transition)[layout]()}
      {...props}
    />
  );
}
