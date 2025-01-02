import { App } from 'astal/gtk3';
import style from './styles/style.scss';
import Bar from './widget/bar/Bar';
import ControlCenter from './widget/control-center/ControlCenter';

import { resetCss } from './styles/style-helper';
import TimeMenu from './widget/time-menu/TimeMenu';

resetCss();

App.start({
  css: style,
  main() {
    ControlCenter();
    TimeMenu();
    App.get_monitors().map(Bar);
    console.log('App started');
  },
  icons: './icons',
});
