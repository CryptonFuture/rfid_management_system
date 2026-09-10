import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Radio,
  History,
  MapPin,
  ScanLine,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Activity,
  Wifi,
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & analytics',
    },
    {
      to: '/assets',
      icon: Package,
      label: 'Assets',
      description: 'Manage inventory',
    },
    {
      to: '/rfid-tags',
      icon: Radio,
      label: 'RFID Tags',
      description: 'Tag registry',
    },
    {
      to: '/scans',
      icon: History,
      label: 'Scan History',
      description: 'Scan activity',
    },
    {
      to: '/locations',
      icon: MapPin,
      label: 'Locations',
      description: 'Asset locations',
    },
    {
      to: '/simulate',
      icon: ScanLine,
      label: 'Simulate Scan',
      description: 'Test RFID scans',
    },
  ];

  const initials =
    user?.name
      ?.split(' ')
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================================
          MOBILE OVERLAY
      ================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================================
          SIDEBAR
      ================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[270px] flex-col
          border-r border-slate-200
          bg-white
          shadow-[8px_0_30px_rgba(15,23,42,0.04)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* ============================
            BRAND
        ============================= */}
        <div className="flex h-[78px] shrink-0 items-center border-b border-slate-100 px-5">

          <div className="flex min-w-0 flex-1 items-center gap-3">

            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-200/60">

              <Radio className="h-5 w-5 text-white" />

              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-extrabold tracking-tight text-slate-900">
                RFID System
              </h1>

              <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Asset Management
              </p>
            </div>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {/* ============================
            SYSTEM STATUS
        ============================= */}
        <div className="shrink-0 px-4 pt-4">

          <div className="rounded-xl border border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm">
                <Wifi className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  System Status
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="truncate text-[11px] font-bold text-emerald-700">
                    All Systems Online
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ============================
            NAVIGATION
        ============================= */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">

          <div className="mb-2 px-2.5">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </span>
          </div>

          <div className="space-y-1">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3
                    rounded-xl px-2.5 py-2.5
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-500 to-blue-600" />
                      )}

                      {/* Icon */}
                      <div
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center
                          rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? 'bg-white text-cyan-600 shadow-sm'
                              : 'bg-slate-100/70 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm'
                          }
                        `}
                      >
                        <Icon className="h-[17px] w-[17px]" />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">

                        <p
                          className={`
                            truncate text-[12px] font-bold
                            ${
                              isActive
                                ? 'text-cyan-700'
                                : 'text-slate-600 group-hover:text-slate-900'
                            }
                          `}
                        >
                          {item.label}
                        </p>

                        <p
                          className={`
                            mt-0.5 truncate text-[9px] font-medium
                            ${
                              isActive
                                ? 'text-cyan-500'
                                : 'text-slate-400'
                            }
                          `}
                        >
                          {item.description}
                        </p>

                      </div>

                      <ChevronRight
                        className={`
                          h-3.5 w-3.5 shrink-0
                          transition-all duration-200
                          ${
                            isActive
                              ? 'translate-x-0 text-cyan-500 opacity-100'
                              : '-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>
        </nav>

        {/* ============================
            USER AREA
        ============================= */}
        <div className="shrink-0 border-t border-slate-100 p-3">

          <div className="mb-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5">

            <div className="flex items-center gap-2.5">

              <div className="relative shrink-0">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-[11px] font-extrabold text-white shadow-sm">
                  {initials}
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />

              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-[12px] font-bold text-slate-800">
                  {user?.name || 'User'}
                </p>

                <div className="mt-0.5 flex items-center gap-1">

                  <ShieldCheck className="h-3 w-3 shrink-0 text-cyan-500" />

                  <p className="truncate text-[9px] font-semibold capitalize text-slate-400">
                    {user?.role || 'User'}
                  </p>

                </div>

              </div>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[12px] font-semibold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-red-100">
              <LogOut className="h-3.5 w-3.5" />
            </span>

            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* ================================
          MAIN WRAPPER
      ================================= */}
      <div className="min-h-screen lg:pl-[270px]">

        {/* ============================
            HEADER
        ============================= */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

          <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-8">

            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>

            {/* Header title */}
            <div className="flex min-w-0 flex-1 items-center gap-3">

              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 sm:flex">
                <Activity className="h-4 w-4" />
              </div>

              <div className="min-w-0">

                <h2 className="truncate text-sm font-bold text-slate-800 sm:text-[15px]">
                  RFID Asset Management
                </h2>

                <p className="hidden truncate text-[10px] font-medium text-slate-400 sm:block">
                  Smart inventory & real-time tracking platform
                </p>

              </div>

            </div>

            {/* Live status */}
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:px-3">

              <span className="relative flex h-2 w-2">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />

              </span>

              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 sm:text-[10px]">
                Live
              </span>

            </div>

            {/* Mobile avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-extrabold text-white sm:hidden">
              {initials}
            </div>

          </div>

        </header>

        {/* ============================
            PAGE CONTENT
        ============================= */}
        <main className="min-h-[calc(100vh-68px)] overflow-x-hidden p-4 sm:p-5 lg:p-7 xl:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;