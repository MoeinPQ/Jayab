"use client";

import Image from "next/image";
import { CustomAvatar } from "@/components/avatar";
import LoginModal from "../login-dialog";
import villa from "@/assets/villa.jpg";
import { useAuth } from "@/hooks/auth";
import { useGetUsersProfile } from "@/hooks/api/users";

export function HeroSection() {
  const { isAuthenticated, userId, token, isTokenExpired, refreshAuth } =
    useAuth();
  const { data: userData, isLoading: isUserLoading } =
    useGetUsersProfile(isAuthenticated);

  const handleLoginSuccess = () => {
    // Refresh auth state after successful login
    refreshAuth();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    // Refresh auth state after logout
    refreshAuth();
  };

  return (
    <section className="relative bg-gray-100 min-h-[400px] flex items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden shadow-lg">
      <div className="absolute top-4 left-4 z-20">
        {!isAuthenticated ? (
          <LoginModal onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="flex items-center gap-3">
            <CustomAvatar onLogout={handleLogout} />
            {userData && !isUserLoading && (
              <div className="text-white">
                <p className="text-sm font-medium drop-shadow-md" dir="rtl">
                  {userData.first_name} {userData.last_name}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={villa}
          alt="ویلا"
          className="w-full h-full object-cover brightness-90"
          priority
        />
      </div>

      <div className="relative z-10 max-w-3xl text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">جایاب</h1>
        <p className="mb-8 text-lg drop-shadow-md">
          بهترین ویلاها را با بهترین قیمت اجاره کنید
        </p>
      </div>
    </section>
  );
}
