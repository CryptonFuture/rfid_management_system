import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Search,
  ScanLine,
  Activity,
  Clock3,
  Radio,
  MapPin,
  User,
  Package,
  RefreshCw,
  ChevronRight,
  Database,
} from 'lucide-react';

const Scans = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchScans = async () => {
    try {
      setLoading(true);

      const res = await api.get('/rfid/scans', {
        params: {
          uid: search || undefined,
          limit: 50,
        },
      });

      setScans(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load scans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [search]);

  const totalScans = scans.length;

  const todayScans = scans.filter((scan) => {
    const today = new Date();
    const scanDate = new Date(scan.createdAt);

    return (
      today.toDateString() === scanDate.toDateString()
    );
  }).length;

  const uniqueReaders = new Set(
    scans.map((scan) => scan.readerId).filter(Boolean)
  ).size;

  const uniqueAssets = new Set(
    scans.map((scan) => scan.asset?._id).filter(Boolean)
  ).size;

  const getActionStyle = (action) => {
    const normalized = action?.toLowerCase();

    const styles = {
      scan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
      checkin: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      checkout: 'bg-blue-50 text-blue-700 border-blue-100',
      assign: 'bg-violet-50 text-violet-700 border-violet-100',
      unassign: 'bg-amber-50 text-amber-700 border-amber-100',
      move: 'bg-orange-50 text-orange-700 border-orange-100',
    };

    return (
      styles[normalized] ||
      'bg-slate-50 text-slate-700 border-slate-200'
    );
  };

  const formatTime = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="min-h-full bg-slate-50/40">

      {/* =========================================
          HEADER
      ========================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Decorative glow */}
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-200">
              <ScanLine className="h-7 w-7 text-white" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                  RFID Monitoring
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                Scan History
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor and review all RFID scan activity in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 sm:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-semibold text-emerald-700">
                System Operational
              </span>
            </div>

            <button
              onClick={fetchScans}
              disabled={loading}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 transition-transform ${
                  loading ? 'animate-spin' : 'group-hover:rotate-180'
                }`}
              />
              Refresh
            </button>

          </div>
        </div>
      </div>

      {/* =========================================
          STAT CARDS
      ========================================= */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-50 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Scans
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {totalScans}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Current records
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Today */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-50 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Today's Scans
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {todayScans}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Activity today
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock3 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Readers */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-50 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Readers
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {uniqueReaders}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Unique RFID readers
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Radio className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">

          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-50 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Scanned Assets
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {uniqueAssets}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Unique assets detected
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </div>

      </div>

      {/* =========================================
          SEARCH TOOLBAR
      ========================================= */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search by RFID UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Database className="h-4 w-4 text-cyan-500" />
              <span>
                Showing{' '}
                <strong className="font-bold text-slate-800">
                  {scans.length}
                </strong>{' '}
                records
              </span>
            </div>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-600">
                Live Registry
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================
          TABLE
      ========================================= */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>
            <h2 className="font-bold text-slate-900">
              Recent Scan Activity
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              RFID events and asset movement records
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <ScanLine className="h-4 w-4" />
          </div>

        </div>

        <div className="overflow-x-auto">

          {loading ? (
            <div className="space-y-3 p-5">

              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-100 p-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-slate-100" />
                    <div className="h-2.5 w-24 rounded bg-slate-100" />
                  </div>

                  <div className="h-7 w-20 rounded-full bg-slate-100" />
                  <div className="h-3 w-28 rounded bg-slate-100" />
                </div>
              ))}

            </div>
          ) : (
            <table className="w-full min-w-[1050px] text-left">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    RFID Tag
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Asset
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Action
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Reader
                  </th>

                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Scanned By
                  </th>

                  <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Timestamp
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {scans.map((scan) => (
                  <tr
                    key={scan._id}
                    className="group transition-colors duration-200 hover:bg-cyan-50/30"
                  >

                    {/* UID */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-cyan-50 text-cyan-600 transition-all group-hover:border-cyan-200 group-hover:bg-cyan-100">
                          <Radio className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="font-mono text-xs font-bold tracking-wide text-slate-800">
                            {scan.uid || '—'}
                          </p>

                          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            RFID UID
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Asset */}
                    <td className="px-5 py-4">

                      {scan.asset?.name ? (
                        <div className="flex items-center gap-2.5">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Package className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {scan.asset.name}
                            </p>

                            {scan.asset.serialNumber && (
                              <p className="font-mono text-[10px] text-slate-400">
                                {scan.asset.serialNumber}
                              </p>
                            )}
                          </div>

                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      )}

                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <MapPin className="h-4 w-4" />
                        </div>

                        <span className="text-sm font-medium text-slate-600">
                          {scan.location?.name || 'Unknown'}
                        </span>

                      </div>

                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold capitalize ${getActionStyle(
                          scan.action
                        )}`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                        {scan.action || 'scan'}
                      </span>

                    </td>

                    {/* Reader */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Radio className="h-4 w-4 text-slate-400" />

                        <span className="font-mono text-xs font-medium text-slate-600">
                          {scan.readerId || '—'}
                        </span>

                      </div>

                    </td>

                    {/* Scanned By */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2.5">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <User className="h-3.5 w-3.5" />
                        </div>

                        <span className="text-sm font-medium text-slate-600">
                          {scan.scannedBy?.name || 'System'}
                        </span>

                      </div>

                    </td>

                    {/* Time */}
                    <td className="px-5 py-4 text-right">

                      <div className="inline-flex items-center gap-2">

                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-700">
                            {scan.createdAt
                              ? new Date(scan.createdAt).toLocaleDateString(
                                  [],
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  }
                                )
                              : '—'}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {scan.createdAt
                              ? new Date(scan.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )
                              : ''}
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-cyan-500" />

                      </div>

                    </td>

                  </tr>
                ))}

                {/* Empty */}
                {scans.length === 0 && (
                  <tr>
                    <td colSpan="7">

                      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

                        <div className="relative mb-5">

                          <div className="absolute inset-0 rounded-2xl bg-cyan-100 blur-xl" />

                          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-cyan-500">
                            <ScanLine className="h-7 w-7" />
                          </div>

                        </div>

                        <h3 className="text-base font-bold text-slate-800">
                          No scan records found
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-400">
                          {search
                            ? `No RFID scans were found for UID "${search}".`
                            : 'RFID scan activity will appear here once tags are scanned.'}
                        </p>

                        {search && (
                          <button
                            onClick={() => setSearch('')}
                            className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-cyan-600"
                          >
                            Clear Search
                          </button>
                        )}

                      </div>

                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          )}

        </div>

        {/* Footer */}
        {!loading && scans.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />

              <span>
                RFID monitoring is active
              </span>
            </div>

            <span className="text-xs font-medium text-slate-400">
              Showing latest {scans.length} records
            </span>

          </div>
        )}

      </div>
    </div>
  );
};

export default Scans;