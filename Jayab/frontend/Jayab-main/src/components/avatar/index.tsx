"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { BsPerson } from "react-icons/bs";
import Link from "next/link";

interface CustomAvatarProps {
  onLogout: () => void;
}

export function CustomAvatar({ onLogout }: CustomAvatarProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setIsPopupOpen(false);
    onLogout();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    }
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div className="relative">
      <Avatar
        className="cursor-pointer w-11 h-11"
        onClick={() => setIsPopupOpen((prev) => !prev)}
      >
        <AvatarImage src="" alt="User Avatar" />{" "}
        <AvatarFallback>
          <BsPerson size={23} />
        </AvatarFallback>
      </Avatar>

      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
        >
          <Link href="/my-trips">
            <button className="block w-full text-left px-4 py-3 text-sm rounded-t-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <div className="flex items-center justify-center cursor-pointer gap-2">
                <p>سفر های من</p>
              </div>
            </button>
          </Link>
          <Separator />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-3 text-sm rounded-b-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <div className="flex items-center justify-center cursor-pointer gap-2">
              <p className="text-red-600">خروج از حساب کاربری</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
