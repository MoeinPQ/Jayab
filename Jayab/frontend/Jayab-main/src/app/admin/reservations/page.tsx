"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllReservations } from "@/hooks/api/admin-reservations";
import { FiTrash2, FiUser, FiHome } from "react-icons/fi";
import DeleteReservationDialog from "@/components/admin/delete-reservation-dialog";

export default function Reservations() {
  const { data: reservations, isLoading, error } = useGetAllReservations();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

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
            خطا در بارگذاری اطلاعات رزروها
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dir-rtl" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-right">مدیریت رزروها</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">شناسه رزرو</TableHead>
            <TableHead className="text-center">شناسه کاربر</TableHead>
            <TableHead className="text-center">شناسه ویلا</TableHead>
            <TableHead className="text-center">تاریخ ورود</TableHead>
            <TableHead className="text-center">تاریخ خروج</TableHead>
            <TableHead className="text-center">تعداد نفرات</TableHead>
            <TableHead className="text-center">قیمت کل</TableHead>
            <TableHead className="text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations?.map((reservation: any) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium text-center">
                {reservation.id}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <FiUser className="ml-1" size={14} />
                  {reservation.user_id}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <FiHome className="ml-1" size={14} />
                  {reservation.villa_id}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {formatDate(reservation.check_in_date)}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(reservation.check_out_date)}
              </TableCell>
              <TableCell className="text-center">
                {reservation.people_count} نفر
              </TableCell>
              <TableCell className="text-center">
                {formatPrice(reservation.total_price)}
              </TableCell>
              <TableCell className="text-center">
                <DeleteReservationDialog reservation={reservation}>
                  <button
                    className="cursor-pointer p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    title="حذف رزرو"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </DeleteReservationDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
