
import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  CalendarDays,
  Pencil,
  Trash2,
  LoaderCircle,
  X,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const initialFormData = {
  title: "",
  description: "",
  targetRole: "",
  targetDate: "",
  status: "Not Started",
  progress: 0,
};

function CareerGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch career goals
  const fetchGoals = async () => {
    try {
      setLoading(true);

      const response = await api.get("/career-goals");

      setGoals(response.data.goals || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load career goals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));

    setError("");
    setSuccess("");
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // Create or update a career goal
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter a goal title.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetRole: formData.targetRole.trim(),
        targetDate: formData.targetDate || null,
      };

      if (editingId) {
        await api.put(`/career-goals/${editingId}`, payload);
        setSuccess("Career goal updated successfully!");
      } else {
        await api.post("/career-goals", payload);
        setSuccess("Career goal added successfully!");
      }

      resetForm();
      await fetchGoals();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save career goal."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit career goal
  const handleEdit = (goal) => {
    setFormData({
      title: goal.title || "",
      description: goal.description || "",
      targetRole: goal.targetRole || "",
      targetDate: goal.targetDate
        ? new Date(goal.targetDate).toISOString().slice(0, 10)
        : "",
      status: goal.status || "Not Started",
      progress: goal.progress ?? 0,
    });

    setEditingId(goal._id);
    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete career goal
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this career goal?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/career-goals/${id}`);

      setGoals((prev) =>
        prev.filter((goal) => goal._id !== id)
      );

      setSuccess("Career goal deleted successfully!");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete career goal."
      );
    }
  };

  // Update progress directly
  const handleProgressChange = async (goal, value) => {
    const progress = Number(value);

    try {
      const response = await api.put(
        `/career-goals/${goal._id}`,
        {
          progress,
          status:
            progress === 100
              ? "Completed"
              : progress > 0
                ? "In Progress"
                : "Not Started",
        }
      );

      setGoals((prev) =>
        prev.map((item) =>
          item._id === goal._id
            ? response.data.goal
            : item
        )
      );

      setError("");
      setSuccess("Goal progress updated!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update progress."
      );
    }
  };

  const getStatusColor = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Page Heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              YOUR CAREER JOURNEY
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Career Goals
            </h1>

            <p className="mt-2 text-slate-600">
              Set your career targets and track your progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={19} />
            Add New Goal
          </button>
        </section>

        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Target size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Goals
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {goals.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <TrendingUp size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  In Progress
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {goals.filter(
                    (goal) => goal.status === "In Progress"
                  ).length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <CheckCircle size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {goals.filter(
                    (goal) => goal.status === "Completed"
                  ).length}
                </h2>
              </div>
            </div>
          </div>

        </section>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Add / Edit Goal Form */}
        {showForm && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Career Goal" : "Create New Goal"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Goal Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Become a Frontend Developer"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe what you want to achieve..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target Job Role
                  </label>

                  <input
                    type="text"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    placeholder="e.g. React Developer"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target Completion Date
                  </label>

                  <input
                    type="date"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {editingId && (
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Goal Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Progress ({formData.progress}%)
                    </label>

                    <input
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={handleChange}
                      className="mt-4 w-full accent-blue-600"
                    />
                  </div>

                </div>
              )}

              <div className="flex flex-wrap justify-end gap-3">

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingId ? "Update Goal" : "Save Goal"
                  )}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* Goals List */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Your Career Goals
          </h2>

          {loading ? (
            <div className="py-16 text-center text-slate-600">
              <LoaderCircle className="mx-auto mb-3 animate-spin" size={28} />
              Loading your career goals...
            </div>
          ) : goals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <Target size={42} className="mx-auto text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-800">
                No career goals yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start planning your future by adding your first career goal.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">

              {goals.map((goal) => (
                <article
                  key={goal._id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {goal.title}
                      </h3>

                      {goal.targetRole && (
                        <p className="mt-1 text-sm text-blue-600">
                          {goal.targetRole}
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(goal.status)}`}
                    >
                      {goal.status}
                    </span>

                  </div>

                  {goal.description && (
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {goal.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={17} />

                    {goal.targetDate
                      ? new Date(goal.targetDate).toLocaleDateString()
                      : "No target date set"}
                  </div>

                  {/* Progress */}
                  <div className="mt-5">

                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Progress
                      </span>

                      <span className="text-sm font-bold text-blue-700">
                        {goal.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${goal.progress}%`,
                        }}
                      />
                    </div>

                  </div>

                  {/* Quick Progress Update */}
                  {goal.status !== "Completed" && (
                    <div className="mt-4">
                      <label className="mb-2 block text-xs font-medium text-slate-500">
                        Update progress
                      </label>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) =>
                          handleProgressChange(goal, e.target.value)
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4">

                    <button
                      type="button"
                      onClick={() => handleEdit(goal)}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(goal._id)}
                      className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
}

export default CareerGoalsPage;
