import { resetCss } from 'styles/style-helper';
import { forMonitors } from './utils/utils';

// Menus
import NotificationsMenu from '@/windows/NotificationsMenu';
import TimeMenu from '@/windows/TimeMenu';
import Bar from './windows/Bar';
import NotificationPopups from './windows/NotificationPopups';

// Config
import './config/dayjs';

App.addIcons(`${App.configDir}/src/icons`);
Utils.monitorFile(`${App.configDir}/styles`, resetCss);
await resetCss();

App.config({
  windows: [
    // Calandar popup
    // TODO: This always pops up on the first monitor
    TimeMenu(),
    // Notifications
    NotificationsMenu(),
    NotificationPopups(),
    // Bar
    ...forMonitors(Bar),
  ],
});
