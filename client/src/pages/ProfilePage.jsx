
import { useEffect, useState } from "react";
import {
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Code,
  Save,
  LoaderCircle,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    education: "",
    graduationYear: "",
    targetRole: "",
    experienceLevel: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Fetch profile information
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        const user = response.data.user;

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          education: user.education || "",
          graduationYear: user.graduationYear || "",
          targetRole: user.targetRole || "",
          experienceLevel: user.experienceLevel || "",
          skills: user.skills || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // Add a new skill
  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const existingSkills = formData.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const alreadyExists = existingSkills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setError("This skill already exists.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...existingSkills, skill].join(", "),
    }));

    setNewSkill("");
    setError("");
    setSuccess("");
  };

  // Remove an existing skill
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(
        (skill) =>
          skill &&
          skill.toLowerCase() !== skillToRemove.toLowerCase()
      );

    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills.join(", "),
    }));

    setSuccess("");
    setError("");
  };

  // Profile completion requirements
  const profileRequirements = [
    {
      label: "Full Name",
      completed: Boolean(formData.fullName.trim()),
    },
    {
      label: "Education Level",
      completed: Boolean(formData.education),
    },
    {
      label: "Graduation Year",
      completed:
        Number.isInteger(Number(formData.graduationYear)) &&
        Number(formData.graduationYear) >= 2000 &&
        Number(formData.graduationYear) <= 2040,
    },
    {
      label: "Target Job Role",
      completed: Boolean(formData.targetRole.trim()),
    },
    {
      label: "Experience Level",
      completed: Boolean(formData.experienceLevel),
    },
    {
      label: "Skills",
      completed: Boolean(
        formData.skills.split(",").some((skill) => skill.trim())
      ),
    },
  ];

  const completedFields = profileRequirements.filter(
    (field) => field.completed
  ).length;

  const completionPercentage = Math.round(
    (completedFields / profileRequirements.length) * 100
  );

  const missingFields = profileRequirements.filter(
    (field) => !field.completed
  );

  // Validate profile information
  const validateProfile = () => {
    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!/^[a-zA-Z\s.'-]+$/.test(formData.fullName.trim())) {
      return "Please enter a valid full name.";
    }

    if (!formData.education) {
      return "Please select your education level.";
    }

    const year = Number(formData.graduationYear);

    if (
      !formData.graduationYear ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2040
    ) {
      return "Please enter a valid graduation year between 2000 and 2040.";
    }

    if (!formData.targetRole.trim()) {
      return "Please enter your target job role.";
    }

    if (!formData.experienceLevel) {
      return "Please select your experience level.";
    }

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      return "Please add at least one skill.";
    }

    const uniqueSkills = new Set(
      skills.map((skill) => skill.toLowerCase())
    );

    if (uniqueSkills.size !== skills.length) {
      return "Duplicate skills are not allowed.";
    }

    return "";
  };

  // Save profile information
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateProfile();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        fullName: formData.fullName.trim(),
        education: formData.education,
        graduationYear: Number(formData.graduationYear),
        targetRole: formData.targetRole.trim(),
        experienceLevel: formData.experienceLevel,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
          .join(", "),
      };

      const response = await api.put("/users/me", payload);

      const updatedUser = response.data.user;

      // Synchronize form with saved profile
      setFormData({
        fullName: updatedUser.fullName || "",
        email: updatedUser.email || "",
        education: updatedUser.education || "",
        graduationYear: updatedUser.graduationYear || "",
        targetRole: updatedUser.targetRole || "",
        experienceLevel: updatedUser.experienceLevel || "",
        skills: updatedUser.skills || "",
      });

      // Update locally saved user information
      const existingUser = JSON.parse(
        localStorage.getItem("careerbridge_user") || "{}"
      );

      localStorage.setItem(
        "careerbridge_user",
        JSON.stringify({
          ...existingUser,
          ...updatedUser,
        })
      );

      setSuccess("Your profile has been updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center text-slate-600">
          Loading your profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Page Heading */}
        <section>
          <p className="text-sm font-medium text-blue-600">
            YOUR ACCOUNT
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your personal information and career preferences.
          </p>
        </section>

        {/* Profile Completion */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Profile Completion
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete your details to improve your career recommendations.
              </p>
            </div>

            <span className="text-2xl font-bold text-blue-700">
              {completionPercentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Missing Profile Information */}
          {missingFields.length > 0 ? (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-800">
                Complete your profile
              </h3>

              <p className="mt-1 text-sm text-amber-700">
                You still have {missingFields.length} section(s) to complete.
              </p>

              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-800">
                {missingFields.map((field) => (
                  <li key={field.label}>
                    {field.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-700">
                Your profile is 100% complete!
              </p>

              <p className="mt-1 text-sm text-green-600">
                Great job! All your profile information is filled in.
              </p>
            </div>
          )}
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

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <UserRound size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500">
                  Your basic account details
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Email cannot be changed here.
                </p>
              </div>
            </div>
          </section>

          {/* Education Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <GraduationCap size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Education Details
                </h2>

                <p className="text-sm text-slate-500">
                  Your academic background
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Education Level
                </label>

                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Select education</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Graduation Year
                </label>

                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  min="2000"
                  max="2040"
                  placeholder="2027"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Career Preferences */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Career Preferences
                </h2>

                <p className="text-sm text-slate-500">
                  Tell us about your career interests
                </p>
              </div>
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
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Experience Level
                </label>

                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Select experience</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>
          </section>

          {/* Skills Management */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Code size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Skills Management
                </h2>

                <p className="text-sm text-slate-500">
                  Add or remove your technical and professional skills.
                </p>
              </div>
            </div>

            {/* Add Skill Input */}
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Add a New Skill
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. JavaScript, React, Python"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                + Add Skill
              </button>
            </div>

            {/* Skills Display */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">
                  Your Skills
                </h3>

                <span className="text-xs text-slate-500">
                  {
                    formData.skills
                      .split(",")
                      .filter((skill) => skill.trim()).length
                  } skills added
                </span>
              </div>

              <div className="flex min-h-16 flex-wrap gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                {formData.skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <span
                      key={skill.toLowerCase()}
                      className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="font-bold text-blue-500 hover:text-red-600"
                        aria-label={`Remove ${skill}`}
                        title={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                {!formData.skills.trim() && (
                  <p className="text-sm text-slate-400">
                    No skills added yet. Add your first skill above.
                  </p>
                )}
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Add skills individually. You can remove any skill using the × button.
            </p>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
