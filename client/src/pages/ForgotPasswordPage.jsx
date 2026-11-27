import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, CheckCircle, ExternalLink } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/ui/Button";
import api from "../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSubmitted(true);
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={submitted ? "Check your email" : "Forgot your password?"}
      subtitle={
        submitted
          ? "We've created a secure password reset link for your account."
          : "Enter your registered email address to reset your password."
      }
      footerText="Remember your password?"
      footerLink="/login"
      footerLabel="Log in"
    >
      {submitted ? (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle size={48} className="text-green-600" />
          </div>

          <p className="text-sm text-slate-600">
            If an account exists for <span className="font-semibold text-slate-800">{email}</span>, a secure password reset link is ready.
          </p>

          {resetUrl && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Development Preview Reset Link
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Since local development does not send real emails, you can click this link directly:
              </p>
              <a
                href={resetUrl}
                className="mt-2 inline-flex items-center gap-1 break-all text-xs font-medium text-blue-600 hover:underline"
              >
                <span>{resetUrl}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 py-3 pr-4 pl-10 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Generating link..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
