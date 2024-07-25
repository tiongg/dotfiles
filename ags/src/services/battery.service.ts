//Copied from https://github.com/Aylur/ags/blob/main/src/service/battery.ts
//Changes: sync stuff in proxy callback, rather than waiting for it to initalize

import { bash } from '@/utils/utils';
import Gio from 'gi://Gio';

const DeviceState = {
  CHARGING: 1,
  FULLY_CHARGED: 4,
};

const BatteryIFace = Utils.loadInterfaceXML('org.freedesktop.UPower.Device')!;
const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(
  BatteryIFace
) as unknown as any;

export class BatteryService extends Service {
  static {
    Service.register(
      this,
      {},
      {
        available: ['boolean'],
        percent: ['int'],
        charging: ['boolean'],
        charged: ['boolean'],
        'icon-name': ['string'],
        'time-remaining': ['float'],
        energy: ['float'],
        'energy-full': ['float'],
        'energy-rate': ['float'],
      }
    );
  }

  private _proxy: any;

  private _available = false;
  private _percent = -1;
  private _charging = false;
  private _charged = false;
  private _iconName = 'battery-missing-symbolic';
  private _timeRemaining = 0;
  private _energy = 0.0;
  private _energyFull = 0.0;
  private _energyRate = 0.0;

  get available() {
    return this._available;
  }
  get percent() {
    return this._percent;
  }
  get charging() {
    return this._charging;
  }
  get charged() {
    return this._charged;
  }
  get icon_name() {
    return this._iconName;
  }
  get time_remaining() {
    return this._timeRemaining;
  }
  get energy() {
    return this._energy;
  }
  get energy_full() {
    return this._energyFull;
  }
  get energy_rate() {
    return this._energyRate;
  }

  constructor() {
    super();

    this._proxy = new PowerManagerProxy(
      Gio.DBus.system,
      'org.freedesktop.UPower',
      '/org/freedesktop/UPower/devices/DisplayDevice',
      this._initProxy.bind(this)
    );

    this._setInitalBatteryInfo();
  }

  private _initProxy() {
    this._proxy.connect('g-properties-changed', () => this._sync());
    Utils.idle(this._sync.bind(this));
  }

  private _sync() {
    if (!this._proxy.IsPresent) return this.updateProperty('available', false);

    const charging = this._proxy.State === DeviceState.CHARGING;
    const percent = this._proxy.Percentage;
    const charged =
      this._proxy.State === DeviceState.FULLY_CHARGED ||
      (this._proxy.State === DeviceState.CHARGING && percent === 100);

    const level = Math.floor(percent / 10) * 10;
    const state = this._proxy.State === DeviceState.CHARGING ? '-charging' : '';

    const iconName = charged
      ? 'battery-level-100-charged-symbolic'
      : `battery-level-${level}${state}-symbolic`;

    const timeRemaining = charging
      ? this._proxy.TimeToFull
      : this._proxy.TimeToEmpty;

    const energy = this._proxy.Energy;

    const energyFull = this._proxy.EnergyFull;

    const energyRate = this._proxy.EnergyRate;

    this.updateProperty('available', true);
    this.updateProperty('icon-name', iconName);
    this.updateProperty('percent', percent);
    this.updateProperty('charging', charging);
    this.updateProperty('charged', charged);
    this.updateProperty('time-remaining', timeRemaining);
    this.updateProperty('energy', energy);
    this.updateProperty('energy-full', energyFull);
    this.updateProperty('energy-rate', energyRate);
    this.emit('changed');
  }

  /**
   * Inital battery info
   *
   * Allows info to be set before the proxy is ready
   */
  async _setInitalBatteryInfo() {
    const batteryData = await bash(
      'upower -i /org/freedesktop/UPower/devices/DisplayDevice | grep -E "state|percentage|present"'
    );

    const batteryInfo = batteryData.split('\n').reduce(
      (acc, line) => {
        const [key, value] = line.split(':').map((str) => str.trim());
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    // Battery not here
    if (batteryInfo['present'] !== 'yes') return;

    this._available = true;
    this._percent = parseInt(batteryInfo['percentage'].replace('%', ''));
    this._charging = batteryInfo['state'] === 'charging';

    // Manually dervie icon, since it might not match our icon naming
    const fullCharged =
      batteryInfo['state'] === 'fully-charged' ||
      (batteryInfo['state'] === 'charging' && this._percent === 100);
    const level = Math.floor(this._percent / 10) * 10;
    const state = this._charging ? '-charging' : '';

    this._iconName = fullCharged
      ? 'battery-level-100-charged-symbolic'
      : `battery-level-${level}${state}-symbolic`;
  }
}

const batteryService = new BatteryService();
export default batteryService;
