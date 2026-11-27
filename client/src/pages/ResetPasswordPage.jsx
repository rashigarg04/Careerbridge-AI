import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/ui/Button";
import api from "../services/api";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successful! Please log in with your new password." },
        });
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired reset link. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={success ? "Password reset complete" : "Set a new password"}
      subtitle={
        success
          ? "Your password has been securely updated."
          : "Please choose a strong new password for your account."
      }
      footerText="Remembered your password?"
      footerLink="/login"
      footerLabel="Log in"
    >
      {success ? (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <p className="text-sm text-slate-600">
            Redirecting you to the login page in a few seconds...
          </p>
          <Link
            to="/login"
            className="inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Click here if you are not redirected
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-slate-300 py-3 pr-10 pl-10 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-slate-300 py-3 pr-10 pl-10 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ResetPasswordPage;
