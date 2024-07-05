import { resetCss } from 'styles/style-helper';

import TimeMenu from './TimeMenu';

Utils.monitorFile(`${App.configDir}/styles`, resetCss);
resetCss();

App.config({
  windows: [TimeMenu()],
});
