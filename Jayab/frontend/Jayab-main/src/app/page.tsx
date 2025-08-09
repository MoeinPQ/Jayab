"use client";

import { HeroSection } from "@/components/hero-section";
import { VillaCard } from "@/components/villa-card";
import { useGetVillas } from "@/hooks/api/villas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const formSchema = z.object({
  city: z.string(),
  min_capacity: z.string(),
  max_price: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues = {
  city: "",
  min_capacity: "",
  max_price: "",
};

export default function Home() {
  const [searchParams, setSearchParams] = useState<{
    city?: string;
    min_capacity?: string;
    max_price?: string;
  }>({});

  const { data: villas, isLoading, error } = useGetVillas(searchParams);

  const { handleSubmit, control, getValues, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: FormData) => {
    console.log("Search data:", data);

    // Filter out empty strings and set search parameters
    const filteredParams: {
      city?: string;
      min_capacity?: string;
      max_price?: string;
    } = {};

    if (data.city.trim()) {
      filteredParams.city = data.city.trim();
    }
    if (data.min_capacity.trim()) {
      filteredParams.min_capacity = data.min_capacity.trim();
    }
    if (data.max_price.trim()) {
      filteredParams.max_price = data.max_price.trim();
    }

    setSearchParams(filteredParams);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            خطا در بارگذاری
          </h2>
          <p className="text-gray-600">
            مشکلی در بارگذاری اطلاعات ویلاها رخ داده است
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <HeroSection />

      {/* Villas Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto" dir="rtl">
        <div className="">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ویلاهای پیشنهادی
          </h2>
          <p className="text-gray-600">بهترین ویلاها برای اقامت شما</p>
        </div>

        {/* Search Form Section */}
        <section className="p-8 px-0 max-w-7xl mx-auto" dir="rtl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Input
                name="city"
                control={control}
                placeholder="شهر"
                className="h-12"
              />

              <Input
                name="min_capacity"
                control={control}
                placeholder="حداقل ظرفیت"
                className="h-12"
              />

              <Input
                name="max_price"
                control={control}
                placeholder="حداکثر قیمت"
                className="h-12"
              />

              <Button
                type="submit"
                className="h-12 w-32 cursor-pointer bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                جستجو
              </Button>
            </div>
          </form>
        </section>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-xl h-80 animate-pulse"
              />
            ))}
          </div>
        ) : villas && villas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {villas.map((villa: any) => (
              <VillaCard key={villa.id} villa={villa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              هیچ ویلایی یافت نشد
            </h3>
            <p className="text-gray-600">
              در حال حاضر ویلایی برای نمایش موجود نیست
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
