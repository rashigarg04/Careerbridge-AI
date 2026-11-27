import { Link } from "react-router";
import Button from "../ui/Button";
import Card from "../ui/Card";

const exampleSkills = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 75 },
  { name: "JavaScript", level: 60 },
  { name: "React.js", level: 40 },
  { name: "Git", level: 20 },
];

const coverage = Math.round(
  exampleSkills.reduce((sum, skill) => sum + skill.level, 0) /
    exampleSkills.length
);

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
      <div>
        <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
          For Indian college students and fresh graduates
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find your career path.{" "}
          <span className="text-primary-600">Close your skill gaps.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">
          CareerBridge compares your skills with what a target role needs, then
          builds a learning roadmap that adapts as you make progress.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to="/signup" className="px-6 py-3">
            Get started
          </Button>
          <Button as="a" href="/#how-it-works" variant="secondary" className="px-6 py-3">
            See how it works
          </Button>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Target role</p>
            <p className="text-lg font-semibold text-slate-900">Frontend Developer</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            Illustrative example
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {exampleSkills.map((skill) => (
            <div key={skill.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{skill.name}</span>
                <span className="text-slate-500">{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary-600"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-800">
          Skill coverage: <strong>{coverage}%</strong>, the average of the
          skill levels above.
        </div>
      </Card>
    </section>
  );
}

export default Hero;