import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50"
    
    const variantStyles = {
      default: "bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-sm",
      destructive: "bg-red-500 text-slate-50 hover:bg-red-600 shadow-sm",
      outline: "border border-slate-300 bg-white/60 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
    }
    
    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    }
    
    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
