"use client";

import VillaForm from "@/components/admin/villa-form";
import DeleteVillaDialog from "@/components/admin/delete-villa-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetVillas } from "@/hooks/api/villas";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function Villa() {
  const { data: villas, isLoading, error } = useGetVillas();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  if (isLoading) {
    return (
      <div className="p-6 dir-rtl" dir="rtl">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">در حال بارگذاری...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 dir-rtl" dir="rtl">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">
            خطا در بارگذاری اطلاعات ویلاها
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dir-rtl" dir="rtl">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold text-right">مدیریت ویلاها</h1>
        <VillaForm />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">شناسه</TableHead>
            <TableHead className="text-center">عنوان</TableHead>
            <TableHead className="text-center">شهر</TableHead>
            <TableHead className="text-center">ظرفیت پایه</TableHead>
            <TableHead className="text-center">حداکثر ظرفیت</TableHead>
            <TableHead className="text-center">متراژ</TableHead>
            <TableHead className="text-center">تعداد اتاق</TableHead>
            <TableHead className="text-center">استخر</TableHead>
            <TableHead className="text-center">سیستم سرمایش</TableHead>
            <TableHead className="text-center">قیمت پایه (شب)</TableHead>
            <TableHead className="text-center">قیمت نفر اضافی</TableHead>
            <TableHead className="text-center">امتیاز</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {villas?.map((villa: any) => (
            <TableRow key={villa.id}>
              <TableCell className="font-medium text-center">
                {villa.id}
              </TableCell>
              <TableCell className="text-center">{villa.title}</TableCell>
              <TableCell className="text-center">{villa.city}</TableCell>
              <TableCell className="text-center">
                {villa.base_capacity} نفر
              </TableCell>
              <TableCell className="text-center">
                {villa.maximum_capacity} نفر
              </TableCell>
              <TableCell className="text-center">
                {villa.area} متر مربع
              </TableCell>
              <TableCell className="text-center">
                {villa.bed_count} اتاق
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    villa.has_pool
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {villa.has_pool ? "دارد" : "ندارد"}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    villa.has_cooling_system
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {villa.has_cooling_system ? "دارد" : "ندارد"}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {formatPrice(villa.base_price_per_night)}
              </TableCell>
              <TableCell className="text-center">
                {formatPrice(villa.extra_person_price)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <span className="text-yellow-500">★</span>
                  <span className="mr-1">{villa.rating}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <VillaForm data={villa} isEdit={true}>
                    <button
                      className="cursor-pointer p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                      title="ویرایش"
                    >
                      <FiEdit size={16} />
                    </button>
                  </VillaForm>
                  <DeleteVillaDialog villa={villa}>
                    <button
                      className="cursor-pointer p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      title="حذف"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </DeleteVillaDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
