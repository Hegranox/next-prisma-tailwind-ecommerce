'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

const TextField = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TextField.displayName = 'TextField'

const TextFieldInput = React.forwardRef<
  React.ElementRef<'input'>,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
})
TextFieldInput.displayName = 'TextFieldInput'

const TextFieldSlot = React.forwardRef<
  React.ElementRef<'span'>,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('flex items-center text-muted-foreground pr-1', className)}
      {...props}
    >
      {children}
    </span>
  )
})
TextFieldSlot.displayName = 'TextFieldSlot'

export { TextField, TextFieldInput, TextFieldSlot }
