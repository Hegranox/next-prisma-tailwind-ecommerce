'use client'

import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { isVariableValid } from '@/lib/utils'
import { ProductWithIncludes } from '@/types/prisma'
import { useEffect, useState } from 'react'

import { ProductFilter } from './components/filters'

export default async function Products() {
  const [products, setProducts] = useState<ProductWithIncludes[]>([])

  const handleLoadProducts = async (values: any) => {
    const response = await fetch('/api/products/list', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    const products = await response.json()
    setProducts(products)
  }

  useEffect(() => {
    handleLoadProducts({})
  }, [])

  return (
    <>
      <Heading
        title="Products"
        description="Below is a list of products you have in your cart."
      />
      <Separator />

      {isVariableValid(products) ? (
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3">
            <ProductFilter onSubmit={handleLoadProducts} />
          </div>

          <div className="col-span-9">
            <ProductGrid products={products} />
          </div>
        </div>
      ) : (
        <ProductSkeletonGrid />
      )}
    </>
  )
}
