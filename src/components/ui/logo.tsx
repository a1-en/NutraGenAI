'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl'
}

export function Logo({ size = 'md', className, showText = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <Image
          src="/logo.svg"
          alt="NutraGenAI Logo"
          width={40}
          height={40}
          className="w-full h-full"
          priority
        />
      </div>
      {showText && (
        <span className={cn('font-bold text-foreground', textSizes[size])}>
          NutraGenAI
        </span>
      )}
    </div>
  )
} 