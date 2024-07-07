import cn from '@/utils/cn';
import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs';

/**
 * Header for calandar.
 * Displays the month and year, and allows for date navigation.
 */
function CalandarHeader(
  referenceDate: Dayjs,
  onMonthChange: (newMonth: Dayjs) => void
) {
  return Widget.Box({
    className: 'calandar-header',
    homogeneous: true,
    children: [
      Widget.Label({
        className: 'calandar-header-label',
        label: referenceDate.format('MMM YYYY'),
        halign: Align.START,
      }),
      Widget.Box({
        className: 'calandar-navigation',
        halign: Align.END,
        spacing: 4,
        children: [
          Widget.Button({
            className: 'calandar-button',
            onClicked: () => {
              onMonthChange(referenceDate.subtract(1, 'month'));
            },
            label: '<',
          }),
          Widget.Button({
            className: 'calandar-button',
            onClicked: () => {
              onMonthChange(referenceDate.add(1, 'month'));
            },
            label: '>',
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
 */
function CalandarDates(referenceDate: Dayjs, cellSize: number) {
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

export default function Calandar(cellSize: number = 32) {
  const currentDate = dayjs();
  //Refence date will be 01/Month/Year
  const referenceDate = Variable(currentDate.day(1));

  return Widget.Box({
    className: 'calandar',
    vertical: true,
    children: referenceDate.bind().as((rd) => [
      CalandarHeader(rd, (newMonth) => {
        referenceDate.setValue(newMonth);
      }),
      CalandarDays(cellSize),
      CalandarDates(rd, cellSize),
    ]),
  });
}
