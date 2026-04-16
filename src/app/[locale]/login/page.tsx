import { getDictionary } from "@/lib/i18n";
import { requireLocale } from "@/lib/session";
import { LoginForm } from "@/components/forms";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const validLocale = requireLocale(locale);
  const dict = getDictionary(validLocale);

  return (
    <div className="container" style={{ padding: "28px 0 60px" }}>
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>{dict.loginTitle}</h1>
        <p className="muted">{dict.loginHint}</p>
        <LoginForm locale={validLocale} dict={dict} />
      </div>
    </div>
  );
}
