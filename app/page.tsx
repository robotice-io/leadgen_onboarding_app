import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6">
      <div className={`w-full max-w-2xl text-center ${poppins.className}`}>
        <div className="flex flex-col items-center gap-6">
          <div className="pt-6" />
          <Image
            src="/landing_logo.png"
            alt="Robotice"
            width={280}
            height={280}
            priority
          />
          <h1 className="text-2xl font-semibold">Onboarding LeadGen</h1>
          <p className="text-sm text-black/70 dark:text-white/70 max-w-md">
            Configura el acceso de Gmail para que podamos enviar correos desde tu cuenta de forma segura, sin necesidad de acceder a tu bandeja.
          </p>
          <div className="pt-1" />
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-64 h-11 rounded-md bg-blue-600 text-white text-base font-semibold"
          >
            Empezar
          </Link>
        </div>
      </div>
    </main>
  );
}
