import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('X-USER-ID')

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const {
      text_search,
      price_range_min,
      price_range_max,
      categories,
      brand,
      order_selector,
    } = await req.json()

    console.log('🚀 ~ POST ~ text_search:', text_search)

    const products = await prisma.product.findMany({
      where: {
        ...(text_search
          ? {
              title: {
                contains: text_search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      include: {
        brand: true,
        categories: true,
      },
    })
    // console.log('🚀 ~ POST ~ products:', products)

    // const products = await prisma.product.findMany({
    //   include: {
    //     brand: true,
    //     categories: true,
    //   },
    // })

    return NextResponse.json(products)
  } catch (error) {
    console.error('[PRODUCT_LIST_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
