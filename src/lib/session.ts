import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isLocale, type AppLocale } from "@/lib/i18n";

export function requireLocale(value: string): AppLocale {
  return isLocale(value) ? value : "zh";
}

export async function requireUser(locale: AppLocale = "zh") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  return user;
}

export async function requireAdmin(locale: AppLocale = "zh") {
  const user = await requireUser(locale);
  if (user.role !== "ADMIN") {
    redirect(`/${locale}`);
  }
  return user;
}

export function localeFromPath(value: string): AppLocale {
  return isLocale(value) ? value : "zh";
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete("tidytree_session");
}
