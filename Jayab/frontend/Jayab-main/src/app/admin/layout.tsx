"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCalendar, FiLogOut } from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">پنل مدیریت</h1>
            </div>
            <div className="flex items-center space-x-5 space-x-reverse">
              <Link
                href="/admin/villa"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/admin/villa"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FiHome className="ml-2" size={18} />
                مدیریت ویلاها
              </Link>
              <Link
                href="/admin/reservations"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/admin/reservations"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FiCalendar className="ml-2" size={18} />
                مدیریت رزروها
              </Link>
              <button
                onClick={() => {
                  // Clear any stored auth tokens
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  // Redirect to login page
                  window.location.href = "/login";
                }}
                className="cursor-pointer flex items-center px-3 py-2 mr-5 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                title="خروج از سیستم"
              >
                <FiLogOut className="ml-2" size={18} />
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
