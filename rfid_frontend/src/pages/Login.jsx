import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Radio,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ScanLine,
  LockKeyhole,
  Mail,
  Activity,
  CheckCircle2,
  Zap,
  Package,
  BarChart3,
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@rfid.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-200/30 blur-[100px]" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage: `
              linear-gradient(#cbd5e1 1px, transparent 1px),
              linear-gradient(90deg, #cbd5e1 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage:
              'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
          }}
        />

      </div>

      {/* =====================================================
          PAGE
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">

        <div className="w-full max-w-5xl">

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)]">

            <div className="grid lg:grid-cols-2">

              {/* =================================================
                  LEFT PANEL
              ================================================= */}

              <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50/70 p-8 lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between xl:p-12">

                {/* Background decorations */}

                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-200/30 blur-[80px]" />

                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-200/30 blur-[80px]" />

                {/* Brand */}

                <div className="relative z-10 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-200/70">
                    <Radio className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                      RFID System
                    </h2>

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-600">
                      Asset Management
                    </p>
                  </div>

                </div>

                {/* Center visual */}

                <div className="relative flex flex-1 items-center justify-center">

                  <div className="relative flex h-[330px] w-[330px] items-center justify-center">

                    {/* Rings */}

                    <div className="absolute inset-0 rounded-full border border-cyan-200/70" />

                    <div className="absolute inset-8 rounded-full border border-cyan-200/60" />

                    <div className="absolute inset-16 rounded-full border border-cyan-200/50" />

                    <div className="absolute inset-24 rounded-full border border-cyan-200/40" />

                    {/* Orbit dots */}

                    <span className="absolute left-10 top-20 h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-lg shadow-cyan-300" />

                    <span className="absolute right-12 top-12 h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-300" />

                    <span className="absolute bottom-14 right-8 h-2.5 w-2.5 rounded-full bg-cyan-500" />

                    <span className="absolute bottom-16 left-12 h-2 w-2 rounded-full bg-blue-400" />

                    {/* Center */}

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-[24px] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_20px_50px_rgba(6,182,212,0.30)]">

                      <Radio className="h-11 w-11 text-white" />

                      <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </div>

                    </div>

                  </div>

                </div>

                {/* Bottom content */}

                <div className="relative z-10">

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      System Operational
                    </span>

                  </div>

                  <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 xl:text-[46px]">

                    Smarter Asset

                    <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                      Tracking.
                    </span>

                  </h1>

                  <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                    Manage RFID tags, monitor assets, track inventory,
                    and get real-time visibility across your operation.
                  </p>

                  {/* Feature cards */}

                  <div className="mt-6 grid grid-cols-3 gap-2">

                    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm">

                      <ScanLine className="mb-2 h-4 w-4 text-cyan-600" />

                      <p className="text-[10px] font-bold text-slate-800">
                        Live Scanning
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        Instant detection
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm">

                      <Package className="mb-2 h-4 w-4 text-blue-600" />

                      <p className="text-[10px] font-bold text-slate-800">
                        Asset Control
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        Easy management
                      </p>

                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm">

                      <BarChart3 className="mb-2 h-4 w-4 text-indigo-600" />

                      <p className="text-[10px] font-bold text-slate-800">
                        Analytics
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        Smart insights
                      </p>

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  RIGHT PANEL
              ================================================= */}

              <section className="flex items-center bg-white px-5 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">

                <div className="mx-auto w-full max-w-[390px]">

                  {/* Mobile logo */}

                  <div className="mb-7 flex justify-center lg:hidden">

                    <div className="relative">

                      <div className="absolute inset-0 rounded-2xl bg-cyan-300/30 blur-xl" />

                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-200">
                        <Radio className="h-7 w-7 text-white" />
                      </div>

                    </div>

                  </div>

                  {/* Header */}

                  <div className="mb-7">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5">

                      <Activity className="h-3.5 w-3.5 text-cyan-600" />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                        Secure Portal
                      </span>

                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[36px]">
                      Welcome back
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Sign in to access your RFID management dashboard.
                    </p>

                  </div>

                  {/* Form */}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >

                    {/* Email */}

                    <div>

                      <label className="mb-2 block text-xs font-bold text-slate-700">
                        Email address
                      </label>

                      <div className="group relative">

                        <Mail className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-600" />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@rfid.com"
                          required
                          className="
                            h-12 w-full rounded-xl
                            border border-slate-200
                            bg-slate-50
                            pl-11 pr-4
                            text-sm font-medium text-slate-800
                            outline-none
                            transition-all
                            placeholder:text-slate-400
                            hover:border-slate-300
                            focus:border-cyan-400
                            focus:bg-white
                            focus:ring-4
                            focus:ring-cyan-100
                          "
                        />

                      </div>

                    </div>

                    {/* Password */}

                    <div>

                      <div className="mb-2 flex items-center justify-between">

                        <label className="text-xs font-bold text-slate-700">
                          Password
                        </label>

                        <span className="text-[10px] font-semibold text-slate-400">
                          Secure login
                        </span>

                      </div>

                      <div className="group relative">

                        <LockKeyhole className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-600" />

                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="
                            h-12 w-full rounded-xl
                            border border-slate-200
                            bg-slate-50
                            pl-11 pr-12
                            text-sm font-medium text-slate-800
                            outline-none
                            transition-all
                            placeholder:text-slate-400
                            hover:border-slate-300
                            focus:border-cyan-400
                            focus:bg-white
                            focus:ring-4
                            focus:ring-cyan-100
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-cyan-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-[17px] w-[17px]" />
                          ) : (
                            <Eye className="h-[17px] w-[17px]" />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* Security row */}

                    <div className="flex items-center justify-between pt-1">

                      <label className="flex cursor-pointer items-center gap-2">

                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />

                        <span className="text-[10px] font-medium text-slate-500">
                          Keep me signed in
                        </span>

                      </label>

                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        Protected

                      </div>

                    </div>

                    {/* Login button */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        group relative mt-2 flex h-12 w-full
                        items-center justify-center
                        overflow-hidden rounded-xl
                        bg-gradient-to-r from-cyan-500 to-blue-600
                        text-sm font-bold text-white
                        shadow-lg shadow-cyan-200/60
                        transition-all duration-300
                        hover:-translate-y-0.5
                        hover:shadow-xl hover:shadow-cyan-200
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >

                      <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative flex items-center gap-2">

                        {loading ? (
                          <>
                            <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign in
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}

                      </span>

                    </button>

                  </form>

                  {/* Demo credentials */}

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">

                    <div className="mb-3 flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </div>

                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                          Demo Credentials
                        </span>

                      </div>

                      <Zap className="h-4 w-4 text-amber-500" />

                    </div>

                    <div className="space-y-2">

                      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">

                        <span className="text-[10px] font-bold text-slate-500">
                          Admin
                        </span>

                        <code className="text-[9px] font-semibold text-cyan-600 sm:text-[10px]">
                          admin@rfid.com / admin123
                        </code>

                      </div>

                      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">

                        <span className="text-[10px] font-bold text-slate-500">
                          Operator
                        </span>

                        <code className="text-right text-[9px] font-semibold text-blue-600 sm:text-[10px]">
                          operator@rfid.com / operator123
                        </code>

                      </div>

                    </div>

                  </div>

                  {/* Security footer */}

                  <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">

                    <LockKeyhole className="h-3.5 w-3.5 text-emerald-500" />

                    <span>
                      Secure encrypted connection
                    </span>

                  </div>

                </div>

              </section>

            </div>

          </div>

          {/* Footer */}

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">

            <Radio className="h-3 w-3 text-cyan-500" />

            <span>RFID Management System</span>

            <span className="text-slate-300">•</span>

            <span>Secure Asset Intelligence</span>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;