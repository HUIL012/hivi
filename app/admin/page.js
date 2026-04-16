"use client";

import { useState } from "react";
import { useAppContext } from "../../components/app-context";

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function AdminPage() {
  const { language, dictionary, isLoggedIn, users, setUsers, orders, setOrders, content, setContent } =
    useAppContext();
  const [tab, setTab] = useState("content");
  const [userForm, setUserForm] = useState({ name: "", email: "", role: "Viewer", status: "pending" });
  const [orderForm, setOrderForm] = useState({ module: "", buyer: "", amount: "", status: "Trial" });
  const langContent = content[language];

  if (!isLoggedIn) {
    return (
      <section className="section">
        <div className="panel">
          <h2>{dictionary.common.loginRequired}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 className="section-title">{dictionary.admin.title}</h1>
      <p className="section-subtitle">{dictionary.admin.subtitle}</p>
      <div className="admin-layout">
        <aside className="admin-nav">
          <button type="button" className="button secondary" onClick={() => setTab("content")}>
            {dictionary.admin.content}
          </button>
          <button type="button" className="button secondary" onClick={() => setTab("users")}>
            {dictionary.admin.users}
          </button>
          <button type="button" className="button secondary" onClick={() => setTab("orders")}>
            {dictionary.admin.orders}
          </button>
        </aside>
        <div className="panel">
          {tab === "content" ? (
            <>
              <h3>{dictionary.admin.contentTab}</h3>
              <label>
                {dictionary.admin.heroTitle}
                <input
                  value={langContent.heroTitle}
                  onChange={(event) =>
                    setContent((previous) => ({
                      ...previous,
                      [language]: { ...previous[language], heroTitle: event.target.value },
                    }))
                  }
                />
              </label>
              <label>
                {dictionary.admin.heroSubtitle}
                <textarea
                  rows={4}
                  value={langContent.heroSubtitle}
                  onChange={(event) =>
                    setContent((previous) => ({
                      ...previous,
                      [language]: { ...previous[language], heroSubtitle: event.target.value },
                    }))
                  }
                />
              </label>
            </>
          ) : null}

          {tab === "users" ? (
            <>
              <h3>{dictionary.admin.userTab}</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{dictionary.admin.username}</th>
                    <th>{dictionary.admin.email}</th>
                    <th>{dictionary.admin.role}</th>
                    <th>{dictionary.admin.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="grid-2" style={{ marginTop: "1rem" }}>
                <label>
                  {dictionary.admin.username}
                  <input
                    value={userForm.name}
                    onChange={(event) => setUserForm((previous) => ({ ...previous, name: event.target.value }))}
                  />
                </label>
                <label>
                  {dictionary.admin.email}
                  <input
                    value={userForm.email}
                    onChange={(event) => setUserForm((previous) => ({ ...previous, email: event.target.value }))}
                  />
                </label>
                <label>
                  {dictionary.admin.role}
                  <select
                    value={userForm.role}
                    onChange={(event) => setUserForm((previous) => ({ ...previous, role: event.target.value }))}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </label>
                <label>
                  {dictionary.admin.status}
                  <select
                    value={userForm.status}
                    onChange={(event) => setUserForm((previous) => ({ ...previous, status: event.target.value }))}
                  >
                    <option value="active">active</option>
                    <option value="pending">pending</option>
                  </select>
                </label>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => {
                  if (!userForm.name || !userForm.email) return;
                  const nextId = `u${String(users.length + 1).padStart(3, "0")}`;
                  setUsers((previous) => [...previous, { id: nextId, ...userForm }]);
                  setUserForm({ name: "", email: "", role: "Viewer", status: "pending" });
                }}
              >
                {dictionary.admin.addUser}
              </button>
            </>
          ) : null}

          {tab === "orders" ? (
            <>
              <h3>{dictionary.admin.orderTab}</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{dictionary.admin.module}</th>
                    <th>{dictionary.admin.buyer}</th>
                    <th>{dictionary.admin.amount}</th>
                    <th>{dictionary.admin.orderStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.module}</td>
                      <td>{order.buyer}</td>
                      <td>¥{order.amount}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="grid-2" style={{ marginTop: "1rem" }}>
                <label>
                  {dictionary.admin.module}
                  <input
                    value={orderForm.module}
                    onChange={(event) => setOrderForm((previous) => ({ ...previous, module: event.target.value }))}
                  />
                </label>
                <label>
                  {dictionary.admin.buyer}
                  <input
                    value={orderForm.buyer}
                    onChange={(event) => setOrderForm((previous) => ({ ...previous, buyer: event.target.value }))}
                  />
                </label>
                <label>
                  {dictionary.admin.amount}
                  <input
                    type="number"
                    value={orderForm.amount}
                    onChange={(event) => setOrderForm((previous) => ({ ...previous, amount: event.target.value }))}
                  />
                </label>
                <label>
                  {dictionary.admin.orderStatus}
                  <select
                    value={orderForm.status}
                    onChange={(event) => setOrderForm((previous) => ({ ...previous, status: event.target.value }))}
                  >
                    <option value="Trial">Trial</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </label>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => {
                  if (!orderForm.module || !orderForm.buyer) return;
                  const nextId = `o${new Date().toISOString().slice(0, 10).replaceAll("-", "")}${orders.length + 1}`;
                  setOrders((previous) => [
                    ...previous,
                    {
                      id: nextId,
                      module: orderForm.module,
                      buyer: orderForm.buyer,
                      amount: parseNumber(orderForm.amount),
                      status: orderForm.status,
                    },
                  ]);
                  setOrderForm({ module: "", buyer: "", amount: "", status: "Trial" });
                }}
              >
                {dictionary.admin.addOrder}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
