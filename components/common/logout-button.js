"use client";

import { secondaryButtonClass } from "@/lib/ui";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      className={`${secondaryButtonClass} rounded-2xl px-4 py-2.5 text-xs`}
      onClick={handleLogout}
      aria-label="Sair"
    >
      Sair
    </button>
  );
}
