import Wizard from "./_components/Wizard";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0)_60%,rgba(2,6,23,0.03)_100%)]">
      <TopBar />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <Wizard />
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="w-full border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <div className="font-semibold">Robotice</div>
            <div className="text-xs text-black/60 dark:text-white/60">Cold Email Setup Wizard</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white grid grid-cols-2 grid-rows-2 gap-1 p-1">
      <div className="rounded-sm bg-white/90" />
      <div className="rounded-sm bg-white/90" />
      <div className="rounded-sm bg-white/90" />
      <div className="rounded-sm bg-white/90" />
    </div>
  );
}



