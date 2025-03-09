import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('[CATEGORY_LIST_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
