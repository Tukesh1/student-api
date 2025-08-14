import { type ClassValue, clsx } from "clsx"
import { cva, type VariantProps } from "class-variance-authority"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Button variants
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
        destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-slate-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Card variants
export const cardVariants = cva(
  "rounded-lg border bg-white text-slate-950 shadow",
  {
    variants: {
      variant: {
        default: "border-slate-200",
        outline: "border-2 border-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Input variants
export const inputVariants = cva(
  "flex w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-9",
        sm: "h-8",
        lg: "h-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export type ButtonProps = VariantProps<typeof buttonVariants>
export type CardProps = VariantProps<typeof cardVariants>
export type InputProps = VariantProps<typeof inputVariants>
