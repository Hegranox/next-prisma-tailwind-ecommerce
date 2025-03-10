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
            product: {
              include: {
                brand: true,
                categories: true,
              },
            },
          },
        },
      },
    })
    console.log('🚀 ~ GET ~ orders:', JSON.stringify(orders, null, 2))

    const groupedByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toUTCString()
      acc[date] ||= 0
      acc[date] += order.payable
      return acc
    }, {})

    const formattedOrders = Object.entries(groupedByDate).map(
      ([date, total]) => ({
        date,
        total,
      })
    )

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('[ORDER_SUMMARY_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
