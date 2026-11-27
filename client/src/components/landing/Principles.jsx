const principles = [
  {
    title: "Transparent calculations",
    text: "Skill coverage is calculated by plain code you can inspect. AI explains and prioritises. It does not invent scores.",
  },
  {
    title: "You stay in control",
    text: "Review and correct anything AI extracts or suggests, including details from your resume.",
  },
  {
    title: "Your data, your choice",
    text: "You will be able to delete your personal information whenever you want.",
  },
];

function Principles() {
  return (
    <section id="principles" className="scroll-mt-20 border-t border-primary-100 bg-primary-50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Built to be trusted
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          AI is useful when it is honest about what it can and cannot do.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title} className="rounded-xl border border-primary-100 bg-white p-6">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Principles;