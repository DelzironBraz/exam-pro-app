'use client'

import type { ReactNode } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface FormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  onSubmit: () => void | Promise<void>
  submitLabel?: string
  loading?: boolean
  wide?: boolean
}

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = 'Salvar',
  loading = false,
  wide = false,
}: FormDrawerProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        className={
          wide
            ? 'data-[vaul-drawer-direction=right]:sm:max-w-xl data-[vaul-drawer-direction=right]:w-full'
            : 'data-[vaul-drawer-direction=right]:sm:max-w-md data-[vaul-drawer-direction=right]:w-full'
        }
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
          <DrawerFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : submitLabel}
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
