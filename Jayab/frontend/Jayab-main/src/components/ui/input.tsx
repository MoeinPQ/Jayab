"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { cn } from "@/lib/utils";

export type InputProps<T extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<"input">,
  "name" | "defaultValue" | "ref"
> & {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  /** override text classes for the error message */
  errorClassName?: string;
};

export function Input<T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  className,
  errorClassName = "text-destructive text-xs mt-1 rtl:text-right ltr:text-left",
  type = "text",
  ...rest
}: InputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-0.5">
          <input
            {...field}
            {...rest}
            type={type}
            data-slot="input"
            aria-invalid={fieldState.invalid}
            className={cn(
              // بقیه کلاس‌ها مثل قبل
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
              "dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
              "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              // تغییر رنگ حاشیه و رینگ فقط روی فوکوس
              "focus-visible:border-blue-600 focus-visible:ring-blue-600/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              fieldState.invalid && "border-destructive",
              className
            )}
          />
          {fieldState.error?.message && (
            <span dir="rtl" aria-live="polite" className={errorClassName}>
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
