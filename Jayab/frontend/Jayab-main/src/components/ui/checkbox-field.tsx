"use client";

import * as React from "react";
import { Control, Controller } from "react-hook-form";
import { Checkbox } from "./checkbox";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function CheckboxField({
  name,
  control,
  label,
  description,
  className,
  disabled,
  ...props
}: CheckboxFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-2", className)} dir="rtl">
          <div className="flex items-center gap-2">
            <label
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 order-1"
            >
              {label}
            </label>
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn(
                "order-2",
                fieldState.error ? "border-red-500" : ""
              )}
              {...props}
            />
          </div>
          {description && (
            <p className="text-sm text-muted-foreground text-right">
              {description}
            </p>
          )}
          {fieldState.error && (
            <p className="text-sm text-red-500 text-right">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
