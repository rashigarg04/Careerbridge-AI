import {
  Target,
  FileText,
  ListChecks,
  Route,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Card from "../ui/Card";

const features = [
  {
    icon: Target,
    title: "Career guidance",
    text: "Get role suggestions with clear reasons, based on your skills, interests and education. Guidance, not predictions.",
  },
  {
    icon: ListChecks,
    title: "Skill gap analysis",
    text: "See which skills you already have, which are weak and which are missing for your target role.",
  },
  {
    icon: Route,
    title: "Personalised roadmap",
    text: "Weekly goals, practice tasks and resources, updated as you complete work.",
  },
  {
    icon: FileText,
    title: "Resume analysis",
    text: "Upload your resume and see how it matches a role. You can review and correct everything extracted.",
  },
  {
    icon: MessageSquare,
    title: "Mock interviews",
    text: "Practise technical and HR questions and get feedback on your answers.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    text: "Follow completed tasks, roadmap progress and interview practice in one dashboard.",
  },
];

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-slate-100 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Everything you need to get job-ready
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            One place to understand where you stand and what to do next.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <feature.icon size={20} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.text}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;