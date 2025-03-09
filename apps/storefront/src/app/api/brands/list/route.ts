import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const brands = await prisma.brand.findMany()
    return NextResponse.json(brands)
  } catch (error) {
    console.error('[BRAND_LIST_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
