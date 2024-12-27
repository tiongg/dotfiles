import { bash, sh } from '@/utils/utils';
import { monitorFile, readFileAsync } from 'astal/file';
import GObject, { property, register } from 'astal/gobject';
import { exec } from 'astal/process';
import { timeout } from 'astal/time';
import _ from 'lodash';

const backlight = await bash('ls -w1 /sys/class/backlight | head -1');

// Get arg values from brightnessctl
function getValue(args: string) {
  return Number(exec(`brightnessctl ${args}`));
}

@register({ GTypeName: 'Brightness' })
export default class Brightness extends GObject.Object {
  static instance: Brightness;
  static get_default() {
    if (!this.instance) this.instance = new Brightness();

    return this.instance;
  }

  screenMax = getValue('max');
  currentScreenBrightness = getValue('get') / (getValue('max') || 1);

  // Track changes in a current interval
  // This allows us to batch calls to brightnessctl
  private SET_INTERVAL = 50;
  private currentTimeout: ReturnType<typeof timeout> | null = null;

  @property(Number)
  get screen() {
    return this.currentScreenBrightness;
  }

  set screen(percent) {
    this.currentScreenBrightness = _.clamp(percent, 0, 1);
    this.notify('screen');

    // Already pending brightness change
    if (this.currentTimeout) {
      return;
    }

    this.currentTimeout = timeout(this.SET_INTERVAL, () => {
      sh(
        `brightnessctl set -d ${backlight} ${Math.floor(this.currentScreenBrightness * 100)}% -q`
      )
        .then(() => {
          this.currentTimeout = null;
        })
        .catch(e => {
          console.error(e);
        });
    });
  }

  constructor() {
    super();

    const screenPath = `/sys/class/backlight/${backlight}/brightness`;

    monitorFile(screenPath, async f => {
      const v = await readFileAsync(f);
      const newValue = Number(v) / this.screenMax;
      // Prevent unnecessary update events from being emitted
      // Float comparison requires a tolerance!
      if (Math.abs(this.currentScreenBrightness - newValue) <= 0.05) return;
      this.currentScreenBrightness = Number(v) / this.screenMax;
      this.notify('screen');
    });
  }
}
