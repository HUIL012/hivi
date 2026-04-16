import { formatCurrency, getDashboardData } from "@/lib/data";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ModulesPage({ params }: Props) {
  const { locale } = await params;
  const lang: AppLocale = locale === "en" ? "en" : "zh";
  const t = getDictionary(lang);
  const user = await requireUser(lang);
  const data = await getDashboardData(user.id, lang);

  return (
    <div className="stack">
      <section className="card">
        <h1 style={{ marginTop: 0 }}>{t.navMyModules}</h1>
        <p className="muted">
          {lang === "zh"
            ? `欢迎，${user.name}（${user.email}）`
            : `Welcome, ${user.name} (${user.email})`}
        </p>
      </section>

      <section className="card">
        <h2>{t.purchasedModules}</h2>
        {data.purchasedModules.length === 0 ? (
          <p className="muted">{t.noPurchasedModules}</p>
        ) : (
          <div className="grid grid-3">
            {data.purchasedModules.map((item) => (
              <article key={item.slug} className="card">
                <h3 style={{ marginTop: 0 }}>{item.name}</h3>
                <p className="muted">{item.summary}</p>
                <p className="kpi-badge">{item.priceLabel}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>{t.previewGateTitle}</h2>
        <table>
          <thead>
            <tr>
              <th>{t.module}</th>
              <th>{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {data.previewPermissions.map((permission) => (
              <tr key={permission.moduleId}>
                <td>{permission.moduleName}</td>
                <td>{permission.enabled ? t.previewAllowed : t.previewDenied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>{lang === "zh" ? "订单记录" : "Order Records"}</h2>
        <table>
          <thead>
            <tr>
              <th>{t.orderNo}</th>
              <th>{t.status}</th>
              <th>{t.orderTotal}</th>
              <th>{t.createdAt}</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>{order.status}</td>
                <td>{formatCurrency(order.totalCents, lang)}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
