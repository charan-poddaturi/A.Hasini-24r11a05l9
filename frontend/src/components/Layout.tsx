import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { GlobalAlerts } from "./GlobalAlerts";

const navItems = [
  { to: "/", label: "pages.dashboard" },
  { to: "/contacts", label: "pages.contacts" },
  { to: "/map", label: "pages.map" },
  { to: "/donors", label: "pages.donors" },
  { to: "/protocols", label: "pages.protocols" },
  { to: "/profile", label: "pages.profile" },
];

export const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GlobalAlerts />
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <Link to="/" className="text-xl font-semibold text-primary">
          SafeHub
        </Link>
        <div className="flex items-center gap-3">
          <select
            className="border rounded px-2 py-1"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>
          {user ? (
            <button
              className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300"
              onClick={logout}
            >
              {t("common.logout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 rounded bg-accent text-white hover:bg-blue-700"
            >
              {t("common.login")}
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>

      <nav className="bg-white border-t shadow-sm">
        <div className="mx-auto flex max-w-xl justify-around py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-accent" : "text-slate-600"}`
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
