
import { Link } from "react-router";

function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLabel }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Left information panel */}
        <div className="hidden md:flex flex-col justify-between bg-primary-600 text-white p-10">

          <Link to="/" className="text-2xl font-bold">
            CareerBridge
          </Link>

          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Build your career with confidence.
            </h2>

            <p className="mt-4 text-blue-100 leading-relaxed">
              Discover your skills, identify your gaps and
              create a personalised roadmap for your future.
            </p>
          </div>

          <p className="text-sm text-blue-100">
            Your journey. Your skills. Your future.
          </p>

        </div>

        {/* Right form panel */}
        <div className="p-6 sm:p-10">

          <Link to="/" className="text-sm text-primary-600 font-medium">
            ← Back to home
          </Link>

          <div className="mt-8 mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {title}
            </h1>

            <p className="mt-2 text-slate-500">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="mt-8 text-center text-sm text-slate-600">
            {footerText}{" "}
            <Link
              to={footerLink}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              {footerLabel}
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;
