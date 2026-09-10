import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Package,
  Radio,
  ScanLine,
  MapPin,
  TrendingUp,
  Activity,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon,
  Clock3,
  Wifi,
  Database,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = [
  '#06b6d4',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center">

          <div className="relative flex h-16 w-16 items-center justify-center">

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-cyan-500" />

            <Radio className="h-6 w-6 text-cyan-500" />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-center">

          <p className="font-semibold text-red-700">
            Failed to load dashboard
          </p>

          <p className="mt-1 text-sm text-red-500">
            Please try refreshing the page.
          </p>

        </div>

      </div>
    );
  }

  const {
    overview,
    recentScans,
    assetsByCategory,
    assetsByStatus,
  } = data;

  const stats = [
    {
      label: 'Total Assets',
      value: overview.totalAssets,
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      glow: 'from-blue-500/10',
    },
    {
      label: 'RFID Tags',
      value: overview.totalTags,
      icon: Radio,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      glow: 'from-emerald-500/10',
    },
    {
      label: 'Assigned Tags',
      value: overview.assignedTags,
      icon: Activity,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      glow: 'from-violet-500/10',
    },
    {
      label: 'Total Scans',
      value: overview.totalScans,
      icon: ScanLine,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      glow: 'from-orange-500/10',
    },
    {
      label: 'Scans · 7 Days',
      value: overview.scansLast7Days,
      icon: TrendingUp,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      glow: 'from-cyan-500/10',
    },
    {
      label: 'Locations',
      value: overview.totalLocations,
      icon: MapPin,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      glow: 'from-pink-500/10',
    },
  ];

  const formatStatus = (status) => {
    if (!status) return 'Unknown';

    return status
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getActionStyle = (action) => {
    const styles = {
      inventory:
        'bg-cyan-50 text-cyan-700 border-cyan-100',
      'check-in':
        'bg-emerald-50 text-emerald-700 border-emerald-100',
      'check-out':
        'bg-blue-50 text-blue-700 border-blue-100',
      locate:
        'bg-violet-50 text-violet-700 border-violet-100',
    };

    return (
      styles[action] ||
      'bg-slate-50 text-slate-600 border-slate-100'
    );
  };

  return (
    <div className="min-h-full space-y-7">

      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Decorative Background */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute right-8 top-8 hidden opacity-[0.035] lg:block">
          <Radio className="h-44 w-44 text-slate-900" />
        </div>

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <BarChart3 className="h-7 w-7" />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Dashboard
                </h1>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

                  <span className="relative flex h-2 w-2">

                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                  </span>

                  System Online

                </span>

              </div>

              <p className="mt-1.5 text-sm text-slate-500">
                Real-time overview of your RFID asset management system.
              </p>

            </div>

          </div>


          {/* System status */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
              <Wifi className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">
                RFID Network
              </p>

              <p className="text-[11px] text-emerald-600">
                Operational
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Card glow */}
              <div
                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.glow} to-transparent blur-2xl transition-transform duration-500 group-hover:scale-150`}
              />

              <div className="relative flex items-start justify-between">

                <div>

                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {stat.value ?? 0}
                  </p>

                </div>

                <div
                  className={`rounded-xl ${stat.iconBg} p-3 ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>

              </div>

              <div className="relative mt-4 flex items-center gap-1 text-[10px] font-medium text-slate-400">

                <ArrowUpRight className="h-3 w-3 text-emerald-500" />

                Live data

              </div>

            </div>
          );
        })}

      </div>


      {/* =====================================================
          CHARTS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* CATEGORY CHART */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Assets by Category
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Distribution across asset categories
                </p>

              </div>

            </div>

            <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overview
            </span>

          </div>


          <div className="p-5">

            {assetsByCategory.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={290}
              >

                <BarChart
                  data={assetsByCategory}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: '#94a3b8',
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: 'rgba(6,182,212,0.05)',
                    }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow:
                        '0 10px 30px rgba(15,23,42,0.10)',
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#06b6d4"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={45}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-[290px] flex-col items-center justify-center">

                <BarChart3 className="h-10 w-10 text-slate-200" />

                <p className="mt-3 text-sm text-slate-400">
                  No category data available
                </p>

              </div>

            )}

          </div>

        </div>


        {/* STATUS CHART */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <PieChartIcon className="h-5 w-5" />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Assets by Status
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Current inventory status distribution
                </p>

              </div>

            </div>

            <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </span>

          </div>


          <div className="p-5">

            {assetsByStatus.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={290}
              >

                <PieChart>

                  <Pie
                    data={assetsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="48%"
                    innerRadius={58}
                    outerRadius={95}
                    paddingAngle={4}
                    stroke="none"
                    label={({ status, count }) =>
                      `${formatStatus(status)}: ${count}`
                    }
                    labelLine={false}
                  >

                    {assetsByStatus.map((_, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />

                    ))}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow:
                        '0 10px 30px rgba(15,23,42,0.10)',
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-[290px] flex-col items-center justify-center">

                <PieChartIcon className="h-10 w-10 text-slate-200" />

                <p className="mt-3 text-sm text-slate-400">
                  No status data available
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          RECENT SCANS
      ===================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <ScanLine className="h-5 w-5" />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Recent Scans
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                Latest RFID scanning activity
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

            </span>

            <span className="text-xs font-semibold text-emerald-700">
              Live Activity
            </span>

          </div>

        </div>


        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  RFID / UID
                </th>

                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Asset
                </th>

                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Action
                </th>

                <th className="whitespace-nowrap px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Scanned By
                </th>

                <th className="whitespace-nowrap px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Time
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {recentScans?.length > 0 ? (

                recentScans.map((scan) => (

                  <tr
                    key={scan._id}
                    className="group transition-colors hover:bg-cyan-50/30"
                  >

                    {/* UID */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-transform group-hover:scale-105">
                          <Radio className="h-4 w-4" />
                        </div>

                        <span className="font-mono text-xs font-semibold text-slate-600">
                          {scan.rfidTag?.uid ||
                            scan.uid ||
                            '—'}
                        </span>

                      </div>

                    </td>


                    {/* Asset */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Package className="h-4 w-4 text-slate-400" />

                        <span className="font-semibold text-slate-700">
                          {scan.asset?.name || '—'}
                        </span>

                      </div>

                    </td>


                    {/* Action */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getActionStyle(
                          scan.action
                        )}`}
                      >
                        {scan.action}
                      </span>

                    </td>


                    {/* User */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[10px] font-bold text-slate-500">
                          {(scan.scannedBy?.name ||
                            'S')[0].toUpperCase()}
                        </div>

                        <span className="text-slate-600">
                          {scan.scannedBy?.name ||
                            'System'}
                        </span>

                      </div>

                    </td>


                    {/* Time */}
                    <td className="px-5 py-4 text-right">

                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">

                        <Clock3 className="h-3.5 w-3.5" />

                        {new Date(
                          scan.createdAt
                        ).toLocaleString()}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="px-5 py-16 text-center"
                  >

                    <div className="mx-auto flex max-w-sm flex-col items-center">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">

                        <ScanLine className="h-7 w-7" />

                      </div>

                      <p className="mt-4 font-semibold text-slate-700">
                        No recent scans
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        RFID scanning activity will appear here.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          BOTTOM SYSTEM INFO
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <Database className="h-5 w-5" />
          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inventory Database
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {overview.totalAssets} assets registered
            </p>

          </div>

          <div className="ml-auto">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Healthy
            </span>

          </div>

        </div>


        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Radio className="h-5 w-5" />
          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              RFID Infrastructure
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {overview.totalTags} RFID tags registered
            </p>

          </div>

          <div className="ml-auto">

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;