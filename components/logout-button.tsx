"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  const onClick = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
      }
    >
      Logout
    </button>
  );
}


