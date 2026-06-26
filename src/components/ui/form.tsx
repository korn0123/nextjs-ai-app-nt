"use client"

import * as React from "react"
import { UseFormReturn, FieldValues, FieldPath, Controller } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Field, FieldLabel, FieldError } from "./field"

const Form = React.forwardRef<HTMLFormElement, React.ComponentPropsWithoutRef<"form">>(
  ({ className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn("space-y-8", className)}
        {...props}
      />
    )
  }
)
Form.displayName = "Form"

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  {
    control,
    name,
    render,
  }: {
    control: UseFormReturn<TFieldValues>["control"]
    name: TName
    render: (field: any, formState: any) => React.ReactElement
  }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => render(field, formState)}
    />
  )
}

const FormItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <Field
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      />
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof FieldLabel>>(
  ({ className, ...props }, ref) => {
    return (
      <FieldLabel
        ref={ref}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex", className)}
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof FieldError> & { children?: React.ReactNode; errors?: any }>(
  ({ className, children, errors, ...props }, ref) => {
    return (
      <FieldError
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        errors={errors}
        {...props}
      >
        {children}
      </FieldError>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }
