"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../components/app-context";

export default function LoginPage() {
  const router = useRouter();
  const { language, dictionary, login } = useAppContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const isZh = language === "zh";

  const onSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError(isZh ? "请输入账号和密码。" : "Please enter email and password.");
      return;
    }
    login();
    router.push("/purchase");
  };

  return (
    <section className="section login-panel">
      <div className="panel">
        <h1 className="section-title">{dictionary.login.title}</h1>
        <p className="section-subtitle">{dictionary.login.subtitle}</p>
        <form onSubmit={onSubmit}>
          <label>
            {isZh ? "企业邮箱" : "Work Email"}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder={isZh ? "name@company.com" : "name@company.com"}
            />
          </label>
          <label>
            {isZh ? "密码" : "Password"}
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="******"
            />
          </label>
          {error ? <p style={{ color: "#ffb3b3" }}>{error}</p> : null}
          <button className="button" type="submit">
            {dictionary.login.loginButton}
          </button>
        </form>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.9rem", flexWrap: "wrap" }}>
          <Link href="/products/tidytree" className="button secondary">
            {dictionary.login.demo}
          </Link>
          <Link href="/tech" className="button secondary">
            {dictionary.login.goTech}
          </Link>
        </div>
      </div>
    </section>
  );
}
