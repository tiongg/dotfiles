import cn from '@/utils/cn';
import dayjs, { Dayjs } from 'dayjs';
import Gtk from 'gi://Gtk?version=3.0';
import _ from 'lodash';

/**
 * Header for calandar.
 * Displays the month and year, and allows for date navigation.
 */
function CalandarHeader(
  referenceDate: Dayjs,
  onMonthChange: (newMonth: Dayjs) => void,
  cellSize: number
) {
  // Want to be aligned with the day headers
  // So we subtract the spacing
  const spacing = 4;
  cellSize -= spacing;

  return Widget.Box({
    className: 'calandar-header',
    // homogeneous: true,
    children: [
      Widget.Label({
        className: 'calandar-header-label',
        label: referenceDate.format('MMMM YYYY'),
        halign: Gtk.Align.START,
      }),
      // Padding
      Widget.Box({
        hexpand: true,
      }),
      Widget.Box({
        className: 'calandar-navigation',
        halign: Gtk.Align.END,
        spacing,
        children: [
          Widget.Button({
            className: 'calandar-button',
            onClicked: () => {
              onMonthChange(referenceDate.subtract(1, 'month'));
            },
            label: '<',
            widthRequest: cellSize,
            heightRequest: cellSize,
          }),
          Widget.Button({
            className: 'calandar-button',
            onClicked: () => {
              onMonthChange(referenceDate.add(1, 'month'));
            },
            label: '>',
            widthRequest: cellSize,
            heightRequest: cellSize,
          }),
        ],
      }),
    ],
  });
}

/**
 * Displays the days of the week.
 */
function CalandarDays(cellSize: number) {
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return Widget.Box({
    className: 'calandar-days',
    children: daysOfWeek.map((day) =>
      Widget.Label({
        className: 'calandar-day',
        label: day,
        widthRequest: cellSize + 2,
        heightRequest: cellSize,
      })
    ),
  });
}

/**
 * Displays dates in the given month.
 * Note that the first day shown might not be
 * the first day of the month.
 * @param referenceDate - Reference date
 * @param cellSize - Size of each cell
 * @param keepConsisent - If true, the calandar will always have 6 rows
 */
function CalandarDates(
  referenceDate: Dayjs,
  cellSize: number,
  keepConsisent: boolean
) {
  const daysInMonth = referenceDate.daysInMonth();
  const firstDay = referenceDate.startOf('month');
  const lastDay = referenceDate.endOf('month');
  const today = dayjs();

  const dates = _.range(daysInMonth).map((day) => ({
    day: firstDay.add(day, 'days'),
    isInMonth: true, //If it belongs to reference month
  }));

  // First day not Sunday, backfill with prev month
  if (firstDay.day() !== 0) {
    const backfillAmount = firstDay.day();
    const fillDates = _.range(1, backfillAmount + 1).map((offset) => ({
      day: firstDay.subtract(offset, 'days'),
      isInMonth: false,
    }));
    dates.unshift(...fillDates);
  }

  // Last day is not a Saturday, fill with next month
  if (lastDay.day() !== 6) {
    //Can assume that next month has >7 days
    const fillAmount = 6 - lastDay.day();
    const fillDates = _.range(1, fillAmount + 1).map((offset) => ({
      day: lastDay.add(offset, 'days'),
      isInMonth: false,
    }));

    dates.push(...fillDates);
  }

  // If we have less than 6 rows, fill with next month
  // This is to account for months that have 5 weeks (i.e Jun 2024)
  if (dates.length / 7 < 6 && keepConsisent) {
    const initalOffset = 6 - lastDay.day();
    // Current calandar will already have 7 columns (Sun - Sat)
    // Only have to fill the next week
    const fillDates = _.range(7).map((offset) => ({
      day: lastDay.add(initalOffset + offset + 1, 'days'),
      isInMonth: false,
    }));

    dates.push(...fillDates);
  }

  const dateRows = _.chunk(dates, 7);

  return Widget.Box({
    className: 'calandar-dates',
    vertical: true,
    children: dateRows.map((dates) =>
      Widget.Box({
        vertical: false,
        className: 'calandar-rows',
        children: dates.map(({ day, isInMonth }) =>
          Widget.Label({
            className: cn(
              'calandar-date',
              isInMonth ? '' : 'disabled',
              day.isSame(today, 'day') ? 'today' : ''
            ),
            label: `${day.date()}`,
            widthRequest: cellSize + 2,
            heightRequest: cellSize,
          })
        ),
      })
    ),
  });
}

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
 * Calandar widget
 */
export default function Calandar({
  cellSize = 32,
  keepConsisent = true,
}: CalandarProps = {}) {
  const currentDate = dayjs();
  //Refence date will be 01/Month/Year
  const referenceDate = Variable(currentDate.date(1));

  return Widget.Box({
    className: 'calandar',
    vertical: true,
    children: referenceDate.bind().as((rd) => [
      CalandarHeader(
        rd,
        (newMonth) => {
          referenceDate.setValue(newMonth);
        },
        cellSize
      ),
      CalandarDays(cellSize),
      CalandarDates(rd, cellSize, keepConsisent),
    ]),
  });
}
