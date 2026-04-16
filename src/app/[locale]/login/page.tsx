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
    <section className="login-shell">
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-card-head">
          <h1>{dict.loginTitle}</h1>
          <p>{dict.loginHint}</p>
        </div>
        <LoginForm locale={validLocale} dict={dict} />
      </div>
    </section>
  );
}
