"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Users, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useGetVillaBookedDates,
  usePostUserReservation,
} from "@/hooks/api/user-reservations";
import toast from "react-hot-toast";

const bookingSchema = z
  .object({
    check_in_date: z.date({
      required_error: "تاریخ ورود الزامی است",
    }),
    check_out_date: z.date({
      required_error: "تاریخ خروج الزامی است",
    }),
    people_count: z
      .number({
        required_error: "تعداد نفرات الزامی است",
      })
      .min(1, "تعداد نفرات باید حداقل ۱ نفر باشد"),
  })
  .refine((data) => data.check_out_date > data.check_in_date, {
    message: "تاریخ خروج باید بعد از تاریخ ورود باشد",
    path: ["check_out_date"],
  });

type BookingFormData = z.infer<typeof bookingSchema>;

interface VillaBookingFormProps {
  villaId: number;
  baseCapacity: number;
  maximumCapacity: number;
  basePricePerNight: number;
  extraPersonPrice: number;
}

export default function VillaBookingForm({
  villaId,
  baseCapacity,
  maximumCapacity,
  basePricePerNight,
  extraPersonPrice,
}: VillaBookingFormProps) {
  const { data: bookedDates } = useGetVillaBookedDates(villaId);
  const postReservation = usePostUserReservation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      people_count: 1,
    },
  });

  const checkInDate = watch("check_in_date");
  const checkOutDate = watch("check_out_date");
  const peopleCount = watch("people_count");

  // Function to check if a date range conflicts with booked dates
  const isDateRangeConflicting = (startDate: Date, endDate: Date) => {
    if (!bookedDates || !startDate || !endDate) return false;

    return bookedDates.some((booking: any) => {
      const bookingStart = new Date(booking.check_in_date);
      const bookingEnd = new Date(booking.check_out_date);

      // Check if the date ranges overlap (excluding same-day check-in/check-out)
      return startDate < bookingEnd && endDate > bookingStart;
    });
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !peopleCount) return 0;

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return 0;

    const basePrice = basePricePerNight * nights;
    const extraPersons = Math.max(0, peopleCount - baseCapacity);
    const extraPrice = extraPersons * extraPersonPrice * nights;

    return basePrice + extraPrice;
  };

  const onSubmit = (data: BookingFormData) => {
    // Check for date conflicts
    if (isDateRangeConflicting(data.check_in_date, data.check_out_date)) {
      toast.error("تاریخ‌های انتخابی با رزرو موجود تداخل دارد");
      return;
    }

    const reservationData = {
      villa_id: villaId,
      check_in_date: format(data.check_in_date, "yyyy-MM-dd"),
      check_out_date: format(data.check_out_date, "yyyy-MM-dd"),
      people_count: data.people_count,
    };

    postReservation.mutate(reservationData, {
      onSuccess: () => {
        toast.success("رزرو با موفقیت انجام شد");
      },
      onError: (error: any) => {
        console.error("Booking failed:", error);
        toast.error("خطا در رزرو. لطفاً دوباره تلاش کنید.");
      },
    });
  };

  const totalPrice = calculateTotalPrice();
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">رزرو ویلا</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاریخ ورود
          </label>
          <Controller
            control={control}
            name="check_in_date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !field.value && "text-muted-foreground",
                      errors.check_in_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "yyyy/MM/dd")
                    ) : (
                      <span>انتخاب تاریخ ورود</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() ||
                      (bookedDates &&
                        bookedDates.some((booking: any) => {
                          const bookingStart = new Date(booking.check_in_date);
                          const bookingEnd = new Date(booking.check_out_date);
                          // Disable dates that are strictly between check-in and check-out (exclusive)
                          return date > bookingStart && date < bookingEnd;
                        }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.check_in_date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.check_in_date.message}
            </p>
          )}
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاریخ خروج
          </label>
          <Controller
            control={control}
            name="check_out_date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !field.value && "text-muted-foreground",
                      errors.check_out_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "yyyy/MM/dd")
                    ) : (
                      <span>انتخاب تاریخ خروج</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date <= (checkInDate || new Date()) ||
                      (bookedDates &&
                        bookedDates.some((booking: any) => {
                          const bookingStart = new Date(booking.check_in_date);
                          const bookingEnd = new Date(booking.check_out_date);
                          // Disable dates that are strictly between check-in and check-out (exclusive)
                          return date > bookingStart && date < bookingEnd;
                        }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.check_out_date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.check_out_date.message}
            </p>
          )}
        </div>

        {/* People Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تعداد نفرات
          </label>
          <div className="relative">
            <Users className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <Controller
              control={control}
              name="people_count"
              render={({ field }) => (
                <Input
                  type="number"
                  control={control}
                  name="people_count"
                  placeholder="تعداد نفرات"
                  className={cn(
                    "pl-3 pr-10 h-12",
                    errors.people_count && "border-red-500"
                  )}
                  min={1}
                  max={maximumCapacity}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 1 : Number(value));
                  }}
                />
              )}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            ظرفیت پایه: {baseCapacity} نفر، حداکثر: {maximumCapacity} نفر
          </p>
        </div>

        {/* Show conflicting dates warning */}
        {checkInDate &&
          checkOutDate &&
          isDateRangeConflicting(checkInDate, checkOutDate) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">
                ⚠️ تاریخ‌های انتخابی با رزرو موجود تداخل دارد. لطفاً تاریخ‌های
                دیگری انتخاب کنید.
              </p>
            </div>
          )}

        {/* Price Breakdown */}
        {checkInDate &&
          checkOutDate &&
          peopleCount &&
          nights > 0 &&
          !isDateRangeConflicting(checkInDate, checkOutDate) && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>قیمت پایه ({nights} شب)</span>
                <span>
                  {(basePricePerNight * nights).toLocaleString()} تومان
                </span>
              </div>
              {peopleCount > baseCapacity && (
                <div className="flex justify-between text-sm">
                  <span>
                    هزینه نفرات اضافی ({peopleCount - baseCapacity} نفر)
                  </span>
                  <span>
                    {(
                      (peopleCount - baseCapacity) *
                      extraPersonPrice *
                      nights
                    ).toLocaleString()}{" "}
                    تومان
                  </span>
                </div>
              )}
              <hr className="border-gray-200" />
              <div className="flex justify-between font-bold">
                <span>مجموع</span>
                <span>{totalPrice.toLocaleString()} تومان</span>
              </div>
            </div>
          )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="cursor-pointer w-full h-12 bg-blue-600 hover:bg-blue-700"
          disabled={
            postReservation.isPending ||
            (checkInDate &&
              checkOutDate &&
              isDateRangeConflicting(checkInDate, checkOutDate))
          }
        >
          {postReservation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
              در حال رزرو...
            </>
          ) : (
            "رزرو ویلا"
          )}
        </Button>
      </form>

      {/* Show booked dates info */}
      {bookedDates && bookedDates.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            تاریخ‌های رزرو شده:
          </h4>
          <div className="space-y-1">
            {bookedDates.map((booking: any, index: number) => (
              <p key={index} className="text-xs text-yellow-700">
                {new Date(booking.check_in_date).toLocaleDateString("fa-IR")} تا{" "}
                {new Date(booking.check_out_date).toLocaleDateString("fa-IR")}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
