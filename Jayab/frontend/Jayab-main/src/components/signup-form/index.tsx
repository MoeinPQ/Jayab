"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InputOTPField } from "../InputOTPField";
import { useSignUp, useVerifySignup } from "@/hooks/api/signup";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "لطفا نام را وارد کنید" }),
  lastName: z.string().min(1, { message: "لطفا نام خانوادگی را وارد کنید" }),
  nationalCode: z.string().min(1, { message: "لطفا کد ملی را وارد کنید" }),
  password: z.string().min(1, { message: "لطفا رمز عبور را وارد کنید" }),
  phoneNumber: z
    .string()
    .min(10, { message: "شماره موبایل باید حداقل ۱۰ رقم باشد" })
    .regex(/^((\+98|0)?9\d{9})$/, {
      message: "شماره موبایل معتبر نیست",
    }),
  otp: z
    .string()
    .or(z.literal(""))

    .optional(),
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
  firstName: "",
  lastName: "",
  password: "",
  nationalCode: "",
};

export default function SignUpForm({
  setIsLogin,
  setFormState,
  formState,
  setPhoneNumber,
  onSuccessClose,
}: SignUpFormProps) {
  const signupQuery = useSignUp();

  const verifySignupQuery = useVerifySignup();

  const { handleSubmit, control, getValues, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

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
      signupQuery.mutate(
        {
          first_name: data.firstName,
          last_name: data.lastName,
          national_code: data.nationalCode,
          phone_number: data.phoneNumber,
          password: data.password,
        },
        {
          onSuccess: (response) => {
            console.log("Signup successful:", response);
            setFormState("secondStep");
          },
          onError: (error: any) => {
            console.error("Signup failed:", error);
            if (
              error?.response?.data?.detail ===
              "User with this phone number already exists"
            ) {
              toast.error("کاربری با این شماره موبایل وجود دارد");
            } else {
              toast.error("خطایی رخ داده");
            }
          },
        }
      );
      setFormState("secondStep");
    } else {
      const verificationData = {
        request: {
          phone_number: data.phoneNumber,
          otp: data.otp || "",
        },
        signup_data: {
          first_name: data.firstName,
          last_name: data.lastName,
          national_code: data.nationalCode,
          phone_number: data.phoneNumber,
          password: data.password,
        },
      };

      verifySignupQuery.mutate(verificationData, {
        onSuccess: (response) => {
          console.log("Verification successful:", response);

          localStorage.setItem("access_token", response.access_token);
          toast.success("! ثبت نام با موفقیت انجام شد");
          if (onSuccessClose) onSuccessClose();
          reset(defaultValues);
          setIsLogin(true);
        },
        onError: (error: any) => {
          console.error("Verification failed:", error);
          if (error?.response?.data?.detail === "Invalid OTP") {
            toast.error("کد تایید اشتباه است");
          } else {
            toast.error("خطایی رخ داده");
          }
        },
      });
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
    setTimeLeft(120);
    setTimerActive(true);
    console.log("Resend OTP");
    signupQuery.mutate(
      {
        first_name: getValues("firstName"),
        last_name: getValues("lastName"),
        national_code: getValues("nationalCode"),
        phone_number: getValues("phoneNumber"),
        password: getValues("password"),
      },
      {
        onSuccess: (response) => {
          console.log("Signup successful:", response);
          setFormState("secondStep");
        },
        onError: (error: any) => {
          console.error("Signup failed:", error);
        },
      }
    );
  };

  const isLoading = signupQuery.isPending || verifySignupQuery.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col mx-12 gap-4 pb-5">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                name="lastName"
                control={control}
                placeholder="نام خانوادگی"
                rules={{ required: "E-mail is required" }}
                className="h-12"
                disabled={formState === "secondStep"}
              />
              <Input
                name="firstName"
                control={control}
                placeholder="نام"
                rules={{ required: "E-mail is required" }}
                className="h-12"
                disabled={formState === "secondStep"}
              />
            </div>

            <div className="flex gap-2">
              <Input
                name="password"
                control={control}
                placeholder="رمز عبور"
                type="password"
                rules={{ required: "E-mail is required" }}
                className="h-12"
                disabled={formState === "secondStep"}
              />
              <Input
                name="nationalCode"
                control={control}
                placeholder="کد ملی"
                rules={{ required: "E-mail is required" }}
                className="h-12"
                disabled={formState === "secondStep"}
                maxLength={12}
              />
            </div>

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
                  ویرایش اطلاعات
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
              onClick={() => setIsLogin(true)}
            >
              حساب دارید؟
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
