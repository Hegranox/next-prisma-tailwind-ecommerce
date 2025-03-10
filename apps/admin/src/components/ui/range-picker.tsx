'use client'

import { cn } from '@/lib/utils'
import * as Popover from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange, DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface DateRangePickerProps {
  initialRange?: DateRange
  onRangeChange?: (range: DateRange | undefined) => void
}

export default function DateRangePicker({
  initialRange,
  onRangeChange,
}: DateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(initialRange)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    initialRange
  )
  const [open, setOpen] = React.useState(false)

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    setTempRange(selectedRange)
  }

  const handleConfirmRange = () => {
    setRange(tempRange)
    onRangeChange?.(tempRange)
    setOpen(false)
  }

  const formattedRange =
    range?.from && range?.to
      ? `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`
      : 'Pick a date range'

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 border px-4 py-2 text-sm rounded-md transition-colors',
            'bg-white text-black dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600',
            'hover:bg-gray-100 dark:hover:bg-gray-700 w-full'
          )}
        >
          <CalendarIcon className="w-5 h-5" />
          {formattedRange}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            'p-4 shadow-lg rounded-md border',
            'bg-white text-black dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700'
          )}
        >
          <DayPicker
            mode="range"
            selected={tempRange}
            onSelect={handleRangeSelect}
            numberOfMonths={2}
            classNames={{
              range_middle: 'rdp-range_middle dark:bg-gray-700',
            }}
          />
          {/* Confirm button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleConfirmRange}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Confirm
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
