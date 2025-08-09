"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InputOTPField } from "../InputOTPField";
import { useLogin, useVerifyLogin } from "@/hooks/api/login";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

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

interface SignUpFormProps {
  setIsLogin: any;
  setFormState: any;
  formState: any;
  setPhoneNumber: any;
  onSuccessClose?: () => void;
}

const defaultValues = {
  phoneNumber: "",
  otp: "",
};

export default function LoginForm({
  setIsLogin,
  setFormState,
  formState,
  setPhoneNumber,
  onSuccessClose,
}: SignUpFormProps) {
  const { handleSubmit, control, getValues, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const loginQuery = useLogin();
  const verifyLoginQuery = useVerifyLogin();

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Start countdown when user reaches second step
  useEffect(() => {
    if (formState === "secondStep" && timeLeft > 0) {
      setTimerActive(true);
    }
  }, [formState]);

  // Countdown effect
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
            if (onSuccessClose) onSuccessClose();
            reset(defaultValues);
            setIsLogin(true);
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return ` (${String(minutes).padStart(2, "0")}:${String(
      secondsLeft
    ).padStart(2, "0")})`;
  };

  const handleResendOTP = () => {
    // Reset the timer and trigger the resend logic (e.g., call an API to resend OTP)
    setTimeLeft(120);
    setTimerActive(true);
    console.log("Resend OTP");
    loginQuery.mutate(
      {
        phone_number: getValues("phoneNumber"),
      },
      {
        onSuccess: (response) => {
          console.log("Login successful:", response);
          setFormState("secondStep");
        },
        onError: (error: any) => {
          console.error("Signup failed:", error);
          toast.error("خطایی رخ داده");
        },
      }
    );
  };

  const isLoading = loginQuery.isPending || verifyLoginQuery.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col mx-12 gap-4 pb-5">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Input
              name="phoneNumber"
              control={control}
              placeholder="09xxxxxxxxx"
              rules={{ required: "E-mail is required" }}
              className="h-12"
              disabled={formState === "secondStep"}
              maxLength={11}
            />

            {formState === "secondStep" && (
              <div dir="rtl" className="text-xs  ">
                <p
                  className="text-blue-600 cursor-pointer w-fit"
                  onClick={() => setFormState("firstStep")}
                >
                  ویرایش شماره
                </p>
              </div>
            )}
          </div>

          {formState === "secondStep" && (
            <div className="flex flex-col gap-4">
              <InputOTPField
                name="otp"
                control={control}
                maxLength={6}
                containerClassName="justify-center"
              />
              <div dir="rtl" className="text-xs">
                <p
                  className={`${
                    timeLeft > 0
                      ? "text-muted-foreground"
                      : "text-blue-600 cursor-pointer"
                  }  w-fit`}
                  onClick={handleResendOTP}
                >
                  ارسال مجدد کد تایید
                  {timeLeft > 0 ? formatTime(timeLeft) : ""}
                </p>
              </div>
            </div>
          )}

          {formState === "firstStep" && (
            <p dir="rtl" className="text-muted-foreground text-sm">
              ورود و ثبت‌نام در جایاب به منزله‌ پذیرفتن قوانین و مقررات و قوانین
              حریم خصوصی می‌باشد.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {formState === "firstStep" && (
            <div
              dir="rtl"
              className="font-bold text-sm cursor-pointer pr-2"
              onClick={() => setIsLogin(false)}
            >
              ثبت‌نام
            </div>
          )}

          <Button
            className="cursor-pointer h-12 bg-blue-600 hover:bg-blue-700"
            type="submit"
            disabled={isLoading}
            onClick={() => setPhoneNumber(getValues("phoneNumber"))}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
            ) : (
              "ادامه"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
