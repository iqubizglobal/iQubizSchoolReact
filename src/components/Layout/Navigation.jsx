import React from "react";
import { Logo } from "../Icons";

// ----------------------
// Nav Item (Sidebar & Drawer)
// ----------------------
function NavItem({ id, icon, label, active, onClick, brand, isMobile = false }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 px-3 py-2 rounded-md relative transition-all duration-200 ${
        active ? "font-semibold" : "opacity-80 hover:opacity-100"
      }`}
    >
      {/* Orange pill for sidebar */}
      {!isMobile && (
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-6 rounded-r-md transition-all duration-300 ${
            active ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
          }`}
          style={{ backgroundColor: brand.orange }}
        />
      )}
      <span
        className="w-6 h-6 relative z-10"
        style={{ color: active ? brand.orange : isMobile ? brand.light : "#fff" }}
      >
        {icon}
      </span>
      <span
        className="truncate relative z-10"
        style={{ color: active ? brand.orange : isMobile ? brand.light : "#fff" }}
      >
        {label}
      </span>
    </button>
  );
}

// ----------------------
// Sidebar Navigation (Desktop)
// ----------------------
export function SidebarNavigation({ brand, navItems, route, setRoute, currentRole }) {
  return (
    <aside
      className="hidden lg:flex w-64 flex-col text-white"
      style={{ backgroundColor: brand.blue }}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 mb-6">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt="School Logo"
              className="h-10 w-10 object-contain rounded bg-white p-1"
            />
          ) : (
            <Logo size={36} />
          )}
          <div>
            <div className="text-lg font-bold">{brand.schoolName}</div>
            <div className="text-xs opacity-80">School App</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((it) => (
            <NavItem
              key={it.id}
              {...it}
              active={route === it.id}
              onClick={setRoute}
              brand={brand}
            />
          ))}
        </nav>

        {/* Role tag */}
        <div>
          <div className="text-xs text-gray-200 mb-1">Viewing as</div>
          <div
            className="px-3 py-2 rounded-md text-sm font-semibold"
            style={{ backgroundColor: brand.orange, color: "#fff" }}
          >
            {currentRole}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ----------------------
// Mobile Drawer Navigation
// ----------------------
export function MobileDrawerNav({ brand, navItems, route, setRoute, mobileNavOpen, setMobileNavOpen }) {
  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setMobileNavOpen(false)}
      />
      <aside
        className="absolute left-0 top-0 bottom-0 w-72 p-4 shadow-lg"
        style={{ backgroundColor: brand.blue }}
      >
        <div className="flex items-center justify-between mb-4 text-white">
          <div className="flex items-center gap-2">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt="School Logo"
                className="h-9 w-9 object-contain rounded bg-white p-1"
              />
            ) : (
              <Logo size={30} />
            )}
            <span className="font-semibold">{brand.schoolName}</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="hover:text-[var(--brand-orange)]"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((it) => (
            <NavItem
              key={it.id}
              {...it}
              active={route === it.id}
              onClick={(id) => {
                setRoute(id);
                setMobileNavOpen(false);
              }}
              brand={brand}
              isMobile
            />
          ))}
        </nav>
      </aside>
    </div>
  );
}

// ----------------------
// Mobile Bottom Navigation
// ----------------------
export function MobileBottomNav({ brand, route, setRoute, navItems }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-inner flex justify-around py-1 lg:hidden"
      style={{
        backgroundColor: brand.blue,
        color: brand.light,
      }}
    >
      {navItems.slice(0, 5).map((item) => {
        const active = route === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setRoute(item.id)}
            className="flex flex-col items-center gap-0.5 flex-1 py-1"
          >
            <div
              className="w-6 h-6"
              style={{
                color: active ? brand.orange : brand.light,
                opacity: active ? 1 : 0.8,
              }}
            >
              {item.icon}
            </div>
            <span
              className="text-[10px] leading-tight"
              style={{
                color: active ? brand.orange : brand.light,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
