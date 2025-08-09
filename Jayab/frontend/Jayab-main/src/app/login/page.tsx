"use client";

import { InputOTPField } from "@/components/InputOTPField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin, useVerifyLogin } from "@/hooks/api/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "شماره موبایل باید حداقل ۱۰ رقم باشد" })
    .regex(/^((\+98|0)?9\d{9})$/, {
      message: "شماره موبایل معتبر نیست",
    }),
  otp: z.string().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues = {
  phoneNumber: "",
  otp: "",
};

export default function Login() {
  const [formState, setFormState] = useState("firstStep");
  const { handleSubmit, control, getValues, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const loginQuery = useLogin();
  const verifyLoginQuery = useVerifyLogin();

  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (formState === "secondStep" && timeLeft > 0) {
      setTimerActive(true);
    }
  }, [formState]);

  const handleResendOTP = () => {
    setTimeLeft(120);
    setTimerActive(true);
    console.log("Resend OTP");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return ` (${String(minutes).padStart(2, "0")}:${String(
      secondsLeft
    ).padStart(2, "0")})`;
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timerActive, timeLeft]);

  const onSubmit = (data: FormData) => {
    if (formState === "firstStep") {
      loginQuery.mutate(
        {
          phone_number: data.phoneNumber,
        },
        {
          onSuccess: (response) => {
            console.log("Login successful:", response);
            setFormState("secondStep");
          },
          onError: (error: any) => {
            console.error("Signup failed:", error);
            if (
              error?.response?.data?.detail ===
              "User with this phone number does not exist"
            ) {
              toast.error("کاربری با این شماره موبایل وجود ندارد");
            } else {
              toast.error("خطایی رخ داده");
            }
          },
        }
      );
      setFormState("secondStep");
    } else {
      verifyLoginQuery.mutate(
        {
          phone_number: data.phoneNumber,
          otp: data.otp,
        },
        {
          onSuccess: (response) => {
            console.log("Verification successful:", response);

            localStorage.setItem("access_token", response.access_token);
            toast.success("!ورود با موفقیت انجام شد");
            router.push("/admin/villa");
            reset(defaultValues);
          },
          onError: (error: any) => {
            console.error("Signup failed:", error);
            if (error?.response?.data?.detail === "Invalid OTP") {
              toast.error("کد تایید اشتباه است");
            } else {
              toast.error("خطایی رخ داده");
            }
          },
        }
      );
      console.log(data);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2" dir="rtl">
              ورود به صفحه ادمین
            </h1>
            <p className="text-gray-600 text-sm" dir="rtl">
              {formState === "firstStep"
                ? "شماره موبایل خود را وارد کنید"
                : "کد تایید ارسال شده را وارد کنید"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700 block"
                dir="rtl"
              >
                شماره موبایل
              </label>
              <Input
                name="phoneNumber"
                control={control}
                placeholder="09xxxxxxxxx"
                rules={{ required: "شماره موبایل الزامی است" }}
                className="h-12 text-center"
                disabled={formState === "secondStep"}
                maxLength={11}
              />
            </div>

            {formState === "secondStep" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700 block text-center"
                    dir="rtl"
                  >
                    کد تایید
                  </label>
                  <InputOTPField
                    name="otp"
                    control={control}
                    maxLength={6}
                    containerClassName="justify-center"
                  />
                </div>

                <div className="text-center" dir="rtl">
                  <p
                    className={`text-sm transition-colors ${
                      timeLeft > 0
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-blue-600 cursor-pointer hover:text-blue-700"
                    }`}
                    onClick={timeLeft === 0 ? handleResendOTP : undefined}
                  >
                    ارسال مجدد کد تایید
                    {timeLeft > 0 && (
                      <span className="text-gray-400">
                        {formatTime(timeLeft)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loginQuery.isPending || verifyLoginQuery.isPending}
              className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-6 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {loginQuery.isPending || verifyLoginQuery.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال پردازش...</span>
                </div>
              ) : formState === "firstStep" ? (
                "ارسال کد تایید"
              ) : (
                "ورود"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
