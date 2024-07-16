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

  // Track changes in a current interval
  // This allows us to batch calls to brightnessctl
  private SET_INTERVAL = 50;
  private currentTimeout: number | null = null;

  /**
   * Screen brightness in percentage
   */
  get screen() {
    return this.currentScreenBrightness;
  }

  set screen(percent: number) {
    this.currentScreenBrightness = _.clamp(percent, 0, 1);
    this.changed('screen');

    // Already pending brightness change
    if (this.currentTimeout) {
      return;
    }

    this.currentTimeout = Utils.timeout(this.SET_INTERVAL, () => {
      sh(
        `brightnessctl set -d ${backlight} ${Math.floor(this.currentScreenBrightness * 100)}% -q`
      )
        .then(() => {
          this.currentTimeout = null;
        })
        .catch((e) => {
          console.error(e);
        });
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
