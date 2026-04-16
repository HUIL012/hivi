"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/i18n";

type Dict = Record<string, string>;

type LoginFormProps = {
  locale: AppLocale;
  dict: Dict;
};

export function LoginForm({ locale, dict }: LoginFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError("");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") ?? "").trim(),
          password: String(formData.get("password") ?? ""),
          locale
        })
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.push(`/${locale}/modules`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="form-grid">
      <div>
        <label htmlFor="email">{dict.email}</label>
        <input id="email" type="email" name="email" required />
      </div>
      <div>
        <label htmlFor="password">{dict.password}</label>
        <input id="password" type="password" name="password" required />
      </div>
      {error ? <p className="danger">{error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? (locale === "zh" ? "登录中..." : "Signing in...") : dict.signIn}
      </button>
    </form>
  );
}

type AdminSectionFormProps = {
  locale: AppLocale;
  sectionKey: string;
  title: string;
  body: string;
  dict: Dict;
};

export function AdminSectionForm({
  locale,
  sectionKey,
  title,
  body,
  dict
}: AdminSectionFormProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "section",
          locale,
          key: sectionKey,
          title: String(formData.get("title") ?? ""),
          body: String(formData.get("body") ?? "")
        })
      });
      setMessage(response.ok ? dict.saveSuccess : "Failed");
      if (response.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="form-grid card">
      <div className="muted">{`section:${locale}:${sectionKey}`}</div>
      <div>
        <label>{dict.title}</label>
        <input name="title" defaultValue={title} required />
      </div>
      <div>
        <label>{dict.body}</label>
        <textarea name="body" rows={4} defaultValue={body} required />
      </div>
      <div className="inline">
        <button className="btn btn-secondary" type="submit" disabled={pending}>
          {pending ? "Saving..." : dict.adminSaveSection}
        </button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </form>
  );
}

type AdminModuleNarrativeFormProps = {
  locale: AppLocale;
  moduleSlug: string;
  moduleName: string;
  data: {
    background: string;
    painPoint: string;
    overview: string;
    highlights: string;
    userHelp: string;
    principle: string;
  };
  dict: Dict;
};

export function AdminModuleNarrativeForm({
  locale,
  moduleSlug,
  moduleName,
  data,
  dict
}: AdminModuleNarrativeFormProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "module",
          locale,
          key: moduleSlug,
          title: moduleName,
          body: "",
          background: String(formData.get("background") ?? ""),
          painPoint: String(formData.get("painPoint") ?? ""),
          overview: String(formData.get("overview") ?? ""),
          highlights: String(formData.get("highlights") ?? ""),
          userHelp: String(formData.get("userHelp") ?? ""),
          principle: String(formData.get("principle") ?? "")
        })
      });
      setMessage(response.ok ? dict.saveSuccess : "Failed");
      if (response.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="form-grid card">
      <div className="muted">{`module:${locale}:${moduleSlug}`}</div>
      <h4 style={{ margin: 0 }}>{moduleName}</h4>
      <div>
        <label>{dict.sectionBackground}</label>
        <textarea name="background" rows={3} defaultValue={data.background} required />
      </div>
      <div>
        <label>{dict.sectionPainPoint}</label>
        <textarea name="painPoint" rows={3} defaultValue={data.painPoint} required />
      </div>
      <div>
        <label>{dict.sectionOverview}</label>
        <textarea name="overview" rows={3} defaultValue={data.overview} required />
      </div>
      <div>
        <label>{dict.sectionHighlights}</label>
        <textarea name="highlights" rows={3} defaultValue={data.highlights} required />
      </div>
      <div>
        <label>{dict.sectionValue}</label>
        <textarea name="userHelp" rows={3} defaultValue={data.userHelp} required />
      </div>
      <div>
        <label>{dict.navPrinciples}</label>
        <textarea name="principle" rows={3} defaultValue={data.principle} required />
      </div>
      <div className="inline">
        <button className="btn btn-secondary" type="submit" disabled={pending}>
          {pending ? "Saving..." : dict.adminSaveModule}
        </button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </form>
  );
}

type UserRoleFormProps = {
  userId: string;
  role: "ADMIN" | "CUSTOMER";
};

export function UserRoleForm({ userId, role }: UserRoleFormProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextRole = event.target.value;
    startTransition(async () => {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: nextRole })
      });
      router.refresh();
    });
  }

  return (
    <select defaultValue={role} onChange={onChange} disabled={pending}>
      <option value="ADMIN">ADMIN</option>
      <option value="CUSTOMER">CUSTOMER</option>
    </select>
  );
}

type CreateOrderFormProps = {
  users: Array<{ id: string; email: string }>;
  modules: Array<{ id: string; nameZh: string; nameEn: string; priceCents: number }>;
  dict: Dict;
};

export function CreateOrderForm({ users, modules, dict }: CreateOrderFormProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const moduleIds = formData.getAll("moduleIds").map(String);

    startTransition(async () => {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: String(formData.get("userId") ?? ""),
          moduleIds,
          status: String(formData.get("status") ?? "PAID")
        })
      });
      setMessage(response.ok ? dict.adminOrderCreated : "Failed");
      if (response.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="form-grid card">
      <div>
        <label>{dict.user}</label>
        <select name="userId" required>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>{dict.modules}</label>
        <select name="moduleIds" multiple required size={Math.min(6, Math.max(3, modules.length))}>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.nameZh} / {module.nameEn} (${(module.priceCents / 100).toFixed(0)})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>{dict.status}</label>
        <select name="status">
          <option value="PAID">PAID</option>
          <option value="PENDING">PENDING</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>
      <div className="inline">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Creating..." : dict.createOrder}
        </button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </form>
  );
}

type PreviewPermissionFormProps = {
  userId: string;
  moduleId: string;
  label: string;
  enabled: boolean;
  dict: Dict;
};

export function PreviewPermissionForm({
  userId,
  moduleId,
  label,
  enabled,
  dict
}: PreviewPermissionFormProps) {
  const [pending, startTransition] = useTransition();
  const [currentEnabled, setCurrentEnabled] = useState(enabled);

  function onToggle() {
    startTransition(async () => {
      const next = !currentEnabled;
      const response = await fetch("/api/admin/preview-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, moduleId, enabled: next })
      });
      if (response.ok) {
        setCurrentEnabled(next);
      }
    });
  }

  return (
    <div className="card inline" style={{ justifyContent: "space-between" }}>
      <span>{label}</span>
      <button className="btn btn-secondary" type="button" onClick={onToggle} disabled={pending}>
        {pending ? "..." : currentEnabled ? dict.previewAllowed : dict.previewDenied}
      </button>
    </div>
  );
}
