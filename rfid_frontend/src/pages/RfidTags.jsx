import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Radio,
  Activity,
  CheckCircle2,
  Link2,
  AlertTriangle,
  Clock3,
  Hash,
  Cpu,
  FileText,
  ShieldCheck,
  Zap,
  Database,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RfidTags = () => {
  const { isAdmin } = useAuth();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    uid: '',
    type: 'passive',
    notes: '',
  });

  const fetchTags = async () => {
    try {
      setLoading(true);

      const res = await api.get('/rfid', {
        params: {
          search,
          limit: 100,
        },
      });

      setTags(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [search]);

  const resetForm = () => {
    setForm({
      uid: '',
      type: 'passive',
      notes: '',
    });
  };

  const openModal = (tag = null) => {
    if (tag) {
      setEditing(tag._id);

      setForm({
        uid: tag.uid || '',
        type: tag.type || 'passive',
        notes: tag.notes || '',
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
      if (editing) {
        await api.put(`/rfid/${editing}`, form);
        toast.success('RFID tag updated successfully');
      } else {
        await api.post('/rfid', form);
        toast.success('RFID tag created successfully');
      }

      closeModal();
      fetchTags();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Operation failed'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this RFID tag?')) return;

    try {
      await api.delete(`/rfid/${id}`);

      toast.success('RFID tag deleted successfully');

      fetchTags();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Delete failed'
      );
    }
  };

  const totalTags = tags.length;

  const availableTags = tags.filter(
    (tag) => tag.status === 'available'
  ).length;

  const assignedTags = tags.filter(
    (tag) => tag.status === 'assigned'
  ).length;

  const damagedTags = tags.filter(
    (tag) =>
      tag.status === 'damaged' ||
      tag.status === 'lost'
  ).length;

  const statusConfig = {
    available: {
      label: 'Available',
      icon: CheckCircle2,
      className:
        'bg-emerald-50 text-emerald-600 border-emerald-200',
      dot: 'bg-emerald-500',
    },

    assigned: {
      label: 'Assigned',
      icon: Link2,
      className:
        'bg-blue-50 text-blue-600 border-blue-200',
      dot: 'bg-blue-500',
    },

    damaged: {
      label: 'Damaged',
      icon: AlertTriangle,
      className:
        'bg-amber-50 text-amber-600 border-amber-200',
      dot: 'bg-amber-500',
    },

    lost: {
      label: 'Lost',
      icon: AlertTriangle,
      className:
        'bg-red-50 text-red-600 border-red-200',
      dot: 'bg-red-500',
    },
  };

  const typeConfig = {
    passive: {
      label: 'Passive',
      icon: Radio,
    },

    active: {
      label: 'Active',
      icon: Zap,
    },

    'semi-passive': {
      label: 'Semi-Passive',
      icon: Activity,
    },
  };

  return (
    <div className="min-h-full space-y-7 bg-slate-50/40 pb-8 text-slate-900">

      {/* =========================================================
          PREMIUM HEADER
      ========================================================= */}

      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">

        {/* Decorative Background */}
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute right-10 top-10 opacity-[0.035]">
          <Radio className="h-48 w-48 text-cyan-600" />
        </div>

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-sm">

              <Radio className="h-7 w-7 text-cyan-600" />

              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />

            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  RFID Tags
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                  <Radio className="h-3.5 w-3.5" />
                  {totalTags} Tags
                </span>

              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage, monitor and track RFID identifiers connected
                to your asset management infrastructure.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4">

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  RFID system operational
                </div>

                <div className="hidden h-4 w-px bg-slate-200 sm:block" />

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Database className="h-3.5 w-3.5 text-slate-400" />
                  Live registry
                </div>

              </div>

            </div>

          </div>

          <button
            onClick={() => openModal()}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/25 active:translate-y-0"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            Add RFID Tag
          </button>

        </div>
      </section>


      {/* =========================================================
          STATS
      ========================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-100 blur-3xl transition-all group-hover:bg-cyan-200" />

          <div className="relative flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Tags
              </p>

              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {totalTags}
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-400">
                Registered in system
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-100 bg-cyan-50">
              <Hash className="h-5 w-5 text-cyan-600" />
            </div>

          </div>

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
          </div>

        </div>


        {/* Available */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available
              </p>

              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {availableTags}
              </h3>

              <p className="mt-1 text-xs font-medium text-emerald-600">
                Ready for assignment
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

          </div>

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${
                  totalTags
                    ? Math.min(
                        100,
                        (availableTags / totalTags) * 100
                      )
                    : 0
                }%`,
              }}
            />
          </div>

        </div>


        {/* Assigned */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned
              </p>

              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {assignedTags}
              </h3>

              <p className="mt-1 text-xs font-medium text-blue-600">
                Linked to assets
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
              <Link2 className="h-5 w-5 text-blue-600" />
            </div>

          </div>

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${
                  totalTags
                    ? Math.min(
                        100,
                        (assignedTags / totalTags) * 100
                      )
                    : 0
                }%`,
              }}
            />
          </div>

        </div>


        {/* Issues */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-100 blur-3xl" />

          <div className="relative flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Issues
              </p>

              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {damagedTags}
              </h3>

              <p className="mt-1 text-xs font-medium text-red-500">
                Damaged or lost
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>

          </div>

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-500 transition-all"
              style={{
                width: `${
                  totalTags
                    ? Math.min(
                        100,
                        (damagedTags / totalTags) * 100
                      )
                    : 0
                }%`,
              }}
            />
          </div>

        </div>

      </div>


      {/* =========================================================
          SEARCH / TOOLBAR
      ========================================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-100 bg-cyan-50">
              <Database className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                RFID Registry
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Search and manage registered RFID identifiers
              </p>
            </div>

          </div>

          <div className="relative w-full lg:max-w-md">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search by UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}

          </div>

        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3">

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Registry synchronized
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {tags.length} result{tags.length !== 1 ? 's' : ''}
          </span>

        </div>

      </section>


      {/* =========================================================
          TABLE
      ========================================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="flex min-h-[430px] flex-col items-center justify-center">

            <div className="relative flex h-20 w-20 items-center justify-center">

              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-100" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-sm">
                <Radio className="h-7 w-7 animate-pulse text-cyan-600" />
              </div>

            </div>

            <p className="mt-5 text-sm font-bold text-slate-600">
              Loading RFID registry...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait while we synchronize your tags
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-sm">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50/80 text-left">

                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    RFID Identifier
                  </th>

                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Type
                  </th>

                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Assigned Asset
                  </th>

                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Scans
                  </th>

                  <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Last Scanned
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {tags.map((tag, index) => {

                  const status =
                    statusConfig[tag.status] ||
                    statusConfig.available;

                  const StatusIcon = status.icon;

                  const type =
                    typeConfig[tag.type] ||
                    typeConfig.passive;

                  const TypeIcon = type.icon;

                  return (

                    <tr
                      key={tag._id}
                      className="group border-b border-slate-100 transition-all duration-200 hover:bg-cyan-50/30"
                    >

                      {/* UID */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 transition-all group-hover:border-cyan-200 group-hover:shadow-sm">

                            <Radio className="h-4.5 w-4.5 text-cyan-600" />

                            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />

                          </div>

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <span className="font-mono text-sm font-bold tracking-wider text-slate-800">
                                {tag.uid}
                              </span>

                              <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-slate-400">
                                UID
                              </span>

                            </div>

                            <p className="mt-1 text-[11px] font-medium text-slate-400">
                              RFID #{String(index + 1).padStart(3, '0')}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* TYPE */}
                      <td className="px-6 py-5">

                        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">

                          <TypeIcon className="h-3.5 w-3.5 text-cyan-600" />

                          <span className="text-xs font-bold capitalize text-slate-600">
                            {tag.type}
                          </span>

                        </div>

                      </td>


                      {/* STATUS */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />

                          <StatusIcon className="h-3.5 w-3.5" />

                          {status.label}

                        </span>

                      </td>


                      {/* ASSET */}
                      <td className="px-6 py-5">

                        {tag.asset?.name ? (

                          <div className="flex items-center gap-2.5">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50">
                              <Link2 className="h-4 w-4 text-blue-600" />
                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[180px] truncate text-xs font-bold text-slate-700">
                                {tag.asset.name}
                              </p>

                              <p className="mt-0.5 text-[10px] font-medium text-blue-500">
                                Linked asset
                              </p>

                            </div>

                          </div>

                        ) : (

                          <div className="flex items-center gap-2">

                            <div className="h-2 w-2 rounded-full bg-slate-300" />

                            <span className="text-xs font-medium text-slate-400">
                              Unassigned
                            </span>

                          </div>

                        )}

                      </td>


                      {/* SCANS */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
                            <Activity className="h-3.5 w-3.5 text-cyan-600" />
                          </div>

                          <div>

                            <span className="font-bold text-slate-700">
                              {tag.scanCount ?? 0}
                            </span>

                            <span className="ml-1 text-xs font-medium text-slate-400">
                              scans
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* LAST SCANNED */}
                      <td className="px-6 py-5">

                        {tag.lastScanned ? (

                          <div className="flex items-center gap-2">

                            <Clock3 className="h-4 w-4 text-slate-400" />

                            <span className="text-xs font-medium text-slate-500">
                              {new Date(
                                tag.lastScanned
                              ).toLocaleString()}
                            </span>

                          </div>

                        ) : (

                          <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-400">
                            Never scanned
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => openModal(tag)}
                            title="Edit RFID tag"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {isAdmin &&
                            tag.status !== 'assigned' && (

                              <button
                                onClick={() =>
                                  handleDelete(tag._id)
                                }
                                title="Delete RFID tag"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>

                            )}

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>


            {/* EMPTY STATE */}

            {tags.length === 0 && (

              <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50">

                  <div className="absolute inset-0 animate-pulse rounded-3xl bg-cyan-100/50" />

                  <Radio className="relative h-8 w-8 text-cyan-500" />

                </div>

                <h3 className="mt-5 text-base font-bold text-slate-700">
                  No RFID tags found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">

                  {search
                    ? 'No RFID tag matches your current search.'
                    : 'Start by registering your first RFID tag in the system.'}

                </p>

                {!search && (

                  <button
                    onClick={() => openModal()}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Tag
                  </button>

                )}

              </div>

            )}

          </div>

        )}

      </section>


      {/* =========================================================
          PREMIUM MODAL
      ========================================================= */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop */}

          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={closeModal}
          />


          {/* Modal */}

          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.25)]">

            {/* Top Glow */}

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-100 blur-3xl" />

            <div className="absolute -left-20 top-20 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />


            {/* Modal Header */}

            <div className="relative border-b border-slate-100 px-6 py-5 sm:px-7">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50">

                    <Radio className="h-5 w-5 text-cyan-600" />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="text-lg font-extrabold text-slate-900">
                        {editing
                          ? 'Edit RFID Tag'
                          : 'Add RFID Tag'}
                      </h2>

                      <Sparkles className="h-4 w-4 text-cyan-500" />

                    </div>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {editing
                        ? 'Update RFID configuration'
                        : 'Register a new RFID identifier'}
                    </p>

                  </div>

                </div>

                <button
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="relative space-y-5 p-6 sm:p-7"
            >

              {/* UID */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">

                  <Hash className="h-3.5 w-3.5 text-cyan-600" />

                  RFID UID

                  <span className="text-red-500">*</span>

                </label>

                <div className="relative">

                  <Cpu className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    value={form.uid}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        uid: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="A1B2C3D4"
                    required
                    disabled={!!editing}
                  />

                </div>

                <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-slate-400">

                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />

                  Hexadecimal format • 8–24 characters

                </div>

              </div>


              {/* TYPE */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">

                  <Radio className="h-3.5 w-3.5 text-cyan-600" />

                  RFID Type

                </label>

                <div className="grid grid-cols-3 gap-2">

                  {[
                    {
                      value: 'passive',
                      label: 'Passive',
                      icon: Radio,
                    },
                    {
                      value: 'active',
                      label: 'Active',
                      icon: Zap,
                    },
                    {
                      value: 'semi-passive',
                      label: 'Semi-Passive',
                      icon: Activity,
                    },
                  ].map((item) => {

                    const Icon = item.icon;

                    const selected =
                      form.type === item.value;

                    return (

                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            type: item.value,
                          })
                        }
                        className={`relative flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-all duration-200 ${
                          selected
                            ? 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-white hover:text-slate-600'
                        }`}
                      >

                        {selected && (
                          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                        )}

                        <Icon className="h-5 w-5" />

                        {item.label}

                      </button>

                    );

                  })}

                </div>

              </div>


              {/* NOTES */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">

                  <FileText className="h-3.5 w-3.5 text-cyan-600" />

                  Notes

                </label>

                <textarea
                  className="min-h-[110px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  rows="3"
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add additional information about this RFID tag..."
                />

              </div>


              {/* LIVE PREVIEW */}

              <div className="relative overflow-hidden rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4">

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-100 blur-2xl" />

                <div className="relative flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-100 bg-white shadow-sm">

                    <Radio className="h-5 w-5 text-cyan-600" />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      RFID Preview
                    </p>

                    <p className="mt-1 truncate font-mono text-sm font-extrabold tracking-wider text-cyan-700">
                      {form.uid || 'A1B2C3D4'}
                    </p>

                  </div>

                  <div className="ml-auto">

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-extrabold text-emerald-600">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                      READY

                    </span>

                  </div>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">

                <button
                  type="button"
                  onClick={closeModal}
                  className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="group h-12 flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/25"
                >

                  <span className="flex items-center justify-center gap-2">

                    <Radio className="h-4 w-4 transition-transform group-hover:scale-110" />

                    {editing
                      ? 'Update Tag'
                      : 'Create Tag'}

                    <ChevronRight className="h-4 w-4 opacity-70" />

                  </span>

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default RfidTags;