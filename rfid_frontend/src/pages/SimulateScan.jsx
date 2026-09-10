import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ScanLine,
  CheckCircle,
  XCircle,
  Radio,
  Zap,
  Package,
  Activity,
  MapPin,
  LogIn,
  LogOut,
  Search,
  Cpu,
  Clock3,
  Hash,
  RefreshCw,
} from 'lucide-react';

const SimulateScan = () => {
  const [uid, setUid] = useState('');
  const [action, setAction] = useState('inventory');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    api
      .get('/rfid', { params: { limit: 50 } })
      .then((res) => setTags(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();

    if (!uid.trim()) {
      toast.error('Please enter a UID');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/rfid/scan', {
        uid: uid.trim().toUpperCase(),
        action,
        readerId: 'WEB-SIMULATOR',
      });

      setResult({
        success: true,
        data: res.data.data,
      });

      toast.success('Scan processed successfully!');
    } catch (error) {
      const data = error.response?.data;

      setResult({
        success: false,
        message: data?.message || 'Scan failed',
        data: data?.data,
      });

      toast.error(data?.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const quickScan = (tagUid) => {
    setUid(tagUid);
    setResult(null);
  };

  const actionConfig = {
    inventory: {
      label: 'Inventory',
      description: 'Record an inventory scan',
      icon: Package,
      active: 'border-cyan-400 bg-cyan-50 text-cyan-700 shadow-sm',
      iconBg: 'bg-cyan-100 text-cyan-600',
    },
    'check-in': {
      label: 'Check In',
      description: 'Register asset arrival',
      icon: LogIn,
      active: 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
    'check-out': {
      label: 'Check Out',
      description: 'Register asset departure',
      icon: LogOut,
      active: 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    locate: {
      label: 'Locate',
      description: 'Locate a registered asset',
      icon: MapPin,
      active: 'border-violet-400 bg-violet-50 text-violet-700 shadow-sm',
      iconBg: 'bg-violet-100 text-violet-600',
    },
  };

  const currentAction = actionConfig[action];
  const ActionIcon = currentAction.icon;

  return (
    <div className="min-h-full bg-slate-50/40">

      {/* =========================================
          HERO HEADER
      ========================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">

          <div className="flex items-start gap-4">

            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-200">

              <ScanLine className="h-7 w-7 text-white" />

              <span className="absolute -right-1 -top-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
              </span>

            </div>

            <div>

              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                  RFID Testing Console
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                Simulate RFID Scan
              </h1>

              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Test RFID scanning workflows without physical hardware.
                Select a registered tag and simulate a reader event.
              </p>

            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 sm:flex">
              <Activity className="h-4 w-4 text-emerald-600" />

              <span className="text-xs font-semibold text-emerald-700">
                Simulator Ready
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">

              <Cpu className="h-4 w-4 text-cyan-600" />

              <span className="font-mono text-xs font-bold text-slate-600">
                WEB-SIMULATOR
              </span>

            </div>

          </div>

        </div>
      </div>

      {/* =========================================
          MAIN GRID
      ========================================= */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

        {/* =======================================
            SCAN PANEL
        ======================================= */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Scan Configuration
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Configure the RFID event you want to simulate.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Radio className="h-5 w-5" />
              </div>

            </div>

          </div>

          <form onSubmit={handleScan} className="space-y-7 p-6">

            {/* UID */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-bold text-slate-700">
                  RFID UID
                </label>

                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Hash className="h-3 w-3" />
                  Tag Identifier
                </span>

              </div>

              <div className="relative">

                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <Radio className="h-5 w-5 text-cyan-500" />
                </div>

                <input
                  type="text"
                  value={uid}
                  onChange={(e) =>
                    setUid(e.target.value.toUpperCase())
                  }
                  placeholder="A1B2C3D4"
                  required
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-5 font-mono text-lg font-bold tracking-[0.12em] text-slate-800 outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
                />

                {uid && (
                  <button
                    type="button"
                    onClick={() => setUid('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Clear
                  </button>
                )}

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Enter a registered RFID UID or select one from the
                quick-select list.
              </p>

            </div>

            {/* ACTION */}
            <div>

              <div className="mb-3 flex items-center justify-between">

                <label className="text-sm font-bold text-slate-700">
                  Scan Action
                </label>

                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Event Type
                </span>

              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                {Object.entries(actionConfig).map(
                  ([key, config]) => {
                    const Icon = config.icon;
                    const selected = action === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAction(key)}
                        className={`group rounded-2xl border p-3 text-left transition-all duration-200 ${
                          selected
                            ? config.active
                            : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >

                        <div
                          className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                            selected
                              ? config.iconBg
                              : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <p
                          className={`text-xs font-bold ${
                            selected
                              ? ''
                              : 'text-slate-700'
                          }`}
                        >
                          {config.label}
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-slate-400">
                          {config.description}
                        </p>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* Reader Preview */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                    <Cpu className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Virtual RFID Reader
                    </p>

                    <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                      WEB-SIMULATOR
                    </p>
                  </div>

                </div>

                <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ready
                </span>

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Processing Scan...
                </>
              ) : (
                <>
                  <ScanLine className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Simulate {currentAction.label} Scan
                  <Zap className="h-4 w-4 opacity-80" />
                </>
              )}

            </button>

          </form>
        </div>

        {/* =======================================
            QUICK TAGS
        ======================================= */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Registered Tags
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Quickly select an existing RFID tag.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Search className="h-5 w-5" />
              </div>

            </div>

          </div>

          <div className="p-5">

            {tags.length > 0 ? (
              <div className="space-y-2">

                {tags.map((tag) => {

                  const selected = uid === tag.uid;

                  return (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => quickScan(tag.uid)}
                      className={`group flex w-full items-center justify-between rounded-2xl border p-3 text-left transition-all ${
                        selected
                          ? 'border-cyan-300 bg-cyan-50 shadow-sm'
                          : 'border-slate-100 bg-slate-50/50 hover:border-cyan-200 hover:bg-cyan-50/50'
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            selected
                              ? 'bg-cyan-100 text-cyan-600'
                              : 'bg-white text-slate-400 shadow-sm'
                          }`}
                        >
                          <Radio className="h-4 w-4" />
                        </div>

                        <div>

                          <p className="font-mono text-xs font-bold tracking-wide text-slate-700">
                            {tag.uid}
                          </p>

                          <p className="mt-1 text-[10px] capitalize text-slate-400">
                            RFID Tag
                          </p>

                        </div>

                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${
                          tag.status === 'available'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                            : tag.status === 'assigned'
                            ? 'border-blue-100 bg-blue-50 text-blue-700'
                            : tag.status === 'damaged'
                            ? 'border-amber-100 bg-amber-50 text-amber-700'
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}
                      >
                        {tag.status || 'unknown'}
                      </span>

                    </button>
                  );
                })}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                  <Radio className="h-6 w-6" />
                </div>

                <h3 className="text-sm font-bold text-slate-700">
                  No registered tags
                </h3>

                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  Registered RFID tags will appear here for quick selection.
                </p>

              </div>
            )}

          </div>

          {tags.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">

              <div className="flex items-center justify-between">

                <span className="text-xs font-medium text-slate-400">
                  Registered Tags
                </span>

                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                  {tags.length}
                </span>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* =========================================
          RESULT
      ========================================= */}
      {result && (
        <div
          className={`mt-6 overflow-hidden rounded-3xl border shadow-sm ${
            result.success
              ? 'border-emerald-200 bg-white'
              : 'border-red-200 bg-white'
          }`}
        >

          {/* Result Header */}
          <div
            className={`flex items-center justify-between border-b px-6 py-5 ${
              result.success
                ? 'border-emerald-100 bg-emerald-50/50'
                : 'border-red-100 bg-red-50/50'
            }`}
          >

            <div className="flex items-center gap-4">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  result.success
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
              </div>

              <div>

                <h2
                  className={`font-bold ${
                    result.success
                      ? 'text-emerald-800'
                      : 'text-red-800'
                  }`}
                >
                  {result.success
                    ? 'Scan Successful'
                    : 'Scan Failed'}
                </h2>

                <p
                  className={`mt-1 text-xs ${
                    result.success
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.success
                    ? 'RFID event was successfully processed and recorded.'
                    : result.message}
                </p>

              </div>

            </div>

            <span
              className={`hidden rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sm:block ${
                result.success
                  ? 'border-emerald-200 bg-white text-emerald-700'
                  : 'border-red-200 bg-white text-red-700'
              }`}
            >
              {result.success ? 'Processed' : 'Error'}
            </span>

          </div>

          {/* Result Body */}
          {result.data && (
            <div className="p-6">

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {result.data.tag && (
                  <>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

                      <div className="mb-2 flex items-center gap-2">
                        <Radio className="h-4 w-4 text-cyan-500" />

                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          UID
                        </span>
                      </div>

                      <p className="font-mono text-sm font-bold tracking-wide text-slate-800">
                        {result.data.tag.uid}
                      </p>

                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

                      <div className="mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />

                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Status
                        </span>
                      </div>

                      <p className="text-sm font-bold capitalize text-slate-800">
                        {result.data.tag.status || '—'}
                      </p>

                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

                      <div className="mb-2 flex items-center gap-2">
                        <ScanLine className="h-4 w-4 text-violet-500" />

                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Scan Count
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-800">
                        {result.data.tag.scanCount ?? 0}
                      </p>

                    </div>

                    {result.data.tag.asset && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

                        <div className="mb-2 flex items-center gap-2">
                          <Package className="h-4 w-4 text-emerald-500" />

                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Asset
                          </span>
                        </div>

                        <p className="truncate text-sm font-bold text-slate-800">
                          {result.data.tag.asset.name ||
                            result.data.scan?.asset?.name ||
                            '—'}
                        </p>

                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Scan Recorded */}
              {result.data.scan && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Scan Recorded
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(
                        result.data.scan.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default SimulateScan;