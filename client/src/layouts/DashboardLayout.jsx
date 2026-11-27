
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  UserRound,
  Target,
  ClipboardCheck,
  BookOpen,
  Video,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  FileText,
} from "lucide-react";

const navigationItems = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "My Profile", icon: UserRound },
  { name: "Career Goals", icon: Target },
  { name: "Skill Assessment", icon: ClipboardCheck },
  { name: "Learning Roadmap", icon: BookOpen },
  { name: "Mock Interviews", icon: Video },
  { name: "Settings", icon: Settings },
  { name: "Resume Analyzer", icon: FileText },
];

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("careerbridge_token");
    localStorage.removeItem("careerbridge_user");

    navigate("/login", { replace: true });
  };

  const renderNavigation = () => (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.name;

        return (
          <button
            key={item.name}
            type="button"
            onClick={() => {
  setActivePage(item.name);
  setMobileMenuOpen(false);

  if (item.name === "My Profile") {
    navigate("/profile");
  }

  if (item.name === "Overview") {
    navigate("/dashboard");
  }
  if (item.name === "Career Goals") {
  navigate("/career-goals");
}
if (item.name === "Skill Assessment") {
  navigate("/skills");
}
if (item.name === "Resume Analyzer") {
  navigate("/resume-analyzer");
}
}}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon size={19} />
            {item.name}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 md:block">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-blue-700">
              CareerBridge
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Your Career Companion
            </p>
          </div>

          {renderNavigation()}
        </aside>

        {/* Main Dashboard Area */}
        <div className="min-w-0 flex-1">

          {/* Topbar */}
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {activePage}
                </h2>
                <p className="hidden text-sm text-slate-500 sm:block">
                  Welcome to your CareerBridge dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                RG
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </header>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="border-b border-slate-200 bg-white p-4 md:hidden">
              {renderNavigation()}
            </div>
          )}

          {/* Page Content */}
          <main className="p-5 sm:p-8">
            {children || (
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Welcome to CareerBridge!
                </h3>

                <p className="mt-2 text-slate-600">
                  Your personalized career journey starts here.
                </p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
