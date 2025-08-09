"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetVillaById } from "@/hooks/api/villas";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import VillaBookingForm from "@/components/villa-booking-form";

export default function VillaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const villaId = parseInt(params.id as string);

  const { data: villa, isLoading, error } = useGetVillaById(villaId);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xl ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری اطلاعات ویلا...</p>
        </div>
      </div>
    );
  }

  if (error || !villa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            خطا در بارگذاری
          </h2>
          <p className="text-gray-600 mb-4">
            ویلای مورد نظر یافت نشد یا مشکلی در بارگذاری رخ داده است
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0 cursor-pointer"
          >
            <ArrowRight className="h-5 w-5" />
            <span className="font-medium">بازگشت</span>
          </Button>
        </div>
      </div>

      {/* Villa Image */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={villa.images}
              alt={villa.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Villa Title and Rating */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {villa.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-lg">📍</span>
                    <span className="text-lg font-medium">{villa.city}</span>
                  </div>
                  <p className="text-gray-600 text-lg">{villa.address}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                  {renderStars(villa.rating)}
                  <span className="text-lg font-medium text-gray-700">
                    {villa.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                مشخصات کلی ویلا
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <span className="text-xl">🏠</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      درباره ویلا
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {villa.area} متر مربع
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <span className="text-xl">👥</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      ظرفیت
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    ظرفیت {villa.base_capacity} نفر (حداکثر{" "}
                    {villa.maximum_capacity} نفر)
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <span className="text-xl">🛏️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      سرویس‌های خواب
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {villa.bed_count} تخت یک نفره
                  </p>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                امکانات ویلا
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group bg-white border-2 border-gray-100 rounded-xl p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div
                      className={`p-4 rounded-2xl ${
                        villa.has_pool ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <span className="text-3xl">🏊‍♂️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        استخر
                      </h3>
                      <p
                        className={`text-base font-medium ${
                          villa.has_pool ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {villa.has_pool
                          ? "استخر اختصاصی موجود است"
                          : "استخر موجود نیست"}
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                          villa.has_pool
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <span
                          className={
                            villa.has_pool ? "text-blue-500" : "text-gray-400"
                          }
                        >
                          {villa.has_pool ? "✓" : "✗"}
                        </span>
                        {villa.has_pool ? "موجود" : "موجود نیست"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group bg-white border-2 border-gray-100 rounded-xl p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div
                      className={`p-4 rounded-2xl ${
                        villa.has_cooling_system ? "bg-cyan-100" : "bg-gray-100"
                      }`}
                    >
                      <span className="text-3xl">❄️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        سیستم سرمایشی
                      </h3>
                      <p
                        className={`text-base font-medium ${
                          villa.has_cooling_system
                            ? "text-cyan-600"
                            : "text-gray-500"
                        }`}
                      >
                        {villa.has_cooling_system
                          ? "کولر گازی در تمام اتاق‌ها"
                          : "سیستم سرمایشی ندارد"}
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                          villa.has_cooling_system
                            ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                            : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <span
                          className={
                            villa.has_cooling_system
                              ? "text-cyan-500"
                              : "text-gray-400"
                          }
                        >
                          {villa.has_cooling_system ? "✓" : "✗"}
                        </span>
                        {villa.has_cooling_system ? "موجود" : "موجود نیست"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                قیمت‌گذاری
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <span className="text-white text-lg">💰</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      قیمت پایه در شب
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-blue-600">
                      {villa.base_price_per_night.toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-600 font-medium">
                      تومان
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    برای {villa.base_capacity} نفر
                  </p>
                </div>

                {villa.extra_person_price > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <span className="text-white text-lg">👥</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        هزینه نفر اضافی
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-orange-600">
                        {villa.extra_person_price.toLocaleString()}
                      </span>
                      <span className="text-xl text-gray-600 font-medium">
                        تومان
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      هر نفر اضافه بر ظرفیت پایه
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form Sidebar */}
          <div className="lg:col-span-1">
            <VillaBookingForm
              villaId={villaId}
              baseCapacity={villa.base_capacity}
              maximumCapacity={villa.maximum_capacity}
              basePricePerNight={villa.base_price_per_night}
              extraPersonPrice={villa.extra_person_price}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
