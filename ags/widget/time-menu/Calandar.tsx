import { isToday } from '@/utils/utils';
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import GLib from 'gi://GLib';
import _ from 'lodash';

type DateTime = GLib.DateTime;

type CalandarHeaderProps = {
  referenceDateVariable: Variable<DateTime>;
  cellSize: number;
};

type CalandarDaysProps = {
  cellSize: number;
};

type CalandarDatesProps = {
  referenceDate: DateTime;
  cellSize: number;
  keepConsisent: boolean;
};

export type CalandarProps = {
  /**
   * Size of each cell (Header & date)
   * @default 32
   */
  cellSize?: number;

  /**
   * If true, the calandar will always have 6 rows
   * @default true
   */
  keepConsisent?: boolean;
};

/**
 * Header for calandar.
 * Displays the month and year, and allows for date navigation.
 */
function CalandarHeader({
  referenceDateVariable,
  cellSize,
}: CalandarHeaderProps) {
  // Want to be aligned with the day headers
  // So we subtract the spacing
  const spacing = 4;
  cellSize -= spacing;

  return (
    <box className="calandar-header" hexpand={false}>
      <label
        className="calandar-header-label"
        halign={Gtk.Align.START}
        label={bind(referenceDateVariable).as(date => date.format('%B %Y')!)}
      />
      <box
        className="calandar-navigation"
        halign={Gtk.Align.END}
        spacing={spacing}
        hexpand
      >
        <button
          className="calandar-button"
          onClick={() => {
            referenceDateVariable.set(
              referenceDateVariable.get().add_months(-1)!
            );
          }}
          label="<"
          widthRequest={cellSize}
          heightRequest={cellSize}
        />
        <button
          className="calandar-button"
          onClick={() => {
            referenceDateVariable.set(
              referenceDateVariable.get().add_months(1)!
            );
          }}
          label=">"
          widthRequest={cellSize}
          heightRequest={cellSize}
        />
      </box>
    </box>
  );
}

/**
 * Displays the days of the week.
 */
function CalandarDays({ cellSize }: CalandarDaysProps) {
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <box className="calandar-days" name="calandar-days">
      {daysOfWeek.map(day => (
        <label
          className="calandar-day"
          label={day}
          widthRequest={cellSize + 2}
          heightRequest={cellSize}
        />
      ))}
    </box>
  );
}

/**
 * Displays dates in the given month.
 * Note that the first day shown might not be
 * the first day of the month.
 * @param referenceDate - Reference date
 * @param cellSize - Size of each cell
 * @param keepConsisent - If true, the calandar will always have 6 rows
 */
function CalandarDates({
  referenceDate,
  cellSize,
  keepConsisent,
}: CalandarDatesProps) {
  const firstDay = referenceDate;
  const lastDay = referenceDate.add_months(1)!.add_days(-1)!;
  const daysInMonth = lastDay.get_day_of_month();

  const dates = _.range(daysInMonth).map(day => ({
    day: referenceDate.add_days(day)!,
    isInMonth: true, //If it belongs to reference month
  }));

  // First day not Sunday, backfill with prev month
  if (firstDay.get_day_of_week() !== 7) {
    const backfillAmount = firstDay.get_day_of_week();
    const fillDates = _.range(backfillAmount, 0, -1).map(offset => ({
      day: firstDay.add_days(-offset)!,
      isInMonth: false,
    }));
    // Append to front
    dates.unshift(...fillDates);
  }

  // Last day is not a Saturday, fill with next month
  if (lastDay.get_day_of_week() !== 6) {
    //Can assume that next month has >7 days
    const fillAmount = 6 - (lastDay.get_day_of_week() % 7);
    const fillDates = _.range(1, fillAmount + 1).map(offset => ({
      day: lastDay.add_days(offset)!,
      isInMonth: false,
    }));

    dates.push(...fillDates);
  }

  // If we have less than 6 rows, fill with next month
  // This is to account for months that have 5 weeks (i.e Jun 2024)
  if (dates.length / 7 < 6 && keepConsisent) {
    const initalOffset = 6 - (lastDay.get_day_of_week() % 7);
    // Current calandar will already have 7 columns (Sun - Sat)
    // Only have to fill the next week
    const fillDates = _.range(7).map(offset => ({
      day: lastDay.add_days(initalOffset + offset + 1)!,
      isInMonth: false,
    }));

    dates.push(...fillDates);
  }

  const dateRows = _.chunk(dates, 7);

  return (
    <box
      className="calandar-dates"
      vertical
      name={`${referenceDate.format('%B-%Y')}`}
    >
      {dateRows.map(dates => (
        <box className="calandar-rows">
          {dates.map(({ day, isInMonth }) => (
            <label
              className={`calandar-date ${isInMonth ? '' : 'disabled'} ${
                isToday(day) ? 'today' : ''
              }`}
              label={`${day.get_day_of_month()}`}
              widthRequest={cellSize + 2}
              heightRequest={cellSize}
            />
          ))}
        </box>
      ))}
    </box>
  );
}

/**
 * Calandar widget
 */
export default function Calandar({
  cellSize = 32,
  keepConsisent = true,
}: CalandarProps = {}) {
  const currentDate = GLib.DateTime.new_now_local();
  //Refence date will be 01/Month/Year
  const startOfMonth = GLib.DateTime.new_local(
    currentDate.get_year(),
    currentDate.get_month(),
    1,
    0,
    0,
    0
  );
  const referenceDateVariable = Variable(startOfMonth);
  // Used to track if transitioning to next or prev month
  let prevDate = referenceDateVariable.get();

  return (
    <box className="calandar" vertical>
      <CalandarHeader
        referenceDateVariable={referenceDateVariable}
        cellSize={cellSize}
      />
      <CalandarDays cellSize={cellSize} />
      <stack
        // Using SLIDE_LEFT_RIGHT doesn't work
        // The reference date is updated before the transition finishes
        // It will always transition to the right
        transitionType={bind(referenceDateVariable).as(date => {
          const diff = date.difference(prevDate);
          prevDate = date;
          return diff > 0
            ? Gtk.StackTransitionType.SLIDE_LEFT
            : Gtk.StackTransitionType.SLIDE_RIGHT;
        })}
        transitionDuration={200}
        shown={bind(referenceDateVariable).as(
          referenceDate => referenceDate.format('%B-%Y')!
        )}
      >
        {bind(referenceDateVariable).as(referenceDate => (
          <>
            <CalandarDates
              referenceDate={referenceDateVariable.get().add_months(-1)!}
              cellSize={cellSize}
              keepConsisent={keepConsisent}
            />
            <CalandarDates
              referenceDate={referenceDate}
              cellSize={cellSize}
              keepConsisent={keepConsisent}
            />
            <CalandarDates
              referenceDate={referenceDateVariable.get().add_months(1)!}
              cellSize={cellSize}
              keepConsisent={keepConsisent}
            />
          </>
        ))}
      </stack>
    </box>
  );
}
