import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getAdminData, formatCurrency } from "@/lib/data";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import {
  AdminModuleNarrativeForm,
  AdminSectionForm,
  CreateOrderForm,
  PreviewPermissionForm,
  UserRoleForm
} from "@/components/forms";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const appLocale: AppLocale = locale === "en" ? "en" : "zh";
  const dict = getDictionary(appLocale);

  const user = await requireUser(appLocale);
  if (user.role !== "ADMIN") {
    redirect(`/${appLocale}`);
  }

  const { users, orders, modules, moduleNarratives, sections, permissions } = await getAdminData();

  return (
    <div className="stack" style={{ gap: 20 }}>
      <section className="card">
        <h1 className="section-title">{dict.navAdmin}</h1>
        <p className="muted">{dict.adminContentHint}</p>
      </section>

      <section className="card">
        <h2>{dict.adminContent}</h2>
        <div className="stack" style={{ gap: 14 }}>
          {sections.map((section) => (
            <AdminSectionForm
              key={`${section.locale}-${section.key}`}
              locale={section.locale as AppLocale}
              sectionKey={section.key}
              title={section.title}
              body={section.body}
              dict={dict}
            />
          ))}
          {moduleNarratives.map((narrative) => (
            <AdminModuleNarrativeForm
              key={`${narrative.locale}-${narrative.module.slug}`}
              locale={narrative.locale as AppLocale}
              moduleSlug={narrative.module.slug}
              moduleName={appLocale === "zh" ? narrative.module.nameZh : narrative.module.nameEn}
              dict={dict}
              data={{
                background: narrative.background,
                painPoint: narrative.painPoint,
                overview: narrative.overview,
                highlights: narrative.highlights,
                userHelp: narrative.userHelp,
                principle: narrative.principle
              }}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <h2>{dict.adminUsers}</h2>
        <table>
          <thead>
            <tr>
              <th>{dict.user}</th>
              <th>{dict.role}</th>
              <th>{dict.createdAt}</th>
              <th>{dict.update}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  <div className="muted">{item.email}</div>
                </td>
                <td>{item.role}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>
                  <UserRoleForm userId={item.id} role={item.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>{dict.adminOrders}</h2>
        <CreateOrderForm users={users} modules={modules} dict={dict} />
        <div style={{ marginTop: 14 }}>
          <table>
            <thead>
              <tr>
                <th>{dict.orderNo}</th>
                <th>{dict.user}</th>
                <th>{dict.status}</th>
                <th>{dict.price}</th>
                <th>{dict.module}</th>
                <th>{dict.createdAt}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNo}</td>
                  <td>{order.user.email}</td>
                  <td>{order.status}</td>
                  <td>{formatCurrency(order.totalCents, appLocale)}</td>
                  <td>{order.items.map((item) => item.module.nameZh).join(" / ")}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>{dict.adminPreviewAccess}</h2>
        <div className="stack">
          {permissions.map((permission) => (
            <PreviewPermissionForm
              key={permission.id}
              userId={permission.userId}
              moduleId={permission.moduleId}
              enabled={permission.enabled}
              dict={dict}
              label={`${permission.user.email} / ${permission.module.nameZh}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
