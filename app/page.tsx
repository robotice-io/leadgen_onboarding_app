import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="pt-6" />
          <Image
            src="/landing_logo.png"
            alt="Robotice"
            width={220}
            height={220}
            priority
          />
          <div className="pt-2" />
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center w-full sm:w-80 h-12 rounded-md bg-blue-600 text-white text-base font-medium"
          >
            Empezar
          </Link>
        </div>
      </div>
    </main>
  );
}
