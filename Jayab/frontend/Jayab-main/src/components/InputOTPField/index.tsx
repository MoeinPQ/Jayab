"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export type InputOTPFieldProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  errorClassName?: string;
  maxLength?: number;
  containerClassName?: string;
};

export function InputOTPField<T extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  errorClassName = "text-destructive text-xs mt-1 rtl:text-right ltr:text-left",
  maxLength = 6,
  containerClassName,
  ...rest
}: InputOTPFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
        pattern: {
          value: /^[0-9]*$/,
          message: "فقط اعداد مجاز هستند",
        },
      }}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-0.5">
          <InputOTP
            maxLength={maxLength}
            containerClassName={cn("justify-center", containerClassName)}
            {...field}
            onChange={(value) => {
              if (/^[0-9]*$/.test(value)) {
                field.onChange(value);
              }
            }}
            {...rest}
          >
            <InputOTPGroup>
              {Array.from({ length: Math.ceil(maxLength / 2) }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="h-14 w-14 text-xl" />
              ))}
            </InputOTPGroup>
            {maxLength > 4 && <InputOTPSeparator />}
            <InputOTPGroup>
              {Array.from({ length: Math.floor(maxLength / 2) }).map((_, i) => (
                <InputOTPSlot
                  key={i + Math.ceil(maxLength / 2)}
                  index={i + Math.ceil(maxLength / 2)}
                  className="h-14 w-14 text-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
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
