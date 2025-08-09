"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to villa management by default
    router.push("/admin/villa");
  }, [router]);

  return (
    <div className="p-6 dir-rtl" dir="rtl">
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">در حال انتقال...</div>
      </div>
    </div>
  );
}
