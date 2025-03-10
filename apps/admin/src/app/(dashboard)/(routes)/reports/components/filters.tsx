'use client'

import DateRangePicker from '@/components/ui/range-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import moment from 'moment'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface ReportFiltersProps {
  categories: { id: string; title: string }[]
  brands: { id: string; title: string }[]
}

export default function ReportFilters({
  categories,
  brands,
}: ReportFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialStartDateRange = moment().startOf('month')
  const initialEndDateRange = moment().endOf('month')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      <DateRangePicker
        initialRange={{
          from: initialStartDateRange.toDate(),
          to: initialEndDateRange.toDate(),
        }}
        onRangeChange={(range) => {
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          )

          if (!range) {
            current.set('range', '')
          } else {
            current.set(
              'range',
              `${moment(range.from).format('MM/DD/YYYY')}-${moment(range.to).format('MM/DD/YYYY')}`
            )
          }

          const search = current.toString()
          const query = search ? `?${search}` : ''

          router.replace(`${pathname}${query}`, {
            scroll: false,
          })
        }}
      />

      <Select
        defaultValue="all"
        onValueChange={(currentValue) => {
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          )

          current.set('categories', currentValue)

          const search = current.toString()
          const query = search ? `?${search}` : ''

          router.replace(`${pathname}${query}`, {
            scroll: false,
          })
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue="all"
        onValueChange={(currentValue) => {
          const current = new URLSearchParams(
            Array.from(searchParams.entries())
          )

          current.set('brands', currentValue)

          const search = current.toString()
          const query = search ? `?${search}` : ''

          router.replace(`${pathname}${query}`, {
            scroll: false,
          })
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
