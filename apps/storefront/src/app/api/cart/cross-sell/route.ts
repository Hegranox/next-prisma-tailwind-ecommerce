import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('X-USER-ID')

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                categories: true,
                crossSellProducts: {
                  include: {
                    brand: true,
                    categories: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const cartProducts = cart.items.map((item) => item.productId)

    const crossSell = cart.items.reduce((acc, item) => {
      item.product.crossSellProducts
        .filter((item) => !cartProducts.includes(item.id))
        .forEach((product) => (acc[product.id] ||= product))

      return acc
    }, [])

    const crossSellProducts = Object.entries(crossSell).map(([_, product]) => ({
      ...product,
    }))

    return NextResponse.json(crossSellProducts)
  } catch (error) {
    console.error('[GET_CART_CROSS_SELL]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
