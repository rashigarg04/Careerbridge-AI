
import { useEffect, useState } from "react";
import {
  Target,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  User,
  CheckCircle,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [goalsCount, setGoalsCount] = useState(0);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userResponse, goalsResponse, skillsResponse] =
          await Promise.all([
            api.get("/users/me"),
            api.get("/career-goals"),
            api.get("/skills"),
          ]);

        const userData = userResponse.data.user;

        setUser(userData);

        const existingUser = JSON.parse(
          localStorage.getItem("careerbridge_user") || "{}"
        );

        localStorage.setItem(
          "careerbridge_user",
          JSON.stringify({
            ...existingUser,
            ...userData,
          })
        );

        const goals = goalsResponse.data.goals || [];

        setGoalsCount(
          goalsResponse.data.count ?? goals.length
        );

        setSkills(skillsResponse.data.skills || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center text-slate-600">
          Loading your dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const skillsCount = skills.length;

  const stats = [
    {
      title: "Career Goals",
      value: goalsCount,
      description: "Goals created",
      icon: Target,
    },
    {
      title: "Skills",
      value: skillsCount,
      description: "Skills identified",
      icon: TrendingUp,
    },
    {
      title: "Assessments",
      value: "0",
      description: "Completed assessments",
      icon: ClipboardCheck,
    },
    {
      title: "Learning Tasks",
      value: "0",
      description: "Tasks completed",
      icon: BookOpen,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Welcome Section */}
        <section>
          <p className="text-sm font-medium text-blue-600">
            YOUR CAREER JOURNEY STARTS HERE
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome back, {user.name}!
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Take control of your professional growth.
            Explore your skills, set career goals, and
            build a personalized learning journey.
          </p>
        </section>

        {/* Statistics Cards */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Your Career Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {stat.title}
                      </p>

                      <h3 className="mt-2 text-3xl font-bold text-slate-900">
                        {stat.value}
                      </h3>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                      <Icon size={23} />
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* User Career Profile */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <User size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Career Profile
              </h2>

              <p className="text-sm text-slate-500">
                Your saved onboarding information
              </p>
            </div>
          </div>

          {user.onboardingCompleted ? (
            <div className="mt-6 space-y-4">

              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={19} />
                <span className="text-sm font-medium">
                  Onboarding completed
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-slate-500">
                    Full Name
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {user.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Target Role
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {user.targetRole}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Education
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {user.education}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Graduation Year
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {user.graduationYear}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Experience Level
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {user.experienceLevel}
                  </p>
                </div>

              </div>

              {/* Skills from MongoDB */}
              <div>
                <p className="text-sm text-slate-500">
                  Your Skills
                </p>

                {skills.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <div
                        key={skill._id}
                        className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3"
                      >
                        <p className="text-sm font-semibold text-blue-800">
                          {skill.name}
                        </p>

                        <p className="mt-1 text-xs text-blue-600">
                          {skill.category} · {skill.proficiency}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    No skills added yet. Start adding skills to your profile.
                  </p>
                )}
              </div>

            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-600">
              Your onboarding profile is not completed yet.
              Complete onboarding to see your career details here.
            </p>
          )}

        </section>

        {/* Getting Started Section */}
        <section className="rounded-xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900">
              Let's build your career roadmap
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Start by identifying your career interests
              and current skills. CareerBridge will help
              you understand what to learn next.
            </p>

            <div className="mt-5 flex items-center gap-2 font-medium text-blue-700">
              <span>
                Personalized career guidance coming soon
              </span>
              <ArrowRight size={18} />
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                <BookOpen size={22} />
              </div>

              <div>
                <h3 className="font-medium text-slate-800">
                  No activity yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your career activities will appear here
                  as you use CareerBridge.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
