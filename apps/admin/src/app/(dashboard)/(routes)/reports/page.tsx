'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { formatter } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import ReportFilters from './components/filters'
import OrderSummary from './components/order-summary'
import TopSellingProducts from './components/top-selling'
import Loading from './loading'

type OrderSummary = {
  date: string
  total: number
}

type TopSelling = {
  productId: string
  title: string
  total: number
}

export default function ReportsPage() {
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<OrderSummary[]>([])
  const [topSelling, setTopSelling] = useState<TopSelling[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true) // Set loading to true at the start

      try {
        const [orderSummaryResponse, topSellingResponse] = await Promise.all([
          fetch(`/api/orders/summary?${searchParams.toString()}`),
          fetch(`/api/orders/top-selling?${searchParams.toString()}`),
        ])

        const [orderSummaryData, topSellingData] = await Promise.all([
          orderSummaryResponse.json(),
          topSellingResponse.json(),
        ])

        setSummary(orderSummaryData)
        setTopSelling(topSellingData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  return (
    <div className="block space-y-4 my-6">
      <div className="flex items-center justify-between">
        <Heading title="Reports" description="View and manage reports" />
      </div>
      <Separator />

      <ReportFilters />

      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Report</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="loader">Loading...</div>
              </div>
            ) : (
              <OrderSummary data={summary} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="loader">Loading...</div>
              </div>
            ) : (
              <TopSellingProducts data={topSelling} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
