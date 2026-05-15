"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button type="button" className="secondary-button" onClick={handleLogout}>
      Sair
    </button>
  );
}
