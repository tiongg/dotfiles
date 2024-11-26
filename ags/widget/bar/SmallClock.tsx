import { GLib, Variable } from 'astal';

/**
 * Displays the time
 */
export default function SmallClock() {
  // 12:00 PM | Fri, 12 July
  const format = '%I:%M %p | %a, %d %b';
  const time = Variable<string>('').poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <eventbox
      onClick={() => {
        // App.toggleWindow(Windows.CALANDAR);
      }}
    >
      <label className="small-clock" label={time()} />
    </eventbox>
  );
}
