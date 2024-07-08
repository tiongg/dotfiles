import NotificationsMenu from '@/windows/NotificationsMenu';
import TimeMenu from '@/windows/TimeMenu';
import { resetCss } from 'styles/style-helper';

// Config
import './config/dayjs';

Utils.monitorFile(`${App.configDir}/styles`, resetCss);
await resetCss();

App.config({
  windows: [
    // Calandar popup
    TimeMenu(),
    // Notifications
    NotificationsMenu(),
  ],
});
