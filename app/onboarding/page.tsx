import Wizard from "./_components/Wizard";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 sm:p-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Robotice Leadgen — Onboarding</h1>
        <Wizard />
      </div>
    </div>
  );
}


