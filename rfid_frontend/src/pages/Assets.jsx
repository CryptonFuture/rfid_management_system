import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  MapPin,
  Radio,
  Tag,
  User,
  DollarSign,
  FileText,
  Layers,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Assets = () => {
  const { isAdmin } = useAuth();

  const [assets, setAssets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    serialNumber: '',
    location: '',
    rfidTag: '',
    status: 'available',
    assignedTo: '',
    purchasePrice: '',
  });

  const fetchData = async () => {
    try {
      const [assetsRes, locRes, tagsRes] = await Promise.all([
        api.get('/assets', {
          params: {
            search,
            limit: 100,
          },
        }),
        api.get('/locations'),
        api.get('/rfid', {
          params: {
            limit: 100,
          },
        }),
      ]);

      setAssets(assetsRes.data.data);
      setLocations(locRes.data.data);
      setTags(tagsRes.data.data);
    } catch (error) {
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: 'Electronics',
      serialNumber: '',
      location: '',
      rfidTag: '',
      status: 'available',
      assignedTo: '',
      purchasePrice: '',
    });
  };

  const openModal = (asset = null) => {
    if (asset) {
      setEditing(asset._id);

      setForm({
        name: asset.name || '',
        description: asset.description || '',
        category: asset.category || 'Electronics',
        serialNumber: asset.serialNumber || '',
        location: asset.location?._id || '',
        rfidTag: asset.rfidTag?._id || '',
        status: asset.status || 'available',
        assignedTo: asset.assignedTo || '',
        purchasePrice: asset.purchasePrice || '',
      });
    } else {
      setEditing(null);
      resetForm();
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...form };

      if (!payload.rfidTag) {
        payload.rfidTag = null;
      }

      if (!payload.purchasePrice) {
        delete payload.purchasePrice;
      }

      if (editing) {
        await api.put(`/assets/${editing}`, payload);
        toast.success('Asset updated successfully');
      } else {
        await api.post('/assets', payload);
        toast.success('Asset created successfully');
      }

      closeModal();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Operation failed'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      await api.delete(`/assets/${id}`);

      toast.success('Asset deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Delete failed'
      );
    }
  };

  const statusConfig = {
    available: {
      label: 'Available',
      className:
        'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },

    'in-use': {
      label: 'In Use',
      className:
        'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },

    maintenance: {
      label: 'Maintenance',
      className:
        'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },

    retired: {
      label: 'Retired',
      className:
        'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500',
    },

    lost: {
      label: 'Lost',
      className:
        'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
    },
  };

  const getStatus = (status) => {
    return (
      statusConfig[status] || {
        label: status,
        className: 'bg-gray-100 text-gray-700 border-gray-200',
        dot: 'bg-gray-500',
      }
    );
  };

  return (
    <div className="min-h-full space-y-7">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* Background Glow */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Package className="h-7 w-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Assets
                </h1>

                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                  {assets.length} Total
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Manage, monitor and track your inventory assets.
              </p>
            </div>

          </div>

          <button
            onClick={() => openModal()}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            Add Asset
            <ChevronRight className="h-4 w-4 opacity-70" />
          </button>

        </div>
      </div>


      {/* =========================================
          STAT CARDS
      ========================================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Total */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Assets
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {assets.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-transform group-hover:scale-110">
              <Package className="h-5 w-5" />
            </div>

          </div>
        </div>


        {/* Available */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Available
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {assets.filter(
                  (asset) => asset.status === 'available'
                ).length}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-transform group-hover:scale-110">
              <Activity className="h-5 w-5" />
            </div>

          </div>
        </div>


        {/* In Use */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                In Use
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {assets.filter(
                  (asset) => asset.status === 'in-use'
                ).length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-transform group-hover:scale-110">
              <User className="h-5 w-5" />
            </div>

          </div>
        </div>


        {/* RFID */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                RFID Linked
              </p>

              <p className="mt-2 text-2xl font-bold text-cyan-600">
                {assets.filter(
                  (asset) => asset.rfidTag
                ).length}
              </p>
            </div>

            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600 transition-transform group-hover:scale-110">
              <Radio className="h-5 w-5" />
            </div>

          </div>
        </div>

      </div>


      {/* =========================================
          SEARCH BAR
      ========================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search assets by name, serial number, RFID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}

        </div>

      </div>


      {/* =========================================
          ASSETS TABLE
      ========================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="font-bold text-slate-900">
              Asset Inventory
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Complete list of registered assets
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live inventory
          </div>

        </div>


        {loading ? (

          /* Loading */
          <div className="flex flex-col items-center justify-center py-20">

            <div className="relative">

              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-cyan-500" />

              <Package className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-cyan-500" />

            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading assets...
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Asset
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Serial
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    RFID
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {assets.map((asset) => {

                  const status = getStatus(asset.status);

                  return (
                    <tr
                      key={asset._id}
                      className="group transition-colors duration-200 hover:bg-cyan-50/30"
                    >

                      {/* Asset */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 transition-all group-hover:from-cyan-100 group-hover:to-blue-100 group-hover:text-cyan-600">
                            <Package className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[180px] truncate font-semibold text-slate-800">
                              {asset.name}
                            </p>

                            {asset.description && (
                              <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                                {asset.description}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>


                      {/* Category */}
                      <td className="px-5 py-4">

                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">

                          <Layers className="h-3.5 w-3.5" />

                          {asset.category}

                        </span>

                      </td>


                      {/* Serial */}
                      <td className="px-5 py-4">

                        <span className="font-mono text-xs text-slate-500">
                          {asset.serialNumber || '—'}
                        </span>

                      </td>


                      {/* RFID */}
                      <td className="px-5 py-4">

                        {asset.rfidTag?.uid ? (

                          <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-100 bg-cyan-50 px-2.5 py-1.5">

                            <Radio className="h-3.5 w-3.5 text-cyan-600" />

                            <span className="font-mono text-xs font-semibold text-cyan-700">
                              {asset.rfidTag.uid}
                            </span>

                          </div>

                        ) : (

                          <span className="text-slate-300">
                            —
                          </span>

                        )}

                      </td>


                      {/* Location */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-slate-600">

                          <MapPin className="h-4 w-4 text-slate-400" />

                          <span className="max-w-[140px] truncate">
                            {asset.location?.name || '—'}
                          </span>

                        </div>

                      </td>


                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />

                          {status.label}

                        </span>

                      </td>


                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1.5">

                          <button
                            onClick={() => openModal(asset)}
                            title="Edit asset"
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() =>
                                handleDelete(asset._id)
                              }
                              title="Delete asset"
                              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })}


                {/* Empty State */}
                {assets.length === 0 && (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-5 py-20 text-center"
                    >

                      <div className="mx-auto flex max-w-sm flex-col items-center">

                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <Package className="h-8 w-8" />
                        </div>

                        <h3 className="font-semibold text-slate-800">
                          No assets found
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {search
                            ? 'Try changing your search criteria.'
                            : 'Start by adding your first asset.'}
                        </p>

                        {!search && (
                          <button
                            onClick={() => openModal()}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600"
                          >
                            <Plus className="h-4 w-4" />
                            Add First Asset
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>
        )}

      </div>


      {/* =========================================
          PREMIUM MODAL
      ========================================= */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 px-6 py-6">

              <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />

              <div className="relative flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/10">
                    {editing ? (
                      <Edit2 className="h-5 w-5" />
                    ) : (
                      <Plus className="h-6 w-6" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editing
                        ? 'Edit Asset'
                        : 'Add New Asset'}
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-400">
                      {editing
                        ? 'Update asset information'
                        : 'Register a new inventory asset'}
                    </p>
                  </div>

                </div>

                <button
                  onClick={closeModal}
                  className="rounded-xl bg-white/10 p-2 text-slate-300 transition hover:bg-white/20 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

            </div>


            {/* Modal Body */}
            <div className="max-h-[calc(92vh-100px)] overflow-y-auto">

              <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
              >

                {/* Basic Information */}
                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div className="h-1 w-5 rounded-full bg-cyan-500" />

                    <h3 className="text-sm font-bold text-slate-800">
                      Basic Information
                    </h3>

                  </div>


                  <div className="space-y-4">

                    {/* Name */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Asset Name *
                      </label>

                      <div className="relative">

                        <Package className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g. MacBook Pro M3"
                          required
                        />

                      </div>

                    </div>


                    {/* Description */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Description
                      </label>

                      <div className="relative">

                        <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                        <textarea
                          rows="3"
                          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.description}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              description: e.target.value,
                            })
                          }
                          placeholder="Add asset description..."
                        />

                      </div>

                    </div>


                    {/* Category / Status */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <div>

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Category
                        </label>

                        <select
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.category}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              category: e.target.value,
                            })
                          }
                        >
                          {[
                            'Electronics',
                            'Furniture',
                            'Equipment',
                            'Vehicles',
                            'Tools',
                            'Documents',
                            'Other',
                          ].map((c) => (
                            <option
                              key={c}
                              value={c}
                            >
                              {c}
                            </option>
                          ))}
                        </select>

                      </div>


                      <div>

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                          Status
                        </label>

                        <select
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.status}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              status: e.target.value,
                            })
                          }
                        >
                          {[
                            'available',
                            'in-use',
                            'maintenance',
                            'retired',
                            'lost',
                          ].map((s) => (
                            <option
                              key={s}
                              value={s}
                            >
                              {s}
                            </option>
                          ))}
                        </select>

                      </div>

                    </div>

                  </div>

                </div>


                {/* Identification */}
                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div className="h-1 w-5 rounded-full bg-blue-500" />

                    <h3 className="text-sm font-bold text-slate-800">
                      Identification & Tracking
                    </h3>

                  </div>


                  <div className="space-y-4">

                    {/* Serial */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Serial Number
                      </label>

                      <input
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                        value={form.serialNumber}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            serialNumber: e.target.value,
                          })
                        }
                        placeholder="Enter serial number"
                      />

                    </div>


                    {/* Location */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Location *
                      </label>

                      <div className="relative">

                        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.location}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              location: e.target.value,
                            })
                          }
                          required
                        >

                          <option value="">
                            Select location
                          </option>

                          {locations.map((l) => (
                            <option
                              key={l._id}
                              value={l._id}
                            >
                              {l.name}
                            </option>
                          ))}

                        </select>

                      </div>

                    </div>


                    {/* RFID */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        RFID Tag
                      </label>

                      <div className="relative">

                        <Radio className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />

                        <select
                          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.rfidTag}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              rfidTag: e.target.value,
                            })
                          }
                        >

                          <option value="">
                            No RFID tag
                          </option>

                          {tags
                            .filter(
                              (t) =>
                                t.status ===
                                  'available' ||
                                t._id === form.rfidTag
                            )
                            .map((t) => (
                              <option
                                key={t._id}
                                value={t._id}
                              >
                                {t.uid} ({t.status})
                              </option>
                            ))}

                        </select>

                      </div>

                    </div>

                  </div>

                </div>


                {/* Assignment */}
                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div className="h-1 w-5 rounded-full bg-violet-500" />

                    <h3 className="text-sm font-bold text-slate-800">
                      Assignment & Purchase
                    </h3>

                  </div>


                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Assigned */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Assigned To
                      </label>

                      <div className="relative">

                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.assignedTo}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              assignedTo: e.target.value,
                            })
                          }
                          placeholder="Employee / Department"
                        />

                      </div>

                    </div>


                    {/* Price */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Purchase Price
                      </label>

                      <div className="relative">

                        <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="number"
                          min="0"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.purchasePrice}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              purchasePrice: e.target.value,
                            })
                          }
                          placeholder="0.00"
                        />

                      </div>

                    </div>

                  </div>

                </div>


                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >

                    {editing ? (
                      <>
                        <Edit2 className="h-4 w-4" />
                        Update Asset
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        Create Asset
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Assets;