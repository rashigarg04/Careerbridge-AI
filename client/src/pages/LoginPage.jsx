
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/ui/Button";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const successMessage = location.state?.message || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const data = response.data;

      // Save authentication token
      localStorage.setItem("careerbridge_token", data.token);

      // Save user details
      localStorage.setItem(
        "careerbridge_user",
        JSON.stringify(data.user)
      );

      // Smart login redirection
      if (data.user.onboardingCompleted) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }

    } catch (error) {
      setServerError(
        error.response?.data?.message || error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your career journey."
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLabel="Create account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {successMessage && (
          <p className="text-sm text-green-600">
            {successMessage}
          </p>
        )}

        {serverError && (
          <p className="text-sm text-red-600">
            {serverError}
          </p>
        )}

        {/* Email Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            required
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <Button type="submit" block disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>

      </form>
    </AuthLayout>
  );
}

export default LoginPage;
