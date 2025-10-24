import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  color?: string
}

/**
 * Shadcn-style Progress component
 * Usage: <Progress value={60} />
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color, ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), max)

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-muted",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300",
            color ? "" : "bg-primary"
          )}
          style={{
            width: `${(percentage / max) * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
