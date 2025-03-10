import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('X-USER-ID')

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)

    if (!Array.from(searchParams.entries()).length) {
      return NextResponse.json([])
    }

    const range = searchParams.get('range') || undefined
    const categories = searchParams.get('categories') || 'all'
    const brands = searchParams.get('brands') || 'all'

    const startDate = range
      ? new Date(range.split('-')[0]).setHours(0, 0, 0, 0)
      : null

    const endDate = range
      ? new Date(range.split('-')[1]).setHours(23, 59, 59, 999)
      : null

    const orders = await prisma.order.findMany({
      where: {
        ...(startDate && endDate
          ? {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
        ...(categories !== 'all' || brands !== 'all'
          ? {
              orderItems: {
                some: {
                  product: {
                    ...(categories !== 'all'
                      ? {
                          categories: {
                            some: {
                              id: categories,
                            },
                          },
                        }
                      : {}),
                    ...(brands !== 'all'
                      ? {
                          brand: {
                            id: brands,
                          },
                        }
                      : {}),
                  },
                },
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    const groupedByProductOrders = orders.reduce(
      (acc, order) => {
        order.orderItems.forEach((orderItem) => {
          const productId = orderItem.productId
          acc[productId] ||= {
            productId,
            title: orderItem.product.title,
            total: 0,
          }

          acc[productId] = {
            ...acc[productId],
            total: (acc[productId].total += orderItem.count),
          }
        })

        return acc
      },
      [] as { productId: number; title: string; total: number }[]
    )

    const formattedProducts = Object.entries(groupedByProductOrders)
      .map(([_, product]) => ({
        ...product,
      }))
      .sort((a, b) => b.total - a.total)

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('[PRODUCT_TOPSELLING_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
