import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Button } from "@/components/ui/button";
import { usePostVillas, useUpdateVillas } from "@/hooks/api/villas";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "عنوان ویلا الزامی است" }),
  city: z.string().min(1, { message: "شهر الزامی است" }),
  address: z.string().min(1, { message: "آدرس الزامی است" }),

  base_capacity: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val) >= 1, {
      message: "ظرفیت پایه باید عددی و حداقل ۱ باشد",
    }),

  maximum_capacity: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val) >= 1, {
      message: "حداکثر ظرفیت باید عددی و حداقل ۱ باشد",
    }),

  area: z
    .string()
    .refine((val) => /^\d+(\.\d+)?$/.test(val) && parseFloat(val) > 0, {
      message: "مساحت باید عددی و بیشتر از صفر باشد",
    }),

  bed_count: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val) >= 1, {
      message: "تعداد تخت باید عددی و حداقل ۱ باشد",
    }),

  has_pool: z.boolean(),
  has_cooling_system: z.boolean(),

  base_price_per_night: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val) >= 0, {
      message: "قیمت پایه باید عددی و صفر یا بیشتر باشد",
    }),

  extra_person_price: z
    .string()
    .refine((val) => /^\d+$/.test(val) && parseInt(val) >= 0, {
      message: "قیمت نفر اضافه باید عددی و صفر یا بیشتر باشد",
    }),

  rating: z
    .string()
    .refine((val) => /^\d+(\.\d+)?$/.test(val), {
      message: "امتیاز باید عددی باشد",
    })
    .refine(
      (val) => {
        const n = parseFloat(val);
        return n >= 0 && n <= 5;
      },
      {
        message: "امتیاز باید بین ۰ تا ۵ باشد",
      }
    ),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
  title: "",
  city: "",
  address: "",
  base_capacity: "",
  maximum_capacity: "",
  area: "",
  bed_count: "",
  has_pool: false,
  has_cooling_system: false,
  base_price_per_night: "",
  extra_person_price: "",
  rating: "",
  image: undefined,
};

interface EditVillaFormProps {
  data?: any;
  children?: React.ReactNode;
  isEdit?: boolean;
}

export default function VillaForm({
  data,
  children,
  isEdit = false,
}: EditVillaFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  console.log(data);

  const { handleSubmit, control, register, reset, getValues } =
    useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues,
    });

  const postVillasMutation = usePostVillas();
  const updateVillasMutation = useUpdateVillas();

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEdit && data && open) {
      reset({
        title: data.title || "",
        city: data.city || "",
        address: data.address || "",
        base_capacity: data.base_capacity?.toString() || "",
        maximum_capacity: data.maximum_capacity?.toString() || "",
        area: data.area?.toString() || "",
        bed_count: data.bed_count?.toString() || "",
        has_pool: data.has_pool || false,
        has_cooling_system: data.has_cooling_system || false,
        base_price_per_night: data.base_price_per_night?.toString() || "",
        extra_person_price: data.extra_person_price?.toString() || "",
        rating: data.rating?.toString() || "",
        image: undefined, // Don't populate image for editing
      });
    } else if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, data, open, reset]);

  const onSubmit = async (formData: FormData) => {
    console.log("Form data:", formData);
    const file = (formData.image as FileList)?.[0];

    // Create villa object without the picture
    const villaData = {
      title: formData.title,
      city: formData.city,
      address: formData.address,
      base_capacity: parseInt(formData.base_capacity),
      maximum_capacity: parseInt(formData.maximum_capacity),
      area: parseFloat(formData.area),
      bed_count: parseInt(formData.bed_count),
      has_pool: formData.has_pool,
      has_cooling_system: formData.has_cooling_system,
      base_price_per_night: parseInt(formData.base_price_per_night),
      extra_person_price: parseInt(formData.extra_person_price),
      rating: parseFloat(formData.rating),
    };

    // Create FormData for multipart/form-data
    const submitData = new FormData();

    // Add villa data as JSON string
    submitData.append("villa", JSON.stringify(villaData));

    // Add image file (only if provided)
    if (file) {
      submitData.append("image", file);
    }

    console.log("Villa data JSON:", JSON.stringify(villaData));
    console.log("FormData entries:");
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    try {
      if (isEdit && data?.id) {
        // Update existing villa
        await updateVillasMutation.mutateAsync({
          id: data.id,
          data: submitData,
        });
        console.log("Villa updated successfully!");
      } else {
        // Create new villa
        await postVillasMutation.mutateAsync(submitData);
        console.log("Villa created successfully!");
      }

      // Invalidate and refetch the villas query
      toast.success("! عملیات با موفقیت انجام شد");
      await queryClient.invalidateQueries({ queryKey: ["GetVillas"] });

      setOpen(false);
      reset();
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} villa:`, error);
      toast.error("! مشکلی رخ داده لطفا دوباره تلاش کنید");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="border cursor-pointer bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm">
            {isEdit ? "ویرایش ویلا" : "افزودن ویلا"}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right text-xl">
            {isEdit ? "ویرایش ویلا" : "افزودن ویلا"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
          {/* Basic Information */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  عنوان ویلا
                </label>
                <Input
                  name="title"
                  control={control}
                  placeholder="عنوان ویلا"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  شهر
                </label>
                <Input name="city" control={control} className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                آدرس کامل
              </label>
              <Input name="address" control={control} className="h-10" />
            </div>
          </div>

          <Controller
            name="image"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2 text-right">
                <label className="block font-medium text-sm text-gray-700">
                  تصویر ویلا{" "}
                  {isEdit &&
                    "(اختیاری - در صورت عدم انتخاب، تصویر قبلی حفظ می‌شود)"}
                </label>

                {/* Current Image Preview (when editing) */}
                {isEdit && data?.images && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">تصویر فعلی:</p>
                    <div className="relative inline-block">
                      <img
                        src={data.images}
                        alt="تصویر فعلی ویلا"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* New Image Preview */}
                {field.value?.[0] && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">تصویر جدید:</p>
                    <div className="relative inline-block">
                      <img
                        src={URL.createObjectURL(field.value[0])}
                        alt="تصویر جدید ویلا"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label
                    htmlFor="picture-upload"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm"
                  >
                    {isEdit ? "تغییر عکس" : "آپلود عکس"}
                  </label>

                  <span className="text-sm text-gray-700">
                    {field.value?.[0]?.name || "هیچ فایلی انتخاب نشده"}
                  </span>
                </div>

                <input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => field.onChange(e.target.files)}
                />

                {fieldState.error && (
                  <p className="text-red-600 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Capacity & Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  ظرفیت پایه (نفر)
                </label>
                <Input
                  name="base_capacity"
                  control={control}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  حداکثر ظرفیت (نفر)
                </label>
                <Input
                  name="maximum_capacity"
                  control={control}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  مساحت (متر مربع)
                </label>
                <Input name="area" control={control} className="h-10" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  تعداد تخت
                </label>
                <Input name="bed_count" control={control} className="h-10" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CheckboxField
                name="has_pool"
                control={control}
                label="استخر"
                description="آیا ویلا دارای استخر است؟"
              />
              <CheckboxField
                name="has_cooling_system"
                control={control}
                label="سیستم سرمایش"
                description="آیا ویلا دارای سیستم سرمایش است؟"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  قیمت پایه شب (تومان)
                </label>
                <Input
                  name="base_price_per_night"
                  control={control}
                  placeholder="قیمت پایه (تومان)"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  قیمت نفر اضافه (تومان)
                </label>
                <Input
                  name="extra_person_price"
                  control={control}
                  placeholder="قیمت نفر اضافه (تومان)"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  امتیاز (۰ تا ۵)
                </label>
                <Input
                  name="rating"
                  control={control}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="امتیاز (۰ تا ۵)"
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              disabled={
                postVillasMutation.isPending || updateVillasMutation.isPending
              }
              onClick={() =>
                reset(
                  isEdit && data
                    ? {
                        title: data.title || "",
                        city: data.city || "",
                        address: data.address || "",
                        base_capacity: data.base_capacity?.toString() || "",
                        maximum_capacity:
                          data.maximum_capacity?.toString() || "",
                        area: data.area?.toString() || "",
                        bed_count: data.bed_count?.toString() || "",
                        has_pool: data.has_pool || false,
                        has_cooling_system: data.has_cooling_system || false,
                        base_price_per_night:
                          data.base_price_per_night?.toString() || "",
                        extra_person_price:
                          data.extra_person_price?.toString() || "",
                        rating: data.rating?.toString() || "",
                        image: undefined,
                      }
                    : defaultValues
                )
              }
              className="cursor-pointer"
            >
              بازنشانی
            </Button>
            <Button
              type="submit"
              disabled={
                postVillasMutation.isPending || updateVillasMutation.isPending
              }
              className="cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {postVillasMutation.isPending || updateVillasMutation.isPending
                ? "در حال ذخیره..."
                : isEdit
                ? "بروزرسانی ویلا"
                : "ذخیره ویلا"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
