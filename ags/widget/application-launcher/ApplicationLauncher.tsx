import { Windows } from '@/constants/windows.type';
import { bash, iconOrFallback } from '@/utils/utils';
import { bind, Variable } from 'astal';
import { App, Astal, Gtk } from 'astal/gtk3';
import Apps from 'gi://AstalApps';
import Pango from 'gi://Pango?version=1.0';
import _ from 'lodash';
import PopupWindow from '../PopupWindow';

const apps = new Apps.Apps({
  nameMultiplier: 2,
  entryMultiplier: 0,
  executableMultiplier: 2,
});

const MAX_APPS = 5;

function launchApp(app: Apps.Application) {
  const exe = app.executable
    .split(/\s+/)
    .filter(str => !str.startsWith('%') && !str.startsWith('@'))
    .join(' ');

  bash(`${exe} &`);
  app.frequency += 1;
  App.get_window(Windows.APPLICATION_LAUNCHER)?.hide();
}

type AppItemProps = {
  app: Apps.Application;
};

/**
 * Individual App item
 */
function AppItem({ app }: AppItemProps) {
  return (
    <button
      className="app-item"
      onClick={() => launchApp(app)}
      child={
        <box vertical spacing={4}>
          <icon
            icon={iconOrFallback(app.iconName, 'application-x-executable')}
          />
          <label
            label={app.name}
            maxWidthChars={10}
            ellipsize={Pango.EllipsizeMode.END}
          />
        </box>
      }
    />
  );
}

/**
 * Placeholder for empty app items
 */
function EmptyAppItem() {
  return (
    <box className="empty-app-item" vertical spacing={4} widthRequest={100}>
      <icon />
      <label />
    </box>
  );
}

/**
 * Launcher window content
 *
 * Contains:
 * - Search bar
 * - Queried apps
 */
function LauncherContent() {
  const queriedApps = Variable(apps.fuzzy_query(''));

  return (
    <box className="launcher-content" widthRequest={565} vertical spacing={8}>
      <entry
        className="launcher-search"
        placeholderText="Search..."
        primaryIconName="system-search-symbolic"
        onChanged={({ text }) => {
          queriedApps.set(apps.fuzzy_query(text));
        }}
        onActivate={() => {
          if (queriedApps.get().length > 0) {
            launchApp(queriedApps.get()[0]);
          } else {
            App.get_window(Windows.APPLICATION_LAUNCHER)?.hide();
          }
        }}
        // Grab focus on window show
        setup={self => {
          App.connect('window-toggled', (_src, window) => {
            if (window.name !== Windows.APPLICATION_LAUNCHER) return;
            if (!window.visible) return;

            self.set_position(-1);
            self.select_region(0, -1);
            self.text = '';
            self.grab_focus();
          });
        }}
      />
      <box homogeneous spacing={8}>
        {bind(queriedApps).as(apps => {
          if (apps.length === 0) {
            return <label label="No apps found!" />;
          }

          const appItems = apps
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, MAX_APPS)
            .map(app => <AppItem app={app} />);

          const emptyItems = _.range(Math.max(MAX_APPS - apps.length, 0)).map(
            EmptyAppItem
          );

          return [...appItems, ...emptyItems];
        })}
      </box>
    </box>
  );
}

/**
 * Application launcher
 */
export default function ApplicationLauncher() {
  return (
    <PopupWindow
      name={Windows.APPLICATION_LAUNCHER}
      layout="top-center"
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      transition={Gtk.RevealerTransitionType.CROSSFADE}
    >
      <LauncherContent />
    </PopupWindow>
  );
}
