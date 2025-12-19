import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90',
        secondary:
          'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:bg-destructive/90',
        outline: 'text-foreground border-border',
        warning:
          'border-yellow-200 bg-yellow-50 text-yellow-800 shadow-sm hover:bg-yellow-100 dark:border-yellow-900/50 dark:bg-yellow-950/50 dark:text-yellow-400 dark:hover:bg-yellow-900/40',
        success:
          'border-green-200 bg-green-50 text-green-800 shadow-sm hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-900/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>

