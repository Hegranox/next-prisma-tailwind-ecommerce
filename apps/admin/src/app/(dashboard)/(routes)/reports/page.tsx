import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { cookies } from 'next/headers'

import ReportFilters from './components/filters'
import OrderSummary from './components/order-summary'
import TopSellingProducts from './components/top-selling'

async function getOrderSummary(searchParams: string) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/orders/summary?${searchParams}`,
    { cache: 'no-store', headers }
  )

  return await response.json()
}

async function getTopSelling(searchParams: string) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/orders/top-selling?${searchParams}`,
    { cache: 'no-store', headers }
  )

  return await response.json()
}

async function getCategories() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/categories`,
    { cache: 'no-store', headers }
  )

  return await response.json()
}

async function getBrands() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/brands`, {
    cache: 'no-store',
    headers,
  })

  return await response.json()
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const queryString = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString()

  const orderSummaryData = await getOrderSummary(queryString)
  const topSellingData = await getTopSelling(queryString)
  const categoriesData = await getCategories()
  const brandsData = await getBrands()

  return (
    <div className="block space-y-4 my-6">
      <div className="flex items-center justify-between">
        <Heading title="Reports" description="View and manage reports" />
      </div>
      <Separator />

      <ReportFilters categories={categoriesData} brands={brandsData} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Report</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary data={orderSummaryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopSellingProducts data={topSellingData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
