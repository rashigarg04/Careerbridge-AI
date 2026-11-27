const steps = [
  {
    title: "Tell us about you",
    text: "Add your education, skills, projects and interests.",
  },
  {
    title: "Choose a target role",
    text: "Pick a role such as Frontend Developer or Data Analyst.",
  },
  {
    title: "See your skill gaps",
    text: "Your skills are compared with the role's requirements using clear calculations.",
  },
  {
    title: "Follow your roadmap",
    text: "Complete tasks and assessments. Your next steps update as you progress.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-slate-100 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          How it works
        </h2>

        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;