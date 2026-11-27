import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

function DesignPreviewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CareerBridge Design System</h1>
        <p className="mt-1 text-slate-600">
          Temporary preview page for development.
        </p>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Saving...</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Inputs</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="name" label="Full name" placeholder="Rashi Sharma" />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@college.edu"
            error="Please enter a valid email address"
          />
        </div>
      </Card>

      <Card className="border-primary-200 bg-primary-50">
        <h2 className="text-lg font-semibold text-primary-900">Highlighted card</h2>
        <p className="mt-1 text-primary-800">
          Light blue backgrounds mark selected or important sections.
        </p>
      </Card>
    </div>
  );
}

export default DesignPreviewPage;