
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Code,
  Wrench,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const categories = ["Technical", "Soft Skill", "Tools", "Other"];

const proficiencyLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const categoryIcons = {
  Technical: Code,
  "Soft Skill": Users,
  Tools: Wrench,
  Other: BookOpen,
};

const initialForm = {
  name: "",
  category: "Technical",
  proficiency: "Beginner",
};

function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/skills");

      setSkills(response.data.skills || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter a skill name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await api.put(`/skills/${editingId}`, form);
        setSuccess("Skill updated successfully!");
      } else {
        await api.post("/skills", form);
        setSuccess("Skill added successfully!");
      }

      resetForm();
      await fetchSkills();
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });

    setEditingId(skill._id);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/skills/${id}`);

      setSuccess("Skill deleted successfully!");
      setSkills((prev) =>
        prev.filter((skill) => skill._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete skill."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Page Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Skills
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your skills and track your proficiency.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-5 py-3">
            <p className="text-sm text-blue-600">
              Total Skills
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {skills.length}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Add / Edit Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Skill" : "Add New Skill"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your skill details below.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Cancel editing"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. React JS"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Proficiency
                </label>
                <select
                  name="proficiency"
                  value={form.proficiency}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {proficiencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Skill"
                    : "Add Skill"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skills List */}
        <div>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Your Skills
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2
                className="animate-spin text-blue-600"
                size={30}
              />
            </div>
          ) : skills.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
              <Code className="mx-auto mb-3 text-slate-400" size={36} />
              <h3 className="font-semibold text-slate-800">
                No skills added yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Start by adding your first skill above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => {
                const Icon =
                  categoryIcons[skill.category] || BookOpen;

                return (
                  <div
                    key={skill._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon size={22} />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(skill)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          aria-label={`Edit ${skill.name}`}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(skill._id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${skill.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {skill.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {skill.category}
                      </span>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {skill.proficiency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SkillsPage;
