function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">CareerBridge</p>
            <p className="mt-1 text-sm text-slate-600">
              Discover your potential. Identify your gaps. Build your future.
            </p>
          </div>
          <p className="max-w-md text-sm text-slate-500">
            CareerBridge offers guidance based on your own information. It does
            not predict or guarantee career outcomes.
          </p>
        </div>
        <p className="mt-8 border-t border-slate-100 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} CareerBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;