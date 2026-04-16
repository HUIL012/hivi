"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AppLocale } from "@/lib/i18n";

type AuthButtonsProps = {
  locale: AppLocale;
  isSignedIn: boolean;
  loginLabel?: string;
  signOutLabel?: string;
};

export function AuthButtons({
  locale,
  isSignedIn,
  loginLabel = "Login",
  signOutLabel = "Sign out"
}: AuthButtonsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onSignOut = async () => {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
    setPending(false);
  };

  if (!isSignedIn) {
    return (
      <Link className="btn btn-secondary" href={`/${locale}/login`}>
        {loginLabel}
      </Link>
    );
  }

  return (
    <button className="btn btn-secondary" onClick={onSignOut} disabled={pending}>
      {signOutLabel}
    </button>
  );
}
