#!/usr/bin/gjs -m

import { App } from 'astal/gtk3';
import { Windows } from './constants/windows.type';
import { resetCss } from './styles/style-helper';
import style from './styles/style.scss';

import ApplicationLauncher from './widget/application-launcher/ApplicationLauncher';
import Bar from './widget/bar/Bar';
import ControlCenter from './widget/control-center/ControlCenter';
import NotificationPopups from './widget/notifications/NotificationPopups';
import NotificationsCenter from './widget/notifications/NotificationsCenter';
import TimeMenu from './widget/time-menu/TimeMenu';

resetCss();

App.start({
  css: style,
  main() {
    ControlCenter();
    TimeMenu();
    NotificationPopups();
    NotificationsCenter();
    ApplicationLauncher();
    App.get_monitors().map(Bar);
    console.log('App started');
  },
  icons: './icons',
});

App.requestHandler = (request, response) => {
  switch (request) {
    case 'toggle-bar': {
      for (const monitor of App.get_monitors()) {
        const barName = monitor.get_display().get_name();
        App.toggle_window(`${Windows.BAR}-${barName}`);
      }
      break;
    }
    case 'toggle-notification-center': {
      App.toggle_window(Windows.NOTIFICATIONS_CENTER);
      break;
    }
    case 'toggle-application-launcher': {
      App.toggle_window(Windows.APPLICATION_LAUNCHER);
      break;
    }
  }

  response(true);
};
