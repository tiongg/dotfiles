import { bash, sh } from '@/utils/utils';
import _ from 'lodash';

const backlight = await bash('ls -w1 /sys/class/backlight | head -1');

// Get arg values from brightnessctl
function getValue(args: string) {
  return Number(Utils.exec(`brightnessctl ${args}`));
}

class BrightnessService extends Service {
  static {
    Service.register(
      this,
      {},
      {
        screen: ['float', 'rw'],
      }
    );
  }

  private screenMax = getValue(`max -d ${backlight}`);
  private currentScreenBrightness =
    getValue(`get -d ${backlight}`) / (this.screenMax || 1);

  constructor() {
    super();
    const screenPath = `sys/class/backlight/${backlight}/brightness`;

    Utils.monitorFile(screenPath, async (f) => {
      const fileVal = await Utils.readFileAsync(f);
      this.screen = Number(fileVal) / this.screenMax;
      this.changed('screen');
    });
  }

  /**
   * Screen brightness in percentage
   */
  get screen() {
    return this.currentScreenBrightness;
  }

  set screen(percent: number) {
    percent = _.clamp(percent, 0, 1);
    sh(
      `brightnessctl set -d ${backlight} ${Math.floor(percent * 100)}% -q`
    ).then(() => {
      this.currentScreenBrightness = percent;
      this.changed('screen');
    });
  }

  // Override default
  connect(
    signal = 'screen',
    callback: (_: this, ...args: any[]) => void
  ): number {
    return super.connect(signal, callback);
  }
}

const brightnessService = new BrightnessService();
export default brightnessService;
