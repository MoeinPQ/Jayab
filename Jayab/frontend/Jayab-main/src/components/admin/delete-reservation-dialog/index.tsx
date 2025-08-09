import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteReservationByReserveId } from "@/hooks/api/admin-reservations";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteReservationDialogProps {
  reservation: any;
  children: React.ReactNode;
}

export default function DeleteReservationDialog({
  reservation,
  children,
}: DeleteReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteReservationMutation = useDeleteReservationByReserveId();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteReservationMutation.mutateAsync(reservation.id);
      console.log("Reservation deleted successfully!");

      // Invalidate and refetch the reservations query
      toast.success("! عملیات با موفقیت انجام شد");
      await queryClient.invalidateQueries({ queryKey: ["GetAllReservations"] });

      setOpen(false);
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("! مشکلی رخ داده لطفا دوباره تلاش کنید");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-right">تأیید حذف</DialogTitle>
        </DialogHeader>

        <div className="py-4" dir="rtl">
          <p className="text-lg mb-2">آیا از حذف این رزرو اطمینان دارید؟</p>
          <p className="text-sm text-red-500 mt-2">این عمل قابل بازگشت نیست.</p>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t" dir="rtl">
          <Button
            type="button"
            variant="outline"
            disabled={deleteReservationMutation.isPending}
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            انصراف
          </Button>
          <Button
            type="button"
            disabled={deleteReservationMutation.isPending}
            onClick={handleDelete}
            className="cursor-pointer bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {deleteReservationMutation.isPending ? "در حال حذف..." : "حذف"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
