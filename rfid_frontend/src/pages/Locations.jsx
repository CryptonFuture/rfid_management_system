import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  MapPin,
  Building2,
  Layers3,
  DoorOpen,
  Map,
  Search,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Locations = () => {
  const { isAdmin } = useAuth();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    building: '',
    floor: '',
    room: '',
  });

  const fetchLocations = async () => {
    try {
      const res = await api.get('/locations');
      setLocations(res.data.data);
    } catch (error) {
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      building: '',
      floor: '',
      room: '',
    });
  };

  const openModal = (loc = null) => {
    if (loc) {
      setEditing(loc._id);

      setForm({
        name: loc.name || '',
        description: loc.description || '',
        building: loc.building || '',
        floor: loc.floor || '',
        room: loc.room || '',
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
        await api.put(`/locations/${editing}`, form);
        toast.success('Location updated successfully');
      } else {
        await api.post('/locations', form);
        toast.success('Location created successfully');
      }

      closeModal();
      fetchLocations();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Operation failed'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this location?')) return;

    try {
      await api.delete(`/locations/${id}`);

      toast.success('Location deleted successfully');
      fetchLocations();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Delete failed'
      );
    }
  };

  const filteredLocations = locations.filter((loc) => {
    const query = search.toLowerCase();

    return (
      loc.name?.toLowerCase().includes(query) ||
      loc.description?.toLowerCase().includes(query) ||
      loc.building?.toLowerCase().includes(query) ||
      loc.floor?.toString().toLowerCase().includes(query) ||
      loc.room?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-full space-y-7">

      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute right-10 top-5 hidden opacity-[0.035] lg:block">
          <Map className="h-48 w-48 text-slate-900" />
        </div>

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <MapPin className="h-7 w-7" />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Locations
                </h1>

                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {locations.length} Locations
                </span>

              </div>

              <p className="mt-1.5 text-sm text-slate-500">
                Manage and organize your asset locations.
              </p>

            </div>

          </div>

          <button
            onClick={() => openModal()}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            Add Location
            <ChevronRight className="h-4 w-4 opacity-70" />
          </button>

        </div>
      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-100/50 blur-2xl transition-transform duration-500 group-hover:scale-150" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Locations
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {locations.length}
              </p>

            </div>

            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600 transition-transform group-hover:scale-110">
              <MapPin className="h-5 w-5" />
            </div>

          </div>

        </div>


        {/* Buildings */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-transform duration-500 group-hover:scale-150" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Buildings
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {
                  new Set(
                    locations
                      .filter((loc) => loc.building)
                      .map((loc) => loc.building)
                  ).size
                }
              </p>

            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-transform group-hover:scale-110">
              <Building2 className="h-5 w-5" />
            </div>

          </div>

        </div>


        {/* Rooms */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-100/50 blur-2xl transition-transform duration-500 group-hover:scale-150" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Rooms
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {
                  new Set(
                    locations
                      .filter((loc) => loc.room)
                      .map((loc) => loc.room)
                  ).size
                }
              </p>

            </div>

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600 transition-transform group-hover:scale-110">
              <DoorOpen className="h-5 w-5" />
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search locations, buildings, floors or rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
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


      {/* =====================================================
          LOCATIONS GRID
      ===================================================== */}
      {loading ? (

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="relative flex h-14 w-14 items-center justify-center">

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-cyan-500" />

            <MapPin className="h-5 w-5 text-cyan-500" />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading locations...
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredLocations.map((loc, index) => (

            <div
              key={loc._id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"
            >

              {/* Top gradient */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />

              {/* Background decoration */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-50 blur-2xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative p-5">

                {/* Card header */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600 ring-1 ring-cyan-100 transition-all duration-300 group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate font-bold text-slate-900">
                        {loc.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        <span className="text-[11px] font-medium text-emerald-600">
                          Active Location
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Actions */}
                  <div className="flex shrink-0 gap-1">

                    <button
                      onClick={() => openModal(loc)}
                      title="Edit location"
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() =>
                          handleDelete(loc._id)
                        }
                        title="Delete location"
                        className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                  </div>

                </div>


                {/* Description */}
                <div className="mt-5 flex min-h-[42px] gap-2">

                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />

                  <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                    {loc.description ||
                      'No description available for this location.'}
                  </p>

                </div>


                {/* Location details */}
                <div className="mt-5 grid grid-cols-3 gap-2">

                  {/* Building */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

                    <Building2 className="h-4 w-4 text-blue-500" />

                    <p className="mt-2 truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Building
                    </p>

                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                      {loc.building || '—'}
                    </p>

                  </div>


                  {/* Floor */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

                    <Layers3 className="h-4 w-4 text-violet-500" />

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Floor
                    </p>

                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                      {loc.floor || '—'}
                    </p>

                  </div>


                  {/* Room */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

                    <DoorOpen className="h-4 w-4 text-cyan-500" />

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Room
                    </p>

                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                      {loc.room || '—'}
                    </p>

                  </div>

                </div>


                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                  <span className="text-[10px] font-medium text-slate-400">
                    Location #{String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Manage
                    <ChevronRight className="h-3 w-3" />
                  </span>

                </div>

              </div>

            </div>

          ))}


          {/* =================================================
              EMPTY STATE
          ================================================= */}
          {filteredLocations.length === 0 && (

            <div className="col-span-full rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">

              <div className="mx-auto flex max-w-sm flex-col items-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                  <MapPin className="h-8 w-8" />
                </div>

                <h3 className="mt-5 font-bold text-slate-800">
                  {search
                    ? 'No locations found'
                    : 'No locations yet'}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {search
                    ? 'Try changing your search criteria.'
                    : 'Create your first location to start organizing assets.'}
                </p>

                {!search && (
                  <button
                    onClick={() => openModal()}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    Add Location
                  </button>
                )}

              </div>

            </div>

          )}

        </div>
      )}


      {/* =====================================================
          PREMIUM MODAL
      ===================================================== */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeModal}
          />


          {/* Modal */}
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 px-6 py-6">

              <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />

              <div className="relative flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/10">

                    {editing ? (
                      <Edit2 className="h-5 w-5" />
                    ) : (
                      <MapPin className="h-6 w-6" />
                    )}

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-white">
                      {editing
                        ? 'Edit Location'
                        : 'Add New Location'}
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-400">
                      {editing
                        ? 'Update location information'
                        : 'Create a new asset location'}
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
            <div className="max-h-[calc(92vh-105px)] overflow-y-auto">

              <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
              >

                {/* Basic Information */}
                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div className="h-1 w-5 rounded-full bg-cyan-500" />

                    <h3 className="text-sm font-bold text-slate-800">
                      Location Information
                    </h3>

                  </div>


                  <div className="space-y-4">

                    {/* Name */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Location Name *
                      </label>

                      <div className="relative">

                        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g. Main Office"
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
                          placeholder="Describe this location..."
                        />

                      </div>

                    </div>

                  </div>

                </div>


                {/* Address Details */}
                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <div className="h-1 w-5 rounded-full bg-blue-500" />

                    <h3 className="text-sm font-bold text-slate-800">
                      Location Details
                    </h3>

                  </div>


                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    {/* Building */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Building
                      </label>

                      <div className="relative">

                        <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-3 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.building}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              building: e.target.value,
                            })
                          }
                          placeholder="Building"
                        />

                      </div>

                    </div>


                    {/* Floor */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Floor
                      </label>

                      <div className="relative">

                        <Layers3 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-3 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.floor}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              floor: e.target.value,
                            })
                          }
                          placeholder="Floor"
                        />

                      </div>

                    </div>


                    {/* Room */}
                    <div>

                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Room
                      </label>

                      <div className="relative">

                        <DoorOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-3 text-sm outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                          value={form.room}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              room: e.target.value,
                            })
                          }
                          placeholder="Room"
                        />

                      </div>

                    </div>

                  </div>

                </div>


                {/* Preview */}
                <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/70 to-blue-50/70 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                        Location Preview
                      </p>

                      <p className="mt-0.5 truncate font-semibold text-slate-800">
                        {form.name || 'Location Name'}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {[
                          form.building,
                          form.floor
                            ? `Floor ${form.floor}`
                            : '',
                          form.room
                            ? `Room ${form.room}`
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' • ') ||
                          'Building • Floor • Room'}
                      </p>

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
                        Update Location
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                        Create Location
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

export default Locations;