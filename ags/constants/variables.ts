import { Variable } from 'astal';
import GLib from 'gi://GLib';

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

export const clock = Variable(GLib.DateTime.new_now_local()).poll(
  ONE_MINUTE,
  () => GLib.DateTime.new_now_local()
);

export const uptime = Variable(0).poll(
  ONE_MINUTE,
  'cat /proc/uptime',
  line => Number.parseInt(line.split('.')[0]) / 60
);

export const distro = {
  id: GLib.get_os_info('ID'),
  logo: GLib.get_os_info('LOGO'),
};

/**
 * The amount to change by when scrolling.
 *
 * This is assuming it is a scale of 0-1
 */
export const SCROLL_DELTA = 0.005;
