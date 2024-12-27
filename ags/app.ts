import { App } from 'astal/gtk3';
import style from './styles/style.scss';
import Bar from './widget/bar/Bar';
import ControlCenter from './widget/control-center/ControlCenter';

import { resetCss } from './styles/style-helper';

resetCss();

App.start({
  css: style,
  main() {
    ControlCenter();
    App.get_monitors().map(Bar);
    console.log('App started');
  },
  icons: './icons',
});
