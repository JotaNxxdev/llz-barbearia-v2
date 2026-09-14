'use client'

import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            'bg-card! text-card-foreground! border-border! rounded-xl! shadow-lg!',
          title: 'font-medium',
          description: 'text-muted-foreground!',
          actionButton: 'bg-primary! text-primary-foreground!',
          cancelButton: 'bg-secondary! text-secondary-foreground!',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
