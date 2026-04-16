"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../components/app-context";

export default function PurchasePage() {
  const { dictionary, language, isLoggedIn, modules, setModules, addOrder } = useAppContext();
  const [company, setCompany] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();

  const toggleModule = (id) => {
    setModules((previous) =>
      previous.map((module) =>
        module.id === id ? { ...module, selected: !module.selected } : module
      )
    );
  };

  const selected = modules.filter((module) => module.selected);
  const total = selected.reduce((sum, item) => sum + item.price, 0);

  const createOrder = () => {
    if (!isLoggedIn) {
      setNotice(dictionary.actions.loginRequired);
      setTimeout(() => router.push("/login"), 700);
      return;
    }
    if (!company || selected.length === 0) {
      setNotice(dictionary.purchase.formIncomplete);
      return;
    }
    selected.forEach((item) => {
      addOrder({
        module: language === "zh" ? item.name : item.nameEn,
        buyer: company,
        amount: item.price,
        status: "Pending",
      });
    });
    setNotice(dictionary.purchase.orderPlaced);
  };

  return (
    <section className="section">
      <h1 className="section-title">{dictionary.purchase.title}</h1>
      <p className="section-subtitle">{dictionary.purchase.subtitle}</p>

      <div className="page-card-list">
        {modules.map((module) => (
          <article className="card" key={module.id}>
            <label>
              <input
                type="checkbox"
                checked={module.selected}
                onChange={() => toggleModule(module.id)}
                style={{ width: "auto", marginRight: "0.5rem" }}
              />
              <strong>{language === "zh" ? module.name : module.nameEn}</strong>
            </label>
            <p>{language === "zh" ? module.descriptionZh : module.descriptionEn}</p>
            <p>
              {language === "zh" ? "价格" : "Price"}: ¥{module.price}
            </p>
          </article>
        ))}
      </div>

      <div className="panel" style={{ marginTop: "1rem", maxWidth: "520px" }}>
        <label>
          {dictionary.purchase.company}
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder={dictionary.purchase.companyPlaceholder}
          />
        </label>
        <p>
          {dictionary.purchase.selectedCount}: {selected.length}
        </p>
        <p>
          {dictionary.purchase.total}: ¥{total}
        </p>
        <button type="button" className="button" onClick={createOrder}>
          {dictionary.purchase.createOrder}
        </button>
        {notice ? <p>{notice}</p> : null}
      </div>
    </section>
  );
}
