import { App } from 'astal/gtk3';
import style from './styles/style.scss';
import Bar from './widget/bar/Bar';

import { resetCss } from './styles/style-helper';
resetCss();

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar);
  },
});
