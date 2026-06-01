"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout, getUser } from "@/lib/auth";

// ─── Icons (inline SVG ringan, tanpa library) ───────────────────────────────

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
const IconOrders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);
const IconCategories = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconPOS = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconHamburger = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);
const IconCoffee = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

// ─── Nav config per role ─────────────────────────────────────────────────────

type NavItem = { label: string; href: string; icon: React.ReactNode };

const NAV_CUSTOMER: NavItem[] = [
  { label: "Menu", href: "/customer", icon: <IconMenu /> },
  { label: "Pesanan Saya", href: "/customer/orders", icon: <IconOrders /> },
];

const NAV_CASHIER: NavItem[] = [
  { label: "Dashboard", href: "/cashier/dashboard", icon: <IconDashboard /> },
  { label: "Kasir (POS)", href: "/cashier/pos", icon: <IconPOS /> },
  { label: "Pesanan", href: "/cashier/orders", icon: <IconOrders /> },
];

const NAV_MANAGER: NavItem[] = [
  { label: "Dashboard", href: "/manager/dashboard", icon: <IconDashboard /> },
  { label: "Kategori", href: "/manager/categories", icon: <IconCategories /> },
  { label: "Menu", href: "/manager/menus", icon: <IconMenu /> },
  { label: "Pesanan", href: "/manager/orders", icon: <IconOrders /> },
];

function getNavItems(role?: string): NavItem[] {
  if (role === "MANAGER") return NAV_MANAGER;
  if (role === "CASHIER") return NAV_CASHIER;
  return NAV_CUSTOMER;
}

function getRoleLabel(role?: string) {
  if (role === "MANAGER") return { label: "Manager", color: "var(--role-manager)" };
  if (role === "CASHIER") return { label: "Kasir", color: "var(--role-cashier)" };
  return { label: "Customer", color: "var(--role-customer)" };
}

// ─── Sidebar inner content ───────────────────────────────────────────────────

function SidebarContent({
  onClose,
  isMobile,
}: {
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const user = getUser();
  const navItems = getNavItems(user?.role);
  const roleInfo = getRoleLabel(user?.role);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar-inner">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon"><IconCoffee /></span>
        <span className="logo-text">CaféPOS</span>
        {isMobile && (
          <button className="close-btn" onClick={onClose} aria-label="Tutup menu">
            <IconClose />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.username?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.username ?? "Pengguna"}</span>
          <span className="user-role" style={{ color: roleInfo.color }}>
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${active ? " active" : ""}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {active && <span className="nav-indicator" />}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon"><IconLogout /></span>
          <span>Keluar</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0;
          background: var(--sidebar-bg);
        }

        /* Logo */
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 20px 18px;
        }
        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: var(--accent);
          border-radius: 10px;
          color: #fff;
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--sidebar-text);
          letter-spacing: -0.02em;
          flex: 1;
        }
        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--sidebar-muted);
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .close-btn:hover {
          color: var(--sidebar-text);
          background: var(--sidebar-hover);
        }

        /* User info */
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          margin: 0 12px;
          background: var(--sidebar-user-bg);
          border-radius: 12px;
        }
        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--sidebar-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Divider */
        .sidebar-divider {
          height: 1px;
          background: var(--sidebar-border);
          margin: 14px 20px;
        }

        /* Nav */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 12px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--sidebar-muted);
          font-size: 0.9rem;
          font-weight: 500;
          position: relative;
          transition: background 0.18s, color 0.18s;
        }
        .nav-item:hover {
          background: var(--sidebar-hover);
          color: var(--sidebar-text);
        }
        .nav-item.active {
          background: var(--accent-light);
          color: var(--accent);
          font-weight: 600;
        }
        .nav-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .nav-label {
          flex: 1;
        }
        .nav-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }

        /* Footer logout */
        .sidebar-footer {
          padding-bottom: 12px;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: calc(100% - 24px);
          margin: 0 12px;
          padding: 10px 12px;
          background: none;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          color: var(--logout-color);
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.18s, color 0.18s;
        }
        .logout-btn:hover {
          background: var(--logout-hover-bg);
          color: var(--logout-hover-color);
        }
      `}</style>
    </div>
  );
}

// ─── Main Sidebar export ─────────────────────────────────────────────────────

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── CSS Variables & Global Sidebar Styles ── */}
      <style jsx global>{`
        :root {
          --accent: #c8622e;
          --accent-light: #c8622e18;
          --sidebar-bg: #1a1310;
          --sidebar-text: #f5ede6;
          --sidebar-muted: #8a7060;
          --sidebar-hover: #2a1f18;
          --sidebar-border: #2e2018;
          --sidebar-user-bg: #231810;
          --role-manager: #f5a623;
          --role-cashier: #5ab4e8;
          --role-customer: #7bc67e;
          --logout-color: #8a7060;
          --logout-hover-bg: #3a1010;
          --logout-hover-color: #e87070;
          --topbar-bg: #ffffff;
          --topbar-border: #f0e8e0;
          --topbar-text: #1a1310;
        }

        /* Desktop sidebar */
        .sidebar-desktop {
          display: none;
          width: 240px;
          min-width: 240px;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          border-right: 1px solid var(--sidebar-border);
          background: var(--sidebar-bg);
          scrollbar-width: thin;
          scrollbar-color: var(--sidebar-border) transparent;
        }
        @media (min-width: 768px) {
          .sidebar-desktop { display: block; }
        }

        /* Mobile: top bar */
        .topbar-mobile {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: var(--topbar-bg);
          border-bottom: 1px solid var(--topbar-border);
          position: sticky;
          top: 0;
          z-index: 40;
        }
        @media (min-width: 768px) {
          .topbar-mobile { display: none; }
        }
        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--topbar-text);
        }
        .topbar-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: var(--accent);
          border-radius: 8px;
          color: #fff;
        }
        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--topbar-text);
          padding: 6px;
          border-radius: 8px;
          transition: background 0.18s;
        }
        .hamburger-btn:hover { background: #f5ede6; }

        /* Mobile sidebar drawer */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 50;
          backdrop-filter: blur(2px);
        }
        .sidebar-overlay.open { display: block; }
        .sidebar-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100%;
          z-index: 51;
          background: var(--sidebar-bg);
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
        }
        .sidebar-drawer.open {
          transform: translateX(0);
        }

        /* Page layout wrapper */
        .app-layout {
          display: flex;
          min-height: 100vh;
        }
        .app-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* Mobile top bar */}
      <div className="topbar-mobile">
        <div className="topbar-logo">
          <span className="topbar-logo-icon"><IconCoffee /></span>
          CaféPOS
        </div>
        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu"
        >
          <IconHamburger />
        </button>
      </div>

      {/* Mobile drawer + overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`sidebar-drawer${mobileOpen ? " open" : ""}`}>
        <SidebarContent isMobile onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="sidebar-desktop">
        <SidebarContent />
      </aside>
    </>
  );
}