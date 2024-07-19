import _ from 'lodash';
import { resetCss } from 'styles/style-helper';
import { forMonitors } from './utils/utils';

// Menus
import NotificationsMenu from '@/windows/NotificationsMenu';
import TimeMenu from '@/windows/TimeMenu';
import Bar from './windows/Bar';
import ControlCenter from './windows/ControlCenter';
import NotificationPopups from './windows/NotificationPopups';

// Config
import './config/dayjs';

// com.github.Aylur.ags.BUS_NAME
const busName = _.last((App.applicationId ?? 'ags').split('.'));

App.addIcons(`${App.configDir}/src/icons`);

// Only watch if dev environment
if (busName === 'dev') {
  Utils.monitorFile(`${App.configDir}/styles`, resetCss);
}

const startTime = Date.now();
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
    // Control center
    // TODO: This always pops up on the first monitor
    ControlCenter(),
  ],
});

console.log(`App started in ${Date.now() - startTime}ms`);
