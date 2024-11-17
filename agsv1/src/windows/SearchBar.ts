import PopupWindow from '@/components/PopupWindow';
import { Windows } from '@/constants/windows.type';
import { bash, iconOrFallback } from '@/utils/utils';
import Gtk from 'gi://Gtk?version=3.0';
import _ from 'lodash';
import { EllipsizeMode } from 'types/@girs/pango-1.0/pango-1.0.cjs';
import { Application } from 'types/service/applications';

const applications = await Service.import('applications');
const MAX_APPS = 5;

function launchApp(app: Application) {
  const exe = app.executable
    .split(/\s+/)
    .filter((str) => !str.startsWith('%') && !str.startsWith('@'))
    .join(' ');

  bash(`${exe} &`);
  app.frequency += 1;
  App.closeWindow(Windows.APPLICATION_LAUNCHER);
}

/**
 * Individual App
 */
function AppItem(app: Application) {
  return Widget.Button({
    className: 'app-item',
    child: Widget.Box({
      valign: Gtk.Align.CENTER,
      vertical: true,
      spacing: 4,
      children: [
        Widget.Icon({
          icon: iconOrFallback(app.icon_name, 'application-x-executable'),
          size: 32,
        }),
        Widget.Label({
          label: app.name,
          maxWidthChars: 10,
          ellipsize: EllipsizeMode.END,
        }),
      ],
    }),
    onClicked: () => launchApp(app),
  });
}

/**
 * Placeholder for empty app items
 */
function EmptyAppItem() {
  return Widget.Box({
    className: 'empty-app-item',
    valign: Gtk.Align.CENTER,
    vertical: true,
    spacing: 4,
    widthRequest: 100, // TODO: Fix this
    children: [
      Widget.Icon({
        size: 32,
      }),
      Widget.Label({
        label: '',
      }),
    ],
  });
}

function NoAppsFound() {
  return Widget.Box({
    className: 'empty-app-item',
    valign: Gtk.Align.CENTER,
    vertical: true,
    spacing: 4,
    children: [
      Widget.Icon({
        icon: 'image-missing-symbolic',
        size: 32,
      }),
      Widget.Label({
        label: 'No apps found!',
      }),
    ],
  });
}

/**
 * Launcher content
 * - Search bar
 * - Queried apps
 */
function LauncherContent() {
  const queriedApps = Variable<Application[]>(applications.query(''));

  /**
   * Search bar for launcher
   */
  const LauncherSearch = () => {
    return Widget.Entry({
      className: 'launcher-search',
      primaryIconName: 'system-search-symbolic',
      placeholderText: 'Search...', // Doesn't work; only shows up when unfocused
      onChange: ({ text }) => {
        //TODO: Check perf
        queriedApps.setValue(applications.query(text ?? ''));
      },
      onAccept: () => {
        if (queriedApps.value.length <= 0) return;
        launchApp(queriedApps.value[0]);
      },
      // Grab focus on window show
      setup: (self) => {
        self.hook(App, (_app, window, visible) => {
          if (window !== Windows.APPLICATION_LAUNCHER) return;
          if (!visible) return;

          self.set_position(-1);
          self.select_region(0, -1);
          self.text = '';
          self.grab_focus();
        });
      },
    });
  };

  /**
   * Apps listed
   */
  const AppsList = () => {
    return Widget.Box({
      homogeneous: true,
      spacing: 8,
      children: queriedApps.bind().as((apps) => {
        if (apps.length === 0) {
          return [NoAppsFound()];
        }

        const appItems = apps
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, MAX_APPS)
          .map(AppItem);

        const emptyApps = _.range(Math.max(MAX_APPS - apps.length, 0)).map(
          EmptyAppItem
        );
        return [...appItems, ...emptyApps];
      }),
    });
  };

  return Widget.Box({
    className: 'launcher-content',
    vertical: true,
    widthRequest: 565,
    spacing: 8,
    children: [LauncherSearch(), AppsList()],
  }).keybind('downarrow', () => {});
}

/**
 * Application search launcher
 */
export default function ApplicationLauncher() {
  return PopupWindow({
    name: Windows.APPLICATION_LAUNCHER,
    child: LauncherContent(),
    layout: 'top-center',
    exclusivity: 'exclusive',
    transition: 'crossfade',
  });
}
