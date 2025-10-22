import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
} from "react-aria-components";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

function RangePicker({ className, setRangeFilter = () => {} }) {
  const [range, setRange] = useState({ start: null, end: null });
  return (
    <DateRangePicker
      className={`inline-block ${className}`}
      value={range}
      onChange={(range) => {
        setRangeFilter({
          start: range.start.toDate().toISOString(),
          end: range.end.toDate().toISOString(),
        });
        setRange(range);
      }}
      locale="en-GB"
      granularity="day"
    >
      <Label className="block text-sm font-medium text-gray-700 mb-1">
        Select range of dates
      </Label>
      <Group className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
        <DateInput slot="start" className="flex items-center text-gray-900">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-1 rounded outline-none focus:bg-green-50 data-[placeholder]:text-gray-400"
            />
          )}
        </DateInput>
        <span aria-hidden="true" className="text-gray-400">
          –
        </span>
        <DateInput slot="end" className="flex items-center text-gray-900">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-1 rounded outline-none focus:bg-green-50 data-[placeholder]:text-gray-400"
            />
          )}
        </DateInput>
        <Button className="ml-1 p-1 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
          <FaChevronDown size={18} />
        </Button>
      </Group>
      <Popover className="z-50">
        <Dialog className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <RangeCalendar className="p-1">
            <header className="flex items-center justify-between px-1 py-2">
              <Button
                slot="previous"
                className="p-1 cursor-pointer rounded text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FaChevronLeft size={18} />
              </Button>
              <Heading className="text-sm font-semibold text-gray-900" />
              <Button
                slot="next"
                className="p-1 cursor-pointer rounded text-gray-600 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FaChevronRight size={18} />
              </Button>
            </header>
            <CalendarGrid className="p-2 text-sm">
              {(date) => (
                <CalendarCell
                  date={date}
                  className="w-9 h-9 grid place-items-center rounded text-gray-700 hover:bg-gray-200 data-[selected]:bg-green-600 data-[selected]:text-white data-[focused]:ring-2 data-[focused]:ring-green-500"
                />
              )}
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
}

export default RangePicker;
