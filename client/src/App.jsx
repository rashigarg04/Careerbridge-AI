
import { Routes, Route } from "react-router";

import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import DesignPreviewPage from "./pages/DesignPreviewPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import CareerGoalsPage from "./pages/CareerGoalsPage";
import SkillsPage from "./pages/SkillsPage";
import ResumeAnalyzerPage from "./pages/ResumeAnalyzerPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/design" element={<DesignPreviewPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/career-goals" element={<CareerGoalsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />

      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
