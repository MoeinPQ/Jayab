"use client";

import { useGetAllUserReservations } from "@/hooks/api/user-reservations";
import { useGetVillaById } from "@/hooks/api/villas";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Reservation {
  id: number;
  user_id: number;
  villa_id: number;
  check_in_date: string;
  check_out_date: string;
  people_count: number;
  total_price: number;
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const { data: villa, isLoading: villaLoading } = useGetVillaById(
    reservation.villa_id
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Villa Image */}
      {villa?.images && (
        <div className="h-48 overflow-hidden">
          <img
            src={villa.images}
            alt={villa.title || "Villa"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-row-reverse">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            رزرو #{reservation.id}
          </span>
        </div>

        {/* Villa Info */}
        {villaLoading ? (
          <div className="mb-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mr-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mr-auto"></div>
            </div>
          </div>
        ) : villa ? (
          <div className="mb-4 text-right">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {villa.title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 flex-row-reverse justify-end">
              <MapPin className="w-4 h-4" />
              <span>{villa.city}</span>
            </p>
          </div>
        ) : null}

        {/* Reservation Details */}
        <div className="space-y-4 mb-6">
          {/* Date Range */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">تاریخ ورود</p>
                <p className="font-bold text-gray-900">
                  {new Date(reservation.check_in_date).toLocaleDateString(
                    "fa-IR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                    }
                  )}
                </p>
              </div>

              <div className="flex-1 mx-4">
                <div className="border-t-2 border-dashed border-gray-300 relative">
                  <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">تاریخ خروج</p>
                <p className="font-bold text-gray-900">
                  {new Date(reservation.check_out_date).toLocaleDateString(
                    "fa-IR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">مسافران</p>
                <p className="font-semibold text-gray-900">
                  {reservation.people_count} نفر
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">مبلغ کل</p>
                <p className="font-bold text-gray-900">
                  {reservation.total_price.toLocaleString()} تومان
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/villa/${reservation.villa_id}`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
            مشاهده اطلاعات ویلا
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function MyTripsPage() {
  const { data: reservations, isLoading, error } = useGetAllUserReservations();

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری سفرها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">خطا در بارگذاری سفرها</p>
          <Button onClick={() => window.location.reload()}>تلاش مجدد</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-row-reverse">
            <Link href="/">
              <Button variant="outline" className="cursor-pointer">
                بازگشت به صفحه اصلی
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">سفرهای من</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
        {!reservations || reservations.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              هنوز سفری نداشته‌اید
            </h3>
            <p className="text-gray-500 mb-6">
              زمان آن رسیده که اولین سفر خود را رزرو کنید!
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                مشاهده ویلاها
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation: Reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
