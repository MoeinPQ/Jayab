import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeleteVillas } from "@/hooks/api/villas";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface DeleteVillaDialogProps {
  villa: any;
  children: React.ReactNode;
}

export default function DeleteVillaDialog({
  villa,
  children,
}: DeleteVillaDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteVillaMutation = useDeleteVillas();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteVillaMutation.mutateAsync(villa.id);
      console.log("Villa deleted successfully!");

      // Invalidate and refetch the villas query
      toast.success("! عملیات با موفقیت انجام شد");
      await queryClient.invalidateQueries({ queryKey: ["GetVillas"] });

      setOpen(false);
    } catch (error) {
      console.error("Error deleting villa:", error);
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
          <p className="text-lg mb-2">آیا از حذف این ویلا اطمینان دارید؟</p>
          <p className="text-sm text-gray-600">
            ویلا: <span className="font-medium">{villa.title}</span>
          </p>
          <p className="text-sm text-red-500 mt-2">این عمل قابل بازگشت نیست.</p>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t" dir="rtl">
          <Button
            type="button"
            variant="outline"
            disabled={deleteVillaMutation.isPending}
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            انصراف
          </Button>
          <Button
            type="button"
            disabled={deleteVillaMutation.isPending}
            onClick={handleDelete}
            className="cursor-pointer bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {deleteVillaMutation.isPending ? "در حال حذف..." : "حذف"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
