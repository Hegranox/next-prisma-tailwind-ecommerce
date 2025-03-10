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
import { useEffect, useState } from 'react'

export default function ReportFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  const initialStartDateRange = moment().subtract(1, 'year').startOf('year')
  const initialEndDateRange = moment().endOf('month')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ])

        const [categoriesData, brandsData] = await Promise.all([
          categoriesResponse.json(),
          brandsResponse.json(),
        ])

        setCategories(categoriesData)
        setBrands(brandsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const current = new URLSearchParams(Array.from(searchParams.entries()))

    current.set(
      'range',
      `${initialStartDateRange.format('MM/DD/YYYY')}-${initialEndDateRange.format('MM/DD/YYYY')}`
    )

    current.set('categories', 'all')
    current.set('brands', 'all')

    const search = current.toString()
    const query = search ? `?${search}` : ''

    router.replace(`${pathname}${query}`, {
      scroll: false,
    })

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
          {isLoading ? (
            <SelectItem value="all" disabled>
              Loading categories...
            </SelectItem>
          ) : (
            <>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </>
          )}
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
          {isLoading ? (
            <SelectItem value="all" disabled>
              Loading brands...
            </SelectItem>
          ) : (
            <>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.title}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
