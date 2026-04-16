import { getDictionary, isLocale, type AppLocale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { getModules, getPreviewPermissionsByUser } from "@/lib/data";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PreviewPage({ params }: Props) {
  const { locale } = await params;
  const activeLocale: AppLocale = isLocale(locale) ? locale : "zh";
  const dict = getDictionary(activeLocale);
  const [modules, user] = await Promise.all([getModules(activeLocale), getCurrentUser()]);
  const permissions = user ? await getPreviewPermissionsByUser(user.id) : [];
  const permissionMap = new Map(permissions.map((item) => [item.moduleId, item.enabled]));

  return (
    <div className="container stack">
      <section className="card">
        <h1 className="section-title">{dict.navPreview}</h1>
        <p className="muted">{dict.previewIntro}</p>
      </section>

      <section className="grid grid-3">
        {modules.map((module) => {
          const allowed = user?.role === "ADMIN" ? true : Boolean(permissionMap.get(module.id));
          return (
            <article key={module.id} className="card stack">
              <h3 style={{ margin: 0 }}>{module.name}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {module.summary}
              </p>
              <div className={allowed ? "badge-success" : "badge-warning"}>
                {dict.previewGateTitle}: {allowed ? dict.previewAllowed : dict.previewDenied}
              </div>
              <p style={{ margin: 0 }}>
                {allowed
                  ? activeLocale === "zh"
                    ? "你可以查看该模块的演示流程和关键操作链路。"
                    : "You can access this module's demo workflow and operation chain."
                  : activeLocale === "zh"
                    ? "请联系管理员开通预览权限。"
                    : "Contact your admin to grant preview access."}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
