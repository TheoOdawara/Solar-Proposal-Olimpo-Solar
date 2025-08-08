import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  onValidate?: (value: string) => void
  realTimeValidation?: boolean
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success, 
    helperText, 
    onValidate,
    realTimeValidation = false,
    ...props 
  }, ref) => {
    const [touched, setTouched] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(props.value || '')

    const hasError = error && touched
    const hasSuccess = success && touched && !error

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      if (onValidate) {
        onValidate(e.target.value)
      }
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInternalValue(value)
      
      if (realTimeValidation && touched && onValidate) {
        onValidate(value)
      }
      
      props.onChange?.(e)
    }

    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={props.id} 
            className={cn(
              "text-sm font-medium",
              hasError && "text-destructive",
              hasSuccess && "text-success"
            )}
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Input
            type={type}
            className={cn(
              "transition-all duration-200",
              hasError && "border-destructive focus:border-destructive focus:ring-destructive/20",
              hasSuccess && "border-success focus:border-success focus:ring-success/20",
              "pr-10",
              className
            )}
            ref={ref}
            {...props}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          
          {/* Status icon */}
          {(hasError || hasSuccess) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {hasError && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {hasSuccess && (
                <CheckCircle className="h-4 w-4 text-success" />
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !hasError && (
          <p className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }