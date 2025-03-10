import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { sendMail } from '@persepolis/mail'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const OTP = generateSerial({})

    const { email } = await req.json()

    if (isEmailValid(email)) {
      const user = await prisma.user.findFirst({
        where: { email },
      })

      console.log('🚀 ~ POST ~ user:', user)

      if (!user) {
        return getErrorResponse(400, 'User not found')
      }

      if (!user.isAdmin) {
        return getErrorResponse(
          400,
          'You do not have the necessary access permissions'
        )
      }

      await prisma.user.update({
        where: { email: email.toString().toLowerCase() },
        data: { OTP },
      })

      await sendMail({
        name: config.name,
        to: email,
        subject: 'Verify your email.',
        html: await render(Mail({ code: OTP, name: config.name })),
      })

      return new NextResponse(
        JSON.stringify({
          status: 'success',
          email,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!isEmailValid(email)) {
      return getErrorResponse(400, 'Incorrect Email')
    }
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      return getErrorResponse(400, 'failed validations', error)
    }

    return getErrorResponse(500, error.message)
  }
}
