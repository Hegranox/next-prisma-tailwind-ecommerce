import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { isVariableValid } from '@/lib/utils'
import { cookies } from 'next/headers'

import ProductFilter from './components/filters'

async function getCategories() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/list`,
    { cache: 'no-store', headers }
  )

  return await response.json()
}

async function getBrands() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/brands/list`,
    { cache: 'no-store', headers }
  )

  return await response.json()
}

async function getProducts(searchParams: string) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/list?${searchParams}`,
    { cache: 'no-store', headers }
  )

  return await response.json()
}

interface ProductsProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Products({ searchParams }: ProductsProps) {
  const queryString = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString()

  const productsData = await getProducts(queryString)
  const categoriesData = await getCategories()
  const brandsData = await getBrands()

  return (
    <>
      <Heading
        title="Products"
        description="Below is a list of products you have in your cart."
      />
      <Separator />

      {isVariableValid(productsData) ? (
        <div className="grid grid-cols-12 gap-2">
          <div className="hidden md:block md:col-span-4 xl:col-span-3">
            <ProductFilter brands={brandsData} categories={categoriesData} />
          </div>

          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-96 p-4 overflow-auto">
                <ProductFilter
                  brands={brandsData}
                  categories={categoriesData}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="col-span-12 md:col-span-8 xl:col-span-9">
            <ProductGrid products={productsData} />
          </div>
        </div>
      ) : (
        <ProductSkeletonGrid />
      )}
    </>
  )
}
