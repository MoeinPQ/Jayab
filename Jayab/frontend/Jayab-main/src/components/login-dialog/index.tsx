"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import * as z from "zod";
import LoginForm from "../login-form";
import SignUpForm from "../signup-form";
import { IoLogInOutline } from "react-icons/io5";

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

interface LoginModalProps {
  onLoginSuccess: () => void;
}

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [formState, setFormState] = useState("firstStep");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [open, setOpen] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  const handleFormSuccess = () => {
    onLoginSuccess();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border border-blue-600 bg-blue-600 text-white p-2 rounded-md cursor-pointer hover:bg-blue-700">
        <div className="flex space-x-1 items-center">
          <p> ورود / ثبت نام</p>
          <div>
            <IoLogInOutline size={20} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-center">
            <DialogTitle
              className={`font-bold ${
                formState === "firstStep" ? "text-2xl" : "text-lg"
              }`}
            >
              {formState === "firstStep" ? "جایاب" : "تایید شماره موبایل"}
            </DialogTitle>
          </div>

          <div className="flex justify-center">
            {formState === "firstStep" ? (
              <DialogDescription>ورود یا ثبت نام در جایاب</DialogDescription>
            ) : (
              <DialogDescription>
                کد 6 رقمی ارسال شده به شماره {phoneNumber} را وارد کنید
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        {isLogin ? (
          <LoginForm
            setIsLogin={setIsLogin}
            formState={formState}
            setFormState={setFormState}
            setPhoneNumber={setPhoneNumber}
            onSuccessClose={handleFormSuccess}
          />
        ) : (
          <SignUpForm
            setIsLogin={setIsLogin}
            formState={formState}
            setFormState={setFormState}
            setPhoneNumber={setPhoneNumber}
            onSuccessClose={handleFormSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
