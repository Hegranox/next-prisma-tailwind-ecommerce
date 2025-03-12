import Carousel from '@/components/native/Carousel'
import { Product as CrossSellProduct } from '@/components/native/Product'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

import { DataSection } from './components/data'

type Props = {
  params: { productId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getProduto(productId: string) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/${productId}`,
    { cache: 'no-store', headers }
  )

  return await response.json()
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
  })

  return {
    title: product.title,
    description: product.description,
    keywords: product.keywords,
    openGraph: {
      images: product.images,
    },
  }
}

export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  const product = await getProduto(params.productId)

  if (isVariableValid(product)) {
    return (
      <>
        <Breadcrumbs product={product} />
        <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-3">
          <ImageColumn product={product} />
          <DataSection product={product} />
        </div>

        {product.crossSellProducts.length ? (
          <div className="mt-5">
            <h3 className="mb-4 text-xl font-medium">You might also like</h3>
            <div className="flex gap-2 overflow-x-auto">
              {product.crossSellProducts.map((product) => (
                <div key={product.id} className="min-w-80">
                  <CrossSellProduct product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </>
    )
  }
}

const ImageColumn = ({ product }) => {
  return (
    <div className="relative min-h-[50vh] w-full col-span-1">
      <Carousel images={product?.images} />
    </div>
  )
}

const Breadcrumbs = ({ product }) => {
  return (
    <nav className="flex text-muted-foreground" aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-2">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium"
          >
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center gap-2">
            <ChevronRightIcon className="h-4" />
            <Link className="text-sm font-medium" href="/products">
              Products
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center gap-2">
            <ChevronRightIcon className="h-4" />
            <span className="text-sm font-medium">{product?.title}</span>
          </div>
        </li>
      </ol>
    </nav>
  )
}
