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
        ...(price_range_min ? { price: { gte: price_range_min } } : {}),
        ...(price_range_max ? { price: { lte: price_range_max } } : {}),
        ...(categories?.length
          ? { categories: { some: { id: { in: categories } } } }
          : {}),
        ...(brand ? { brand: { id: brand } } : {}),
      },
      orderBy: {
        ...(order_selector && order_selector === 'most_expensive'
          ? { price: 'desc' }
          : {}),
        ...(order_selector && order_selector === 'least_expensive'
          ? { price: 'asc' }
          : {}),
        ...(order_selector && order_selector === 'title_order_asc'
          ? { title: 'asc' }
          : {}),
        ...(order_selector && order_selector === 'title_order_desc'
          ? { title: 'desc' }
          : {}),
        ...(!order_selector ? { price: 'desc' } : {}),
      },
      include: {
        brand: true,
        categories: true,
      },
    })

    const productsFilteringDiscount = products.filter((item) =>
      price_range_min
        ? item.price - item.discount >= price_range_min
        : true && price_range_max
          ? item.price - item.discount <= price_range_max
          : true
    )

    return NextResponse.json(productsFilteringDiscount)
  } catch (error) {
    console.error('[PRODUCT_LIST_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
